import { useState } from 'react';
import { api } from '../api.js';

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  function switchMode() {
    setMode(isSignup ? 'login' : 'signup');
    setError('');
    setMessage('');
  }

  function validateForm() {
    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password;

    if (isSignup) {
      if (!name) {
        return 'Name is required.';
      }

      if (name.length < 2 || name.length > 50) {
        return 'Name must be between 2 and 50 characters.';
      }

      if (!/^[a-zA-Z\s'-]+$/.test(name)) {
        return 'Name can only contain letters, spaces, hyphens and apostrophes.';
      }
    }

    if (!email) {
      return 'Email is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!password) {
      return 'Password is required.';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);

    try {
      if (isSignup) {
        await api.signup({
          ...form,
          name: form.name.trim(),
          email: form.email.trim()
        });

        setMode('login');
        setForm({
          name: '',
          email: form.email.trim(),
          password: ''
        });

        setMessage('Account created! Please log in.');
      } else {
        const data = await api.login({
          email: form.email.trim(),
          password: form.password
        });

        onLogin(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <h1 className="brand">Sweety</h1>
      <p className="tagline">
        Track your blood glucose, one reading at a time.
      </p>

      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>

        {message && (
          <p className="notice" role="status">
            {message}
          </p>
        )}

        {isSignup && (
          <label>
            Name
            <input
              value={form.name}
              onChange={update('name')}
              autoComplete="name"
              placeholder="Enter your name"
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={update('email')}
            autoComplete="email"
            placeholder="Enter your email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            placeholder="Enter your password"
          />
        </label>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy}>
          {busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>

        <p className="switch">
          {isSignup
            ? 'Already have an account?'
            : 'New to Sweety?'}{' '}
          <button
            type="button"
            className="link"
            onClick={switchMode}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </form>
    </main>
  );
}
