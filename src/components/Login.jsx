import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

    request.onsuccess = (event) => {
      setDb(event.target.result);
    };
  }, []);

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please enter valid credentials");
      return;
    }

    if (!db) {
      setError("Database not available.");
      return;
    }

    const transaction = db.transaction(["users"], "readonly");
    const usersStore = transaction.objectStore("users");

    const getRequest = usersStore.get(username);

    getRequest.onsuccess = (event) => {
      const user = event.target.result;

      if (user && user.password === password) {
        loginSuccess(user);
      } else {
        const nameIndex = usersStore.index("name");
        const nameRequest = nameIndex.getAll();

        nameRequest.onsuccess = (event) => {
          const users = event.target.result;
          const foundUser = users.find(u => u.name === username && u.password === password);

          if (foundUser) {
            loginSuccess(foundUser);
          } else {
            setError("Invalid username or password");
          }
        };

        nameRequest.onerror = (event) => {
          console.error("Error finding by name:", event.target.error);
          setError("Login failed. Try again.");
        };
      }
    };

    getRequest.onerror = (event) => {
      console.error("Error finding user:", event.target.error);
      setError("Login failed. Try again.");
    };
  };

  const loginSuccess = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h2>Login to Gestura</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        placeholder="Username or Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
