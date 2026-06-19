import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: 'rgba(11, 12, 16, 0.95)', 
      borderTop: '1px solid var(--border-glass)', 
      padding: '60px 0 30px 0', 
      color: 'var(--text-secondary)' 
    }}>
      <div className="container">
        {/* Footer Top Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '40px',
          marginBottom: '48px'
        }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', marginBottom: '20px' }}>
              <div style={{ background: 'var(--primary-light)', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
                <Flame size={20} color="var(--primary)" fill="var(--primary)" />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Quick<span className="text-gradient">Bite</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Satisfy your cravings in minutes. Premium gourmet meals prepared by top executive chefs and delivered fresh to your doorstep.
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://www.facebook.com/mh.na.hi.d.554448/" target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-circle" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Facebook">
                <Facebook size={16} />
              </a>
              <a href="https://x.com/NKNahid1001" target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-circle" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Twitter (X)">
                <Twitter size={16} />
              </a>
              <a href="https://www.instagram.com/bikelovernahid/" target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-circle" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://github.com/nahid-hasann" target="_blank" rel="noopener noreferrer" className="btn btn-glass btn-circle" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="GitHub">
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 600 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <li>
                <Link to="/" style={{ transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = ''}>Home</Link>
              </li>
              <li>
                <Link to="/menu" style={{ transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = ''}>Browse Menu</Link>
              </li>
              {user && (
                <li>
                  <Link to="/my-orders" style={{ transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = ''}>My Orders</Link>
                </li>
              )}
              {user?.role === 'admin' && (
                <li>
                  <Link to="/admin" style={{ transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = ''}>Admin Dashboard</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 600 }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--primary)" />
                <span>support@quickbite.com</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--primary)" />
                <span>+94 77 111 2233</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="var(--primary)" style={{ marginTop: '3px' }} />
                <span>123 Gourmet Street, Colombo 03, Sri Lanka</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', fontWeight: 600 }}>Opening Hours</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Monday - Friday:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>09:00 AM - 11:00 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Saturday - Sunday:</span>
                <span style={{ color: '#fff', fontWeight: 500 }}>10:00 AM - 12:00 AM</span>
              </li>
              <li style={{ marginTop: '10px', fontSize: '0.8rem', background: 'rgba(255, 107, 53, 0.08)', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,107,53,0.15)', color: 'var(--primary)', textAlign: 'center', fontWeight: 600 }}>
                ⚡ Delivery Always Available
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Divider & Copyright */}
        <div style={{ 
          borderTop: '1px solid var(--border-glass)', 
          paddingTop: '30px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem'
        }} className="flex-row-center-desktop">
          <p>© {currentYear} QuickBite Food Delivery. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = ''}>Privacy Policy</a>
            <a href="#" style={{ transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = ''}>Terms of Service</a>
            <a href="#" style={{ transition: 'var(--transition-fast)' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = ''}>Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
