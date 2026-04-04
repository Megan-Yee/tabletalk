import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tt_token'));
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('tt_user');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        checkProfile(token);
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const checkProfile = async (jwt) => {
    try {
      const res = await fetch(`${API}/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfileComplete(data.profile?.isComplete || false);
      } else {
        setProfileComplete(false);
      }
    } catch {
      setProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, jwt) => {
    localStorage.setItem('tt_token', jwt);
    localStorage.setItem('tt_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    checkProfile(jwt);
  };

  const logout = () => {
    localStorage.removeItem('tt_token');
    localStorage.removeItem('tt_user');
    setToken(null);
    setUser(null);
    setProfileComplete(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token, profileComplete, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
