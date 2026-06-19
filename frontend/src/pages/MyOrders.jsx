import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, Truck, Utensils, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const steps = [
    { label: 'Order Placed', status: 'Pending' },
    { label: 'Preparing', status: 'Cooking' },
    { label: 'On The Way', status: 'Out for Delivery' },
    { label: 'Delivered', status: 'Delivered' }
  ];

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Cooking': return 1;
      case 'Out for Delivery': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  useEffect(() => {
    // Check if redirected from PayHere sandbox with success parameters
    const params = new URLSearchParams(window.location.search);
    const paymentStatusParam = params.get('payment');
    const orderIdParam = params.get('orderId');

    const handlePaymentRedirect = async () => {
      if (paymentStatusParam === 'success' && orderIdParam) {
        try {
          await fetch(`http://localhost:5005/api/orders/simulate-success/${orderIdParam}`, {
            method: 'POST'
          });
          // Clean the query parameters from URL without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Failed to trigger mock payment notification:', error);
        }
      }
    };

    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('quickbite_token');
        if (!token) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5005/api/orders/my-orders', {
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

    const init = async () => {
      await handlePaymentRedirect();
      await fetchOrders();
    };

    init();
  }, [user]);

  const handleCancelOrder = (orderId) => {
    setCancelOrderId(orderId);
  };

  const executeCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('quickbite_token');
      const response = await fetch(`http://localhost:5005/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
          )
        );
        showToast('Order cancelled successfully.', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to cancel order.', 'error');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      showToast('Error cancelling order.', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock size={16} color="var(--primary)" />;
      case 'Cooking': return <Utensils size={16} color="var(--star-color)" />;
      case 'Out for Delivery': return <Truck size={16} color="#00b4d8" />;
      case 'Delivered': return <CheckCircle size={16} color="var(--success)" />;
      case 'Cancelled': return <AlertCircle size={16} color="var(--warning)" />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="badge" style={{ background: 'rgba(255, 107, 53, 0.15)', color: 'var(--primary)', border: '1px solid rgba(255, 107, 53, 0.3)' }}>Pending</span>;
      case 'Cooking': return <span className="badge" style={{ background: 'rgba(255, 183, 3, 0.15)', color: 'var(--star-color)', border: '1px solid rgba(255, 183, 3, 0.3)' }}>Cooking</span>;
      case 'Out for Delivery': return <span className="badge" style={{ background: 'rgba(0, 180, 216, 0.15)', color: '#00b4d8', border: '1px solid rgba(0, 180, 216, 0.3)' }}>Out for Delivery</span>;
      case 'Delivered': return <span className="badge badge-success">Delivered</span>;
      case 'Cancelled': return <span className="badge badge-danger">Cancelled</span>;
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

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  return (
    <>
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container" 
        style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '800px' }}
      >
      <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '16px' }}>
          <ShoppingBag size={24} color="var(--primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Order <span className="text-gradient">History</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track and view your current and past culinary selections</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div style={{ width: '40%' }}>
                  <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '150px', height: '18px' }} />
                </div>
                <div style={{ width: '25%' }}>
                  <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '100px', height: '18px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '10px' }} />
                <div style={{ flexGrow: 1 }}>
                  <div className="skeleton" style={{ width: '150px', height: '18px', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ width: '80px', height: '14px' }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel reveal" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order, index) => {
            const currentStepIndex = getStatusStepIndex(order.orderStatus);
            const progressPercent = currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

            return (
              <div key={order._id} className={`glass-card reveal delay-${(index % 3) + 1}`} style={{ padding: '24px' }}>
                
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
                    {order.paymentMethod && (
                      <span className="badge badge-glass" style={{ textTransform: 'uppercase', fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}>
                        {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Card'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
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

                {/* Visual Progress Bar or Cancelled Alert */}
                {order.orderStatus === 'Cancelled' ? (
                  <div style={{ 
                    background: 'rgba(247, 37, 133, 0.08)', 
                    border: '1px dashed rgba(247, 37, 133, 0.25)', 
                    padding: '12px', 
                    borderRadius: '12px', 
                    color: 'var(--warning)', 
                    fontSize: '0.85rem', 
                    textAlign: 'center', 
                    fontWeight: 600, 
                    margin: '24px 0 32px 0' 
                  }}>
                    ❌ Order Cancelled: This order has been cancelled and will not be processed further.
                  </div>
                ) : (
                  <div style={{ 
                    position: 'relative', 
                    height: '4px', 
                    background: 'rgba(255, 255, 255, 0.08)', 
                    borderRadius: '2px', 
                    margin: '32px 48px 48px 48px' 
                  }}>
                    {/* Active progress filler */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${progressPercent}%`,
                      background: 'var(--primary-gradient)',
                      borderRadius: '2px',
                      boxShadow: 'var(--shadow-glow)',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />

                    {/* Step nodes */}
                    {steps.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex;
                      const isActive = idx === currentStepIndex;
                      
                      const leftPosition = `${(idx / (steps.length - 1)) * 100}%`;

                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            position: 'absolute', 
                            left: leftPosition, 
                            top: '50%', 
                            transform: 'translate(-50%, -50%)', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center' 
                          }}
                        >
                          {/* Node circle */}
                          <div style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: isCompleted || isActive ? 'var(--primary-gradient)' : 'var(--bg-card)',
                            border: isCompleted || isActive ? 'none' : '2px solid var(--border-glass)',
                            boxShadow: isActive ? '0 0 10px var(--primary-glow)' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease-in-out',
                            zIndex: 2
                          }}>
                            {(isCompleted || isActive) && (
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                            )}
                          </div>
                          {/* Node text label */}
                          <span style={{
                            position: 'absolute',
                            top: '24px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            whiteSpace: 'nowrap',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: isActive ? 'var(--primary)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                            transition: 'color 0.3s'
                          }}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Order Footer */}
                <div className="flex-row-center" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', marginTop: '16px' }}>
                  {order.orderStatus === 'Pending' ? (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      className="btn btn-glass"
                      style={{ 
                        padding: '8px 16px', 
                        fontSize: '0.85rem', 
                        color: 'var(--warning)', 
                        borderColor: 'rgba(247, 37, 133, 0.3)',
                        borderRadius: '8px'
                      }}
                    >
                      Cancel Order
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {order.orderStatus === 'Cancelled' ? 'Order Cancelled' : 'In Progress (Non-cancellable)'}
                    </span>
                  )}
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '8px' }}>Total Amount</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </motion.div>

    {/* Cancel Confirmation Modal */}
    {cancelOrderId && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(11, 12, 16, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }} className="animate-fade-in">
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '400px',
          padding: '30px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255, 107, 53, 0.2)'
        }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>
            Cancel Order?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button 
              onClick={() => setCancelOrderId(null)} 
              className="btn btn-glass"
              style={{ padding: '10px 24px', flexGrow: 1 }}
            >
              No, Keep
            </button>
            <button 
              onClick={() => {
                const id = cancelOrderId;
                setCancelOrderId(null);
                executeCancelOrder(id);
              }} 
              className="btn btn-primary"
              style={{ padding: '10px 24px', flexGrow: 1, background: 'var(--warning)', borderColor: 'var(--warning)' }}
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default MyOrders;
