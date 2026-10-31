import { useEffect, useState } from 'react';
import { api, clearUser, loadUser, saveUser } from './api.js';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(loadUser);

  // Called by AuthPage after a successful LOGIN (the cookie is already set by the server).
  function handleLogin(data) {
    saveUser(data.user);
    setUser(data.user);
  }

  // Clear local state only. Used when the server already says we're logged out (401).
  function resetSession() {
    clearUser();
    setUser(null);
  }

  // Ask the server to delete the cookie, then clear local state.
  // Even if the request fails (e.g. offline) the user is sent to the login page.
  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      /* ignore: we still log out locally */
    }
    resetSession();
  }

  // The API helper fires this when any protected request returns 401 (cookie expired).
  useEffect(() => {
    window.addEventListener('sweety:unauthorized', resetSession);
    return () => window.removeEventListener('sweety:unauthorized', resetSession);
  }, []);

  if (!user) return <AuthPage onLogin={handleLogin} />;
  return <Dashboard user={user} onLogout={handleLogout} />;
}