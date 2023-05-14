from flask import Flask, request
import requests
import time
from twilio.twiml.voice_response import VoiceResponse
from twilio.rest import Client
from threading import Thread
from gpt import send_req
from datetime import datetime
import json
from sendSMS import sendMSG;
app = Flask(__name__)
base_url = "https://api.assemblyai.com/v2"

headers = {"authorization": "56b358be260841d0acc6c2480ceafa2e"}
client = Client("ACb8b05c3a3b447064a4dc61795ef83455", "210d506d352e5754ba5edc140001988a")

@app.route("/answer", methods=['GET', 'POST'])
def answer_call():
  """Respond to incoming phone calls with a brief message."""
  # Start our TwiML response
  resp = VoiceResponse()

  # Read a message aloud to the caller
  resp.say(
    # "Hello, this is AI the emergency helpline. Please state your name, current location, and describe your emergency situation, Cut the call when you are finished, Your request will be registered once you end the call and we will notify you as your request is registered.",
    "hi",voice='alice')
  resp.record(maxLength="120", action="/handle-recording")
  resp.say("Thank you for your message. Goodbye.", voice='alice')
  return str(resp)



@app.route("/handle-recording", methods=['GET', 'POST'])
def handle_recording():
  recording_url = request.form['RecordingUrl']
  data = {"audio_url": recording_url}
  url = base_url + "/transcript"
  response = requests.post(url, json=data, headers=headers)
  transcript_id = response.json()['id']
  polling_endpoint = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
  while True:
    transcription_result = requests.get(polling_endpoint,
                                        headers=headers).json()

    if transcription_result['status'] == 'completed':
      # Get the call sid from the request
      call_sid = request.form['CallSid']

      # Get the call details from Twilio
      call = client.calls(call_sid).fetch()
      caller_number = call.from_formatted

      print(caller_number)
      print("Getting priority info from OpenAI");
      transcription_text = transcription_result['text'];
      resp = send_req(transcribed_text=transcription_text)
    #   summary = transcription_text[:150] + "..."
      print("Got response from OpenAI");
      msg = "";
      try:
        print("Debug:: TRY")
        print(resp);
        d = json.loads(resp)
        print(d["emergency_type"])
        msg=d["reply_msg"];
        name=d["name"];
        location=d["location"];
        emergency_type=d["emergency_type"];
        priority=d["priority"];
      except:
        print("Debug:: EXCEPT")
      
      print("Sending message to user");
      
    #   print(message.status_code)
      rand_12_digit_id = str(time.time()).replace(".", "")[:12];
      getCurrentTime = str(datetime.now())
      print(name, location, emergency_type, transcription_text, priority, getCurrentTime, rand_12_digit_id);
      data = {
        "name": name,
        "Location": location,
        "priority": priority,
        "attention": emergency_type,
        "summary": msg,
        "phone": caller_number,
        "transcription": transcription_text,
      }
      print(sendMSG(msg, caller_number));
    #   #Write data in blockchain 
      break

    elif transcription_result['status'] == 'error':
      raise RuntimeError(
        f"Transcription failed: {transcription_result['error']}")

    else:
      time.sleep(3)
  return "OK"


def run():
  app.run(host='0.0.0.0', port=80)


def keep_alive():
  t = Thread(target=run)
  t.start()


keep_alive()
