// Import libraries
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// Import internal components
import { setLoadingTrue, userLoginSuccess, setLoadingFalse } from "../../data/Actions";
import { Store } from "../../data/Store";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [globalState, dispatch] = useContext(Store);

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch(setLoadingTrue());

    const axiosConfig = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  
  try {
    // Retrieve JWT token from BE server (as means of authentication)
    const response = await axios.post("/api/v1/login", { email, password }, axiosConfig);
    console.log(`response.data: ${JSON.stringify(response.data)}`);

    // Keep JWT token in localStorage (change to cookie later)
    localStorage.setItem("authToken", response.data.token);

    // Decode the remaining Base64 headers and keep required fields in context
    const base64Payload = JSON.stringify(response.data.token).split(".")[1];
    // const hdrObjects = window.atob(base64Payload);
    // const userId = JSON.parse(window.atob(base64Payload)).userId;
    const currentUser = JSON.parse(window.atob(base64Payload));
    console.log("this is currentUser: ", currentUser);
    dispatch(userLoginSuccess(currentUser));
    navigate("/");

  } catch (error) {
    setError(error.response.data.error);
    setTimeout(() => {
      setError("");
    }, 5000);
    dispatch(setLoadingFalse());
    };
  };
  
  return (
    <div className="login-page__main">
      <div className="login-page__container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="" />

        <div className="login-page__title">
          <h1>Sign in to Whats Upp</h1>
        </div>

        <form className="login-page__form" onSubmit={loginHandler}>

          {error && <span className="error-message">{error}</span>}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" required id="email" placeholder="Enter email here" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" required id="password" placeholder="Enter password here" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>

          <span className="login-view__subtext">
            Do not have an account?
            <Link to="/register">Register</Link>
          </span>

          <span className="login-view__subtext">
            Forgot password?
            <Link to="/forgotpassword">Reset password</Link>
          </span>

        </form>
      </div>
    </div>
  );
};

export default Login;
