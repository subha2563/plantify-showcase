import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send Google token to your backend
      const res = await axios.post('http://localhost:5000/api/google-login', {
        token: credentialResponse.credential
      });
      
      // Save user details to LocalStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userId', res.data.id);
      
      alert(`Welcome, ${res.data.username}!`);
      navigate('/'); // Go home
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 text-center">
          <div className="card shadow border-0 p-5">
            <h2 className="text-success mb-4 fw-bold">Plantify</h2>
            <p className="text-muted mb-4">Sign in with your Google account to manage your garden.</p>
            
            <div className="d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                useOneTap // Optional: shows a prompt if the user is already signed into Google
              />
            </div>

            <p className="mt-4 small text-secondary">
              By signing in, you agree to our terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;