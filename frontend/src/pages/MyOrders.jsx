import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, Truck, Utensils, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock orders for testing order status and payment status UI
const MOCK_ORDERS = [
  {
    _id: 'ORD-82910',
    createdAt: '2026-06-18T14:32:00Z',
    items: [
      { name: 'Premium Pepperoni Pizza', quantity: 2, price: 12.99 },
      { name: 'Salted Caramel Iced Latte', quantity: 1, price: 4.49 }
    ],
    totalAmount: 30.47,
    paymentStatus: 'Paid',
    orderStatus: 'Cooking'
  },
  {
    _id: 'ORD-76123',
    createdAt: '2026-06-17T19:15:00Z',
    items: [
      { name: 'Truffle Mushroom Burger', quantity: 1, price: 9.49 },
      { name: 'Velvet Chocolate Fudge Cake', quantity: 2, price: 6.99 }
    ],
    totalAmount: 23.47,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered'
  }
];

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('quickbite_token');
        if (!token) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          // If server fails (or not set up yet), use mock orders for preview
          setOrders(MOCK_ORDERS);
        }
      } catch (err) {
        setOrders(MOCK_ORDERS);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} color="var(--primary)" />;
      case 'Cooking': return <Utensils size={16} color="var(--star-color)" />;
      case 'Out for Delivery': return <Truck size={16} color="#00b4d8" />;
      case 'Delivered': return <CheckCircle size={16} color="var(--success)" />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="badge" style={{ background: 'rgba(255, 107, 53, 0.15)', color: 'var(--primary)', border: '1px solid rgba(255, 107, 53, 0.3)' }}>Pending</span>;
      case 'Cooking': return <span className="badge" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--star-color)', border: '1px solid rgba(255, 183, 3, 0.3)' }}>Cooking</span>;
      case 'Out for Delivery': return <span className="badge" style={{ background: 'rgba(0, 180, 216, 0.15)', color: '#00b4d8', border: '1px solid rgba(0, 180, 216, 0.3)' }}>Out for Delivery</span>;
      case 'Delivered': return <span className="badge badge-success">Delivered</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (!user) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
        <AlertCircle size={48} color="var(--warning)" />
        <h3 style={{ fontSize: '1.5rem' }}>Please sign in to view your orders</h3>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '16px' }}>
          <ShoppingBag size={24} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Order <span className="text-gradient">History</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track and view your current and past culinary selections</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-card" style={{ padding: '24px' }}>
              
              {/* Order Header */}
              <div className="flex-row-center" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</p>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order._id}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Placed</p>
                  <p style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getStatusIcon(order.orderStatus)}
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {order.items.map((item, index) => (
                  <div key={index} className="flex-row-center" style={{ fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', gap: '8px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex-row-center" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '16px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Amount Paid</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
