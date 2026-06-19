import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Lock, Eye, EyeOff, Save, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
    }));
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      addToast('Passwords do not match!', 'error');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    };

    if (formData.newPassword) {
      payload.newPassword = formData.newPassword;
    }

    const result = await updateProfile(payload);

    setLoading(false);

    if (result.success) {
      addToast('Profile updated successfully! 🎉', 'success');
      setFormData((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } else {
      addToast(result.error || 'Failed to update profile.', 'error');
    }
  };

  if (!user) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '60px',
        background: 'radial-gradient(ellipse at top left, rgba(255, 107, 53, 0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(78, 205, 196, 0.06) 0%, transparent 50%)',
      }}
    >
      <div className="container animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Page Header */}
        <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 0 30px rgba(255, 107, 53, 0.35)',
            }}
          >
            <User size={36} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              background: 'var(--primary-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '6px',
            }}
          >
            My Profile
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-panel reveal delay-1" style={{ padding: '40px', borderRadius: '24px' }}>

          {/* Email (Read-only badge) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '32px',
            }}
          >
            <Mail size={18} color="var(--text-muted)" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Email Address</p>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{user.email}</p>
            </div>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(78, 205, 196, 0.15)',
                color: 'var(--success)',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '20px',
                border: '1px solid rgba(78, 205, 196, 0.3)',
              }}
            >
              <Shield size={11} />
              VERIFIED
            </span>
          </div>

          <form onSubmit={handleSubmit} id="profile-form">
            {/* Name & Phone Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="glass-input"
                    style={{ paddingLeft: '40px', width: '100%' }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                    className="glass-input"
                    style={{ paddingLeft: '40px', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Delivery Address
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--text-muted)' }} />
                <textarea
                  id="profile-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your default delivery address..."
                  rows={3}
                  className="glass-input"
                  style={{ paddingLeft: '40px', width: '100%', resize: 'vertical', minHeight: '80px', lineHeight: '1.5' }}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                <Lock size={13} />
                CHANGE PASSWORD
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
            </div>

            {/* Password Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' }}>
              {/* New Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  New Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="profile-new-password"
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Leave blank to keep"
                    className="glass-input"
                    style={{ paddingLeft: '40px', paddingRight: '44px', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    id="profile-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    className="glass-input"
                    style={{ paddingLeft: '40px', paddingRight: '44px', width: '100%' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="profile-save-btn"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: '14px',
                gap: '10px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
