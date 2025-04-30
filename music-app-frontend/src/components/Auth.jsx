import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiLock } from 'react-icons/fi';
import Lottie from 'lottie-react';
import girlAnimation from '../assets/girl.json';
import { useNavigate } from 'react-router-dom';

function Auth() {
  // hook za navigaciju na druge rute
  const navigate = useNavigate();

  // koja je trenutno aktivna tab: 'login' ili 'register'
  const [activeTab, setActiveTab] = useState('login');

  // podaci iz login forme
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // podaci iz registration forme
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

  // indikator učitavanja (disable dugmad tokom requesta)
  const [loading, setLoading] = useState(false);

  // poruka o grešci
  const [error, setError] = useState('');

  // poruka o uspehu
  const [message, setMessage] = useState('');

  // prebacivanje između tabova i reset poruka
  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setMessage('');
  };

  // generički handler za promenu input polja
  const handleChange = (e, setter, form) => {
    setter({ ...form, [e.target.name]: e.target.value });
  };

  // handler za login klik
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // reset poruka
      setError('');
      setMessage('');

      // poziv API-ja za login
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/login',
        loginForm
      );

      // čuvanje tokena i korisničkih podataka
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem(
        'auth_user',
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          imageUrl: data.imageUrl,
        })
      );

      // prikaz uspešne poruke
      setMessage(data.message);

      // redirekcija na /home
      navigate('/home');
    } catch (err) {
      // reset poruke o uspehu
      setMessage('');
      // prikaz greške
      setError(err.response?.data?.error || 'Login failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // handler za register klik
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // poziv API-ja za registraciju
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/register',
        registerForm
      );

      // prikaz uspešne poruke
      setMessage(data.message);

      // nakon 2s vraćamo se na login tab
      setTimeout(() => setActiveTab('login'), 2000);

      // reset login forme
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      const resp = err.response?.data;
      // spajanje validacionih grešaka ili prikaz poruke
      setError(
        resp?.errors
          ? Object.values(resp.errors).flat().join(' ')
          : resp?.message || 'Registration failed'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        {/* leva panela: Lottie animacija */}
        <div className="lottie-pane">
          <Lottie
            animationData={girlAnimation}
            loop
            autoPlay
            style={{ width: 300, height: 300 }}
          />
        </div>

        {/* desna kartica: login / register forme */}
        <div className="auth-card">
          {/* logo ikonica */}
          <div className="logo-circle">
            <img src="/images/musify-icon.png" alt="icon" className="icon" />
          </div>
          {/* logo tekst */}
          <img
            src="/images/musify-text.png"
            alt="Musify"
            className="logo-text"
          />

          {/* tabovi za izbor forme */}
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

          {/* ispis greške ili uspeha */}
          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-message">{message}</div>}

          {/* login forma */}
          {activeTab === 'login' && (
            <form className="form" onSubmit={handleLogin}>
              {/* email input */}
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

              {/* password input */}
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

              {/* submit dugme */}
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Logging…' : 'Login'}
              </button>
            </form>
          )}

          {/* registration forma */}
          {activeTab === 'register' && (
            <form className="form" onSubmit={handleRegister}>
              {/* ime, email, password, confirm password */}
              {['name', 'email', 'password', 'password_confirmation'].map(
                (field) => (
                  <div className="form-group" key={field}>
                    <label>
                      {field === 'password_confirmation'
                        ? 'Confirm Password'
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <div className="input-wrapper">
                      {/* ikone za email/lozinku */}
                      {field === 'email' ? (
                        <FiMail className="input-icon" />
                      ) : field.includes('password') ? (
                        <FiLock className="input-icon" />
                      ) : null}
                      <input
                        name={field}
                        type={field.includes('password') ? 'password' : 'text'}
                        value={registerForm[field]}
                        onChange={(e) =>
                          handleChange(e, setRegisterForm, registerForm)
                        }
                        required
                      />
                    </div>
                  </div>
                )
              )}

              {/* select za role */}
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
                  <option value="event_manager">Event manager</option>
                  <option value="buyer">Buyer</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>

              {/* ostali inputi: address, phone, image_url */}
              {['address', 'phone', 'image_url'].map((field) => (
                <div className="form-group" key={field}>
                  <label>
                    {field === 'image_url'
                      ? 'Image URL'
                      : field.charAt(0).toUpperCase() + field.slice(1)}
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

              {/* submit dugme */}
              <button type="submit" className="submit-btn" disabled={loading}>
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
