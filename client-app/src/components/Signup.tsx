import { useEffect, useState, FormEvent } from "react";
import { signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, facebookProvider, googleProvider } from "../firebase/setup";
import Emailsignin from "./Emailsignin";
import google from "../assets/google.png";
import facebook from "../assets/facebook.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [emailSignin, setEmailSignin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        toast.success("Login successful!");
        navigate("/mainpage");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const googleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Login successful!");
      navigate("/mainpage");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    }
  };

  const facebookSignup = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      if (result.user) {
        toast.success("Login successful!");
        navigate("/mainpage");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      toast.success("Login successful!");
      navigate("/mainpage");
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === 'auth/user-not-found') {
        toast.error("No account found with this email. Please sign up first.");
      } else if (errorCode === 'auth/wrong-password') {
        toast.error("Invalid credentials. Please try again.");
      }
      console.error(error);
    }
  };

  return (
    <div className="landing">
      <ToastContainer />
      <div className="container">
        <div className="header">
          <h1 className="title">Quora</h1>
          <p className="description">
            A place to share knowledge and better understand the world
          </p>
        </div>
        <div className="content">
          <div className="signup-container">
            <form className="form">
              <p className="terms">
                By continuing you indicate that you agree to Quora’s
                <a href="#" className="link"> Terms of Service</a> and
                <a href="#" className="link"> Privacy Policy</a>.
              </p>
              <button
                type="button"
                onClick={googleSignup}
                className="social-button google-button"
              >
                <img src={google} alt="Google" className="icon" /> Continue with Google
              </button>
              <button
                type="button"
                onClick={facebookSignup}
                className="social-button facebook-button"
              >
                <img src={facebook} alt="Facebook" className="icon" /> Continue with Facebook
              </button>
              <button
                type="button"
                onClick={() => setEmailSignin(true)}
                className="email-signup"
              >
                Sign up with email
              </button>
            </form>
          </div>
          <div className="login-container">
            <form className="form" onSubmit={handleLogin}>
              <h1>Login</h1>
              <hr />
              <div className="input-group">
                <label htmlFor="login-email" className="label">Email</label>
                <input
                  type="email"
                  id="login-email"
                  className="input"
                  placeholder="Your Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="login-password" className="label">Password</label>
                <input
                  type="password"
                  id="login-password"
                  className="input"
                  placeholder="Your Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div className="login-actions">
                <a href="#" className="forgot-password">Forgot Password?</a>
                <button className="login-button" type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
        <br />
        <hr />
        <div className="footer">
          <p className="footer-content">
            <a href="#" className="link">About</a>
            <a href="#" className="link">Careers</a>
            <a href="#" className="link">Privacy</a>
            <a href="#" className="link">Terms</a>
            <a href="#" className="link">Contact</a>
            <a href="#" className="link">Languages</a>
            <a href="#" className="link">Your Ad Choices</a>
            <a href="#" className="link">Press</a>
            <span className="link">© Quora, Inc. 2024</span>
          </p>
        </div>
      </div>
      {emailSignin && <Emailsignin onClose={() => setEmailSignin(false)} />}
    </div>
  );
};

export default Signup;
