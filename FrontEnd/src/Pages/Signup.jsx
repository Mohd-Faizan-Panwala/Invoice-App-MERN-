import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    await API.post("/auth/signup", { name, email, password });
    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Create Account</button>
        <p class="redirect" onClick={() => navigate("/")}>
          Already Have an Account Login
        </p>
      </div>
    </div>
  );
}

export default Signup;