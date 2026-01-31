import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', formData);
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5 card p-4 shadow-sm border-0">
          <h2 className="text-center text-success mb-4">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" className="form-control mb-3" placeholder="Username" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            <input type="email" className="form-control mb-3" placeholder="Email" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <input type="password" className="form-control mb-3" placeholder="Password" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            <button className="btn btn-success w-100">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;