import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

function App() {
  const [health, setHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchHealth();
    fetchUsers();
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/health`);
      setHealth(response.data);
    } catch (error) {
      console.error("Error fetching health:", error);
      console.error("API URL:", API_URL);
      console.error("Error details:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("API URL:", API_URL);
      console.error("Error details:", error.message);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/users`, newUser);
      setNewUser({ name: "", email: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🐳 Docker Test Application</h1>
          <p>Node.js + React.js Full Stack App</p>
        </header>

        <div className="health-card">
          <h2>Backend Status</h2>
          {health ? (
            <div className="health-info">
              <p>
                <strong>Status:</strong> {health.status}
              </p>
              <p>
                <strong>Uptime:</strong> {Math.floor(health.uptime)}s
              </p>
              <p>
                <strong>Environment:</strong> {health.environment}
              </p>
            </div>
          ) : (
            <div className="health-info">
              <p style={{ color: "#ff6b6b" }}>Connecting to backend...</p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                API URL: {API_URL}
              </p>
            </div>
          )}
        </div>

        <div className="content">
          <div className="section">
            <h2>Users List</h2>
            {users.length > 0 ? (
              <div className="users-grid">
                {users.map((user) => (
                  <div key={user.id} className="user-card">
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{ color: "#666", textAlign: "center", padding: "20px" }}
              >
                No users loaded. Check console for errors.
              </p>
            )}
          </div>

          <div className="section">
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit} className="user-form">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
