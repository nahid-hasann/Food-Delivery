import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, User, LogOut, Flame, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { toggleCart, cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="glass-navbar" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, height: '80px', display: 'flex', alignItems: 'center' }}>
      <div className="container flex-row-center" style={{ width: '100%' }}>
        
        {/* Logo */}
        <Link to="/" className="flex-center" style={{ gap: '8px' }} onClick={() => setIsMobileMenuOpen(false)}>
          <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255, 107, 53, 0.2)' }}>
            <Flame size={24} color="var(--primary)" fill="var(--primary)" />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Quick<span className="text-gradient">Bite</span>
          </span>
        </Link>

        {/* Desktop Menu Links */}
        <div style={{ display: 'none', gap: '32px', alignItems: 'center' }} className="desktop-menu">
          <Link to="/" style={{ fontWeight: 500, position: 'relative', color: isActive('/') ? 'var(--primary)' : 'var(--text-secondary)' }} className="nav-link">
            Home
            {isActive('/') && <span className="nav-link-indicator" />}
          </Link>
          <Link to="/menu" style={{ fontWeight: 500, position: 'relative', color: isActive('/menu') ? 'var(--primary)' : 'var(--text-secondary)' }} className="nav-link">
            Menu
            {isActive('/menu') && <span className="nav-link-indicator" />}
          </Link>
          {user && (
            <Link to="/my-orders" style={{ fontWeight: 500, position: 'relative', color: isActive('/my-orders') ? 'var(--primary)' : 'var(--text-secondary)' }} className="nav-link">
              My Orders
              {isActive('/my-orders') && <span className="nav-link-indicator" />}
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', color: isActive('/admin') ? 'var(--primary)' : 'var(--text-secondary)' }} className="nav-link">
              <LayoutDashboard size={16} />
              Admin Panel
              {isActive('/admin') && <span className="nav-link-indicator" />}
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* Cart Trigger */}
          <button 
            className="btn btn-glass btn-circle" 
            onClick={toggleCart} 
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Open Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span 
                className="badge badge-primary" 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  minWidth: '20px', 
                  height: '20px', 
                  borderRadius: '10px', 
                  padding: '0 4px', 
                  fontSize: '0.7rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: 'var(--primary-gradient)',
                  color: '#fff',
                  border: 'none',
                  animation: 'pulseGlow 2s infinite'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Buttons (Desktop) */}
          <div style={{ display: 'none', position: 'relative' }} className="desktop-menu">
            {user ? (
              <div>
                <button 
                  className="btn btn-secondary" 
                  style={{ gap: '8px', padding: '10px 18px', borderRadius: '12px' }}
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <User size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
                </button>
                {isProfileDropdownOpen && (
                  <div className="glass-panel" style={{ position: 'absolute', right: 0, marginTop: '8px', width: '200px', padding: '8px', zIndex: 1001, boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-glass)', marginBottom: '8px' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="dropdown-item" 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Admin Panel
                      </Link>
                    )}
                    <Link 
                      to="/my-orders" 
                      className="dropdown-item" 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' }}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <ShoppingBag size={16} />
                      My Orders
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item" 
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', textAlign: 'left', padding: '10px', border: 'none', background: 'none', color: 'var(--warning)', cursor: 'pointer', borderRadius: '8px', fontSize: '0.9rem' }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}>
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger (Mobile) */}
          <button 
            className="btn btn-glass btn-circle mobile-menu-btn" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Overlay & Content */}
      {isMobileMenuOpen && (
        <>
          <div 
            style={{ position: 'fixed', top: '80px', left: 0, width: '100vw', height: 'calc(100vh - 80px)', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', zIndex: 998 }} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            className="glass-panel" 
            style={{ 
              position: 'fixed', 
              top: '80px', 
              right: 0, 
              width: '280px', 
              height: 'calc(100vh - 80px)', 
              borderRadius: '0 0 0 16px', 
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              zIndex: 999, 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link to="/" style={{ fontSize: '1.1rem', fontWeight: 600, color: isActive('/') ? 'var(--primary)' : 'var(--text-primary)' }} onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/menu" style={{ fontSize: '1.1rem', fontWeight: 600, color: isActive('/menu') ? 'var(--primary)' : 'var(--text-primary)' }} onClick={() => setIsMobileMenuOpen(false)}>
                Menu
              </Link>
              {user && (
                <Link to="/my-orders" style={{ fontSize: '1.1rem', fontWeight: 600, color: isActive('/my-orders') ? 'var(--primary)' : 'var(--text-primary)' }} onClick={() => setIsMobileMenuOpen(false)}>
                  My Orders
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: isActive('/admin') ? 'var(--primary)' : 'var(--text-primary)' }} onClick={() => setIsMobileMenuOpen(false)}>
                  <LayoutDashboard size={18} />
                  Admin Panel
                </Link>
              )}
            </div>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'var(--primary-light)', padding: '8px', borderRadius: '50%' }}>
                      <User size={18} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-secondary" 
                    style={{ width: '100%', gap: '8px', color: 'var(--warning)', borderColor: 'rgba(247, 37, 133, 0.3)' }}
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
