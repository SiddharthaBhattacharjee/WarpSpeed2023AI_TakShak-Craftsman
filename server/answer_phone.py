from flask import Flask, request
import requests
import time
from twilio.twiml.voice_response import VoiceResponse
app = Flask(__name__)
base_url = "https://api.assemblyai.com/v2"

headers = {
    "authorization": "API-KEY"
}


@app.route("/answer", methods=['GET', 'POST'])
def answer_call():
    """Respond to incoming phone calls with a brief message."""
    # Start our TwiML response
    resp = VoiceResponse()

    # Read a message aloud to the caller
    resp.say(
        "Hello, thank you for calling. Please leave a message after the beep.", voice='alice')
    resp.record(maxLength="30", action="/handle-recording")
    resp.say("Thank you for your message. Goodbye.", voice='alice')
    return str(resp)


@app.route("/handle-recording", methods=['GET', 'POST'])
def handle_recording():
    recording_url = request.form['RecordingUrl']
    data = {
        "audio_url": recording_url
    }
    url = base_url + "/transcript"
    response = requests.post(url, json=data, headers=headers)
    transcript_id = response.json()['id']
    polling_endpoint = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
    while True:
        transcription_result = requests.get(
            polling_endpoint, headers=headers).json()

        if transcription_result['status'] == 'completed':
            print(transcription_result['text'])
            break

        elif transcription_result['status'] == 'error':
            raise RuntimeError(
                f"Transcription failed: {transcription_result['error']}")

        else:
            time.sleep(3)
    return "OK"


if __name__ == "__main__":
    app.run(debug=True)