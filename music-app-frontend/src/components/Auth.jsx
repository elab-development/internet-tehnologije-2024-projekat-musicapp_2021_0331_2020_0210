import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiLock } from 'react-icons/fi';
import Lottie from 'lottie-react';
import girlAnimation from '../assets/girl.json';
import { useNavigate } from 'react-router-dom';


function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    address: '',
    phone: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const switchTab = (t) => {
    setActiveTab(t);
    setError('');
    setMessage('');
  };

  const handleChange = (e, setter, form) => {
    setter({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // clear any old feedback
      setError('');
      setMessage('');
  
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/login',
        loginForm
      );
  
      // store token + user
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem(
        'auth_user',
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
<<<<<<< HEAD
          imageUrl: data.imageUrl
=======
>>>>>>> de3c71b98a5132915f584f8ee55a9068a14ee808
        })
      );
  
      // set success message
      setMessage(data.message);
  
      // redirect away (unmounts this component immediately)
      navigate('/home');
    } catch (err) {
      // clear any success message
      setMessage('');
  
      // show error
      setError(err.response?.data?.error || 'Login failed');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/register',
        registerForm
      );
      setMessage(data.message);
      setTimeout(() => setActiveTab('login'), 2000);
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      const resp = err.response?.data;
      setError(
        resp?.errors
          ? Object.values(resp.errors).flat().join(' ')
          : resp?.message || 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
    <div className="auth-container">
      {/* Left Lottie panel */}
      <div className="lottie-pane">
        <Lottie
          animationData={girlAnimation}
          loop
          autoPlay
          style={{ width: 300, height: 300 }}
        />
      </div>
      <div className="auth-card">
        <div className="logo-circle">
          <img
            src="/images/musify-icon.png"
            alt="icon"
            className="icon"
          />
        </div>
        <img
          src="/images/musify-text.png"
          alt="Musify"
          className="logo-text"
        />

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {message && <div className="form-message">{message}</div>}

        {activeTab === 'login' && (
          <form className="form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  name="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    handleChange(e, setLoginForm, loginForm)
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Password
                <button type="button" className="forgot-btn">
                  Forgot password?
                </button>
              </label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    handleChange(e, setLoginForm, loginForm)
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging…' : 'Login'}
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form className="form" onSubmit={handleRegister}>
            {['name', 'email', 'password', 'password_confirmation'].map(
              (field) => (
                <div className="form-group" key={field}>
                  <label>
                    {field === 'password_confirmation'
                      ? 'Confirm Password'
                      : field.charAt(0).toUpperCase() +
                        field.slice(1)}
                  </label>
                  <div className="input-wrapper">
                    {field === 'email' && field !== 'name' ? (
                      <FiMail className="input-icon" />
                    ) : ( 
                      field === 'password' ? (
                      <FiLock className="input-icon" />
                    ) : (<></>))}
                    <input
                      name={field}
                      type={
                        field.includes('password')
                          ? 'password'
                          : 'text'
                      }
                      value={registerForm[field]}
                      onChange={(e) =>
                        handleChange(
                          e,
                          setRegisterForm,
                          registerForm
                        )
                      }
                      required
                    />
                  </div>
                </div>
              )
            )}

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={registerForm.role}
                onChange={(e) =>
                  handleChange(e, setRegisterForm, registerForm)
                }
                required
              >
                <option value="">Select role</option>
                <option value="event_manager">
                  Event manager
                </option>
                <option value="buyer">Buyer</option>
                <option value="administrator">
                  Administrator
                </option>
              </select>
            </div>

            {['address', 'phone', 'image_url'].map((field) => (
              <div className="form-group" key={field}>
                <label>
                  {field === 'image_url'
                    ? 'Image URL'
                    : field.charAt(0).toUpperCase() +
                      field.slice(1)}
                </label>
                <input
                  name={field}
                  type={field === 'image_url' ? 'url' : 'text'}
                  value={registerForm[field]}
                  onChange={(e) =>
                    handleChange(e, setRegisterForm, registerForm)
                  }
                />
              </div>
            ))}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Registering…' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
}

export default Auth;
