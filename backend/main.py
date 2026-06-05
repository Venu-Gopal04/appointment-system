from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from twilio.rest import Client
from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv
from datetime import datetime, timezone
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
twilio_client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

TWILIO_FROM = os.getenv("TWILIO_WHATSAPP_NUMBER")
YOUR_NUMBER = os.getenv("YOUR_WHATSAPP_NUMBER")

class Appointment(BaseModel):
    customer_name: str
    phone_number: str
    appointment_time: str

@app.post("/appointments")
def create_appointment(appt: Appointment):
    data = supabase.table("appointments").insert({
        "customer_name": appt.customer_name,
        "phone_number": appt.phone_number,
        "appointment_time": appt.appointment_time,
    }).execute()

    from datetime import datetime as dt
    appt_time_formatted = dt.fromisoformat(appt.appointment_time.replace("Z","")).strftime("%B %d, %Y at %I:%M %p")

    try:
        twilio_client.messages.create(
            from_=TWILIO_FROM,
            to=YOUR_NUMBER,
            body=f"✅ Appointment Confirmed!\nName: {appt.customer_name}\nPhone: {appt.phone_number}\nTime: {appt_time_formatted}"
        )
    except Exception as e:
        print(f"WhatsApp error: {e}")

    return {"message": "Appointment booked successfully", "data": data.data}

@app.get("/appointments")
def get_appointments():
    data = supabase.table("appointments").select("*").order("appointment_time").execute()
    return data.data

def check_reminders():
    now = datetime.now(timezone.utc)
    data = supabase.table("appointments").select("*").eq("reminder_sent", False).execute()
    for appt in data.data:
        appt_time = datetime.fromisoformat(appt["appointment_time"])
        diff_minutes = (appt_time - now).total_seconds() / 60
        if 0 < diff_minutes <= 60:
            try:
                twilio_client.messages.create(
                    from_=TWILIO_FROM,
                    to=YOUR_NUMBER,
                    body=f"⏰ Reminder! {appt['customer_name']} has an appointment in {int(diff_minutes)} minutes."
                )
                supabase.table("appointments").update({"reminder_sent": True}).eq("id", appt["id"]).execute()
            except Exception as e:
                print(f"Reminder error: {e}")

scheduler = BackgroundScheduler()
scheduler.add_job(check_reminders, "interval", minutes=5)
scheduler.start()