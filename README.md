# 📅 Appointment Booking System

A full-stack WhatsApp appointment reminder system built for the Better Call Centers / El Paso Water Quality LLC practical test.

## 🔗 Live Demo
**Frontend:** https://appointment-system-sandy-iota.vercel.app  
**Backend API:** https://appointment-system-u4eb.onrender.com

## ✅ Features
- Book appointments via a clean web form (name, phone, date & time)
- Saves appointments to Supabase PostgreSQL database
- Sends instant WhatsApp confirmation via Twilio on booking
- Live dashboard showing all appointments pulled from the database
- **Bonus:** Auto-reminder sent if appointment is within 1 hour (checks every 5 minutes)

## 🛠 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL) |
| Messaging | Twilio WhatsApp API |
| Hosting | Vercel (frontend) + Render (backend) |

## 📁 Project Structure

appointment-system/
├── backend/
│   ├── main.py          # FastAPI app, routes, Twilio, scheduler
│   ├── requirements.txt
│   └── .env             # (not committed - contains secrets)
└── frontend/
└── src/
└── App.jsx      # React UI - form + dashboard

## 🚀 Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# create .env with your credentials
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables
Create `backend/.env` with:

SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_publishable_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
YOUR_WHATSAPP_NUMBER=whatsapp:+91XXXXXXXXXX

## 📊 How It Works
1. User fills the form → frontend sends POST to `/appointments`
2. Backend saves to Supabase + fires Twilio WhatsApp confirmation
3. Dashboard fetches GET `/appointments` live on every load
4. Background scheduler runs every 5 min → sends reminder if appointment is within 60 min
