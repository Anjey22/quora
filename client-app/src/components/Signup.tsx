import { signInWithPopup } from "@firebase/auth";
import { auth, facebookProvider, googleProvider } from "../firebase/setup";
import { useState } from "react";
import Emailsignin from "./Emailsignin";
import google from "../assets/google.png"
import facebook from "../assets/facebook.png"


const Signup = () => {
  const [emailSignin, setEmailSignin] = useState(false);

  const googleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const facebookSignup = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      console.error(error);
    }
  };

  return (

    
    <div className="landing">
      <div className="container">
        <div className="header">
        <div className="text-center text-2xl text-blue-500">
      Hello, Vite + React + TailwindCSS!
    </div>
          <h1 className="title">Quora</h1>
          <p className="description">A place to share knowledge and better understand the world</p>
        </div>
        <div className="content">
          <div className="signup-container">
            <form className="form">
              <p className="terms">
                By continuing you indicate that you agree to Quora’s
                <a href="#" className="link"> Terms of Service</a> and
                <a href="#" className="link"> Privacy Policy</a>.
              </p>
              <button type="button" onClick={googleSignup} className="social-button google-button">
                <img src={google} alt="Google" className="icon" /> Continue with Google
              </button>
              <button type="button" onClick={facebookSignup} className="social-button facebook-button">
                <img src={facebook} alt="Facebook" className="icon" /> Continue with Facebook
              </button>
              <button type="button" onClick={() => setEmailSignin(true)} className="email-signup">Sign up with email</button>
            </form>
          </div>
          <div className="login-container">
            <form className="form">
              <h1>Login</h1>
              <hr />
              <div className="input-group">
                <label htmlFor="login-email" className="label">Email</label>
                <input type="email" id="login-email" className="input" placeholder="Your Email" />
              </div>
              <div className="input-group">
                <label htmlFor="login-password" className="label">Password</label>
                <input type="password" id="login-password" className="input" placeholder="Your Password" />
              </div>
              <div className="login-actions">
                <a href="#" className="forgot-password">Forgot Password?</a>
                <button className="login-button">Login</button>
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
