import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [db, setDb] = useState(null);

  // Clear session and init DB
  useEffect(() => {
    localStorage.removeItem("currentUser");
    const request = indexedDB.open("UserDatabase", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      setError("Database error occurred.");
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("users")) {
        const usersStore = db.createObjectStore("users", { keyPath: "email" });
        usersStore.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      setDb(event.target.result);
    };
  }, []);

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }

    if (!db) {
      setError("Database not available.");
      return;
    }

    const transaction = db.transaction(["users"], "readonly");
    const usersStore = transaction.objectStore("users");
    const getRequest = usersStore.get(email);

    getRequest.onsuccess = (event) => {
      if (event.target.result) {
        setError("An account with this email already exists!");
      } else {
        const newUser = { name, email, password, createdAt: new Date() };

        const writeTransaction = db.transaction(["users"], "readwrite");
        const store = writeTransaction.objectStore("users");
        const addRequest = store.add(newUser);

        addRequest.onsuccess = () => {
          setError("");
          alert("Signup successful! Please login.");
          navigate("/login"); // Redirect to login
        };

        addRequest.onerror = (event) => {
          console.error("Error adding user:", event.target.error);
          setError("Failed to create account.");
        };
      }
    };

    getRequest.onerror = (event) => {
      console.error("Error checking user:", event.target.error);
      setError("Failed to check existing account.");
    };
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      {error && <p className="error">{error}</p>}
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <p className="login-link">Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}

export default Signup;
