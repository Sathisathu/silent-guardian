import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts", err);
    }
  };

  const addContact = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/contacts",
        { name, phone, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetForm();
      fetchContacts();
    } catch (err) {
      console.error("Error adding contact", err);
    }
  };

  const updateContact = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/contacts/${editId}`,
        { name, phone, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      resetForm();
      fetchContacts();
    } catch (err) {
      console.error("Error updating contact", err);
    }
  };

  const deleteContact = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchContacts();
    } catch (err) {
      console.error("Error deleting contact", err);
    }
  };

  const editContact = (contact) => {
    setEditId(contact._id);
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email);
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setEditId(null);
  };

  const triggerAlert = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        await axios.post(
          "http://localhost:5000/api/alerts/trigger",
          {
            message: alertMessage,
            location: { lat: latitude, lng: longitude },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("🚨 Emergency Alert Sent!");
        setAlertMessage("");
      } catch (error) {
        console.error("Error sending alert:", error);
        alert("Error sending alert");
      }
    });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="dashboard-container">
      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>

      <h1>Emergency Dashboard</h1>

      {/* Emergency Alert */}
      <div className="section">
        <h2>🚨 Send Panic Alert</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Optional message (e.g. Help!)"
          value={alertMessage}
          onChange={(e) => setAlertMessage(e.target.value)}
        />
        <button className="alert-button" onClick={triggerAlert}>
          🚨 Trigger Panic Alert
        </button>
      </div>

      {/* Emergency Contacts */}
      <div className="section">
        <h2>📇 My Emergency Contacts</h2>
        <div className="contact-form">
          <input
            className="input-small"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-small"
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="input-small"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {editId ? (
            <>
              <button className="edit-button" onClick={updateContact}>
                Save
              </button>
              <button className="cancel-button" onClick={resetForm}>
                Cancel
              </button>
            </>
          ) : (
            <button className="add-button" onClick={addContact}>
              Add Contact
            </button>
          )}
        </div>

        <ul className="contact-list">
          {contacts.map((contact) => (
            <li key={contact._id}>
              {contact.name} - {contact.phone}
              {contact.email ? ` (${contact.email})` : ""}
              <button className="edit-button" onClick={() => editContact(contact)}>
                ✏️ Edit
              </button>
              <button className="delete-button" onClick={() => deleteContact(contact._id)}>
                ❌ Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
