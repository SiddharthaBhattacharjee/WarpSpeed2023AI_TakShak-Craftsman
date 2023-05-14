import os
from twilio.rest import Client

def sendMSG(msg, ph_no) :
    account_sid = "ACb8b05c3a3b447064a4dc61795ef83455"
    auth_token = "210d506d352e5754ba5edc140001988a"
    client = Client(account_sid, auth_token)
    message = client.messages.create(
      body=msg,
      from_="+12707704034",
      to=ph_no
    )
    return (message.sid)