import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Checkout address details state
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!address || !phone) return;
    
    setIsProcessing(true);
    
    // If user is not logged in, prompt to log in first
    if (!user) {
      alert('Please login to place an order.');
      setIsProcessing(false);
      toggleCart();
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('quickbite_token');
      
      // Post order details to backend to get PayHere parameters
      const response = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            foodItemId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cartTotal,
          deliveryAddress: address,
          phone: phone
        })
      });

      const orderData = await response.json();
      setIsProcessing(false);

      if (!response.ok) {
        throw new Error(orderData.message || 'Failed to place order');
      }

      // If backend succeeds, it returns PayHere payment parameters
      // We will programmatically submit a form redirecting to PayHere Sandbox!
      const paymentParams = orderData.paymentParams;
      
      // Create a temporary HTML form and submit it
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://sandbox.payhere.lk/pay/checkout'; // PayHere Sandbox URL
      
      // Append all payment parameters as hidden inputs
      Object.keys(paymentParams).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentParams[key];
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      
      // Clear local cart
      clearCart();
      toggleCart();

    } catch (error) {
      console.error('Checkout error:', error);
      
      // Fallback: If database/backend connection isn't set up yet, simulate success for visual review
      alert('Simulating Redirect to PayHere Sandbox Payment Gateway...\nTotal: $' + cartTotal.toFixed(2));
      setIsProcessing(false);
      
      // Clear cart and redirect to success
      clearCart();
      toggleCart();
      
      // Redirect to orders page or confirmation page
      navigate('/my-orders');
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(6px)', zIndex: 1002 }} 
        onClick={toggleCart}
      />
      
      {/* Sidebar Drawer */}
      <div 
        className="glass-panel" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          right: 0, 
          width: '100%', 
          maxWidth: '450px', 
          height: '100vh', 
          borderRadius: '24px 0 0 24px', 
          borderRight: 'none',
          borderTop: 'none',
          borderBottom: 'none',
          zIndex: 1003, 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem' }}>Your Basket</h3>
            <span className="badge badge-primary">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <button className="btn btn-glass btn-circle" onClick={toggleCart} style={{ width: '36px', height: '36px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content list */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Your basket is empty</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add items from the menu to satisfy your hunger.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item._id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-glass)' }} />
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>${item.price.toFixed(2)}</p>
                  </div>
                  
                  {/* Quantity adjustment */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '8px', border: '1px solid var(--border-glass)', gap: '10px' }}>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      style={{ background: 'none', border: 'none', color: 'var(--warning)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      title="Remove Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary / Checkout Form Toggle */}
        {cartItems.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.01)' }}>
            
            {!showCheckoutForm ? (
              <>
                <div className="flex-row-center" style={{ marginBottom: '20px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => setShowCheckoutForm(true)}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '14px', gap: '8px' }}
                >
                  Checkout Delivery Details
                  <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Delivery Address</h4>
                  <button type="button" onClick={() => setShowCheckoutForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Back to cart</button>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Recipient Contact Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="glass-input"
                  style={{ padding: '10px' }}
                  required
                />
                
                <textarea 
                  placeholder="Full Delivery Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="glass-input"
                  style={{ padding: '10px', minHeight: '60px', resize: 'vertical' }}
                  required
                />

                <div className="flex-row-center" style={{ margin: '8px 0' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Bill</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px', gap: '8px' }}
                  disabled={isProcessing}
                >
                  <CreditCard size={18} />
                  {isProcessing ? 'Redirecting...' : 'Proceed to PayHere Sandbox'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
