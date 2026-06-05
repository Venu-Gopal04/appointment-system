import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [form, setForm] = useState({ customer_name: "", phone_number: "", appointment_time: "" });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API}/appointments`);
      setAppointments(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleSubmit = async () => {
    if (!form.customer_name || !form.phone_number || !form.appointment_time) {
      setMessage("error"); return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/appointments`, {
        ...form,
        appointment_time: new Date(form.appointment_time).toISOString(),
      });
      setMessage("success");
      setForm({ customer_name: "", phone_number: "", appointment_time: "" });
      fetchAppointments();
    } catch (e) { setMessage("error"); }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", minHeight: "100vh", background: "#f7f8f5" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e4", padding: "14px 32px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: "#2D6A4F", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18 }}>📅</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a" }}>Appointment Booking System</div>
          <div style={{ fontSize: 13, color: "#888" }}>Better Call Centers / El Paso Water Quality LLC</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 32px", display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, maxWidth: 1100, margin: "0 auto" }}>

        {/* Form */}
        <div style={card}>
          <h2 style={h2}>📋 Book an appointment</h2>
          {["customer_name", "phone_number"].map((field) => (
            <div key={field} style={{ marginBottom: 14 }}>
              <label style={labelStyle}>{field === "customer_name" ? "Customer name" : "Phone number"}</label>
              <input
                style={inputStyle}
                placeholder={field === "customer_name" ? "e.g. John Smith" : "+91XXXXXXXXXX"}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Appointment date & time</label>
            <input type="datetime-local" style={inputStyle} value={form.appointment_time}
              onChange={e => setForm({ ...form, appointment_time: e.target.value })} />
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Booking..." : "✅ Confirm Appointment"}
          </button>
          {message === "success" && (
            <div style={{ marginTop: 14, background: "#EAF3DE", color: "#3B6D11", padding: "10px 14px", borderRadius: 8, fontSize: 13, border: "1px solid #C0DD97" }}>
              ✓ Appointment booked — WhatsApp confirmation sent!
            </div>
          )}
          {message === "error" && (
            <div style={{ marginTop: 14, background: "#FCEBEB", color: "#A32D2D", padding: "10px 14px", borderRadius: 8, fontSize: 13, border: "1px solid #F7C1C1" }}>
              ✗ Please fill all fields correctly.
            </div>
          )}
        </div>

        {/* Dashboard */}
        <div style={card}>
          <h2 style={h2}>📊 All Appointments <span style={{ fontSize: 13, fontWeight: 400, color: "#888", marginLeft: 6 }}>{appointments.length} total</span></h2>
          {appointments.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 14 }}>No appointments yet.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #eee" }}>
                    {["Customer", "Phone", "Appointment Time", "Confirmed", "Reminder"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "#888", fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={td}>{a.customer_name}</td>
                      <td style={td}>{a.phone_number}</td>
                      <td style={td}>{new Date(a.appointment_time).toLocaleString()}</td>
                      <td style={td}><Badge sent={a.message_sent} /></td>
                      <td style={td}><Badge sent={a.reminder_sent} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Badge = ({ sent }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "3px 10px", borderRadius: 99, background: sent ? "#EAF3DE" : "#FAEEDA", color: sent ? "#3B6D11" : "#854F0B" }}>
    {sent ? "✓ Sent" : "⏳ Pending"}
  </span>
);

const card = { background: "#fff", border: "1px solid #e8e8e4", borderRadius: 12, padding: 24 };
const h2 = { fontSize: 16, fontWeight: 600, color: "#1a1a1a", marginBottom: 20 };
const labelStyle = { display: "block", fontSize: 13, color: "#666", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 14, color: "#1a1a1a", background: "#fff", boxSizing: "border-box" };
const btnStyle = { width: "100%", padding: 11, background: "#2D6A4F", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" };
const td = { padding: "10px 12px", color: "#333" };