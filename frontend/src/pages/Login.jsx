import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      // In mock mode, we will check user role in AuthContext.
      // If admin, navigate to admin dashboard, else home.
      // We will parse the local storage just to check role.
      const stored = localStorage.getItem('quickbite_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === 'admin') {
          navigate('/admin');
          return;
        }
      }
      navigate('/');
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  // Quick action to login as test admin or customer for testing convenience
  const handleQuickLogin = async (role) => {
    setError('');
    setLoading(true);
    
    // Credentials provided by the user
    const emailInput = role === 'admin' ? 'bikelovernahid@gmail.com' : 'mhnahid1w3r@gmail.com';
    const passwordInput = 'Aa123456';
    const nameInput = role === 'admin' ? 'Bike Lover Nahid (Admin)' : 'MH Nahid (Customer)';
    const phoneInput = '+8801700000000';
    
    setEmail(emailInput);
    setPassword(passwordInput);

    // Try logging in with the credentials
    const result = await login(emailInput, passwordInput);
    
    if (result.success) {
      setLoading(false);
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      // If login fails (user does not exist in DB), register the user first!
      console.log('User does not exist in Atlas database. Registering silently...');
      const registerResult = await register(nameInput, emailInput, passwordInput, phoneInput, role);
      setLoading(false);
      
      if (registerResult.success) {
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(registerResult.error || 'Failed to authenticate demo credentials');
      }
    }
  };

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="glass-panel reveal" style={{ width: '100%', maxWidth: '450px', padding: '40px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome <span className="text-gradient">Back</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to satisfy your cravings</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '20px', textTransform: 'none', justifyContent: 'flex-start' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '8px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : (
              <>
                Sign In
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>

        {/* Quick Testing Actions */}
        <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '12px' }}>
            ⚡ Developer Demo Logins (Bypasses Backend DB for UI preview)
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => handleQuickLogin('customer')} className="btn btn-glass" style={{ flexGrow: 1, padding: '8px', fontSize: '0.75rem', gap: '4px' }}>
              Customer Demo <ArrowRight size={12} />
            </button>
            <button onClick={() => handleQuickLogin('admin')} className="btn btn-glass" style={{ flexGrow: 1, padding: '8px', fontSize: '0.75rem', gap: '4px' }}>
              Admin Demo <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
