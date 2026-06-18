import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await register(name, email, password, phone);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="container flex-center animate-fade-in" style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '40px', paddingBottom: '40px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '40px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Create <span className="text-gradient">Account</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Join QuickBite for express food delivery</p>
        </div>

        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '12px', borderRadius: '8px', marginBottom: '20px', textTransform: 'none', justifyContent: 'flex-start' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Name field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Full Name</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {/* Email field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {/* Phone field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Phone Number</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input 
                type="tel" 
                placeholder="+94 77 123 4567" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '48px' }}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
            style={{ width: '100%', marginTop: '10px', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : (
              <>
                Create Account
                <UserPlus size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
