import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, ArrowRight, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Checkout address details state
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Card');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Card number copied to clipboard!', 'success');
  };

  if (!isCartOpen || user?.role === 'admin') return null;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!address || !phone) return;
    
    setIsProcessing(true);
    
    // If user is not logged in, prompt to log in first
    if (!user) {
      showToast('Please login to place an order.', 'error');
      setIsProcessing(false);
      toggleCart();
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('quickbite_token');
      
      // Post order details to backend to get PayHere parameters
      const response = await fetch(`${API_URL}/api/orders/checkout`, {
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
          phone: phone,
          frontendUrl: window.location.origin,
          paymentMethod: paymentMethod
        })
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.message || 'Failed to place order');
      }

      if (paymentMethod === 'COD') {
        // Cash on Delivery Order Success
        setIsProcessing(false);
        clearCart();
        toggleCart();
        showToast('🎉 Cash on Delivery order placed successfully! Pay upon delivery.', 'success');
        navigate('/my-orders');
      } else {
        // Online Card Order Success (Demo Mode or PayHere)
        if (isDemoMode) {
          // Bypass redirect and simulate success directly for local offline testing
          const simulateSuccessResponse = await fetch(`${API_URL}/api/orders/simulate-success/${orderData.orderId}`, {
            method: 'POST'
          });
          
          setIsProcessing(false);
          clearCart();
          toggleCart();
          showToast('🎉 Mock Payment Successful! Your order has been placed and marked as Paid.', 'success');
          navigate('/my-orders');
        } else {
          // Proceed to real PayHere Sandbox
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
          setIsProcessing(false);
        }
      }

    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Checkout failed: ' + error.message, 'error');
      setIsProcessing(false);
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

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0 8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Payment Method</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label className="glass-panel" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', border: paymentMethod === 'Card' ? '1px solid var(--primary)' : '1px solid var(--border-glass)', background: paymentMethod === 'Card' ? 'rgba(255, 107, 53, 0.05)' : 'none' }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Card" 
                        checked={paymentMethod === 'Card'} 
                        onChange={() => setPaymentMethod('Card')}
                        style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Online Card</span>
                    </label>
                    <label className="glass-panel" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', border: paymentMethod === 'COD' ? '1px solid var(--primary)' : '1px solid var(--border-glass)', background: paymentMethod === 'COD' ? 'rgba(255, 107, 53, 0.05)' : 'none' }}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="COD" 
                        checked={paymentMethod === 'COD'} 
                        onChange={() => setPaymentMethod('COD')}
                        style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cash On Delivery</span>
                    </label>
                  </div>
                </div>

                <div className="flex-row-center" style={{ margin: '4px 0' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Bill</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>${cartTotal.toFixed(2)}</span>
                </div>

                {/* Demo Mode Toggle (Only visible if Online Card is selected) */}
                {paymentMethod === 'Card' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0 12px', background: 'rgba(255, 107, 53, 0.08)', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(255, 107, 53, 0.2)' }}>
                      <input 
                        type="checkbox" 
                        id="demoMode" 
                        checked={isDemoMode} 
                        onChange={(e) => setIsDemoMode(e.target.checked)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                      />
                      <label htmlFor="demoMode" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
                        ⚡ Demo Mode (Simulate Instant Payment)
                      </label>
                    </div>
                    
                    {!isDemoMode && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', marginBottom: '12px', border: '1px solid var(--border-glass)' }}>
                        <strong>Sandbox Test Cards:</strong><br/>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}>
                          <span>Visa: <code style={{color: 'var(--primary)'}}>4916217501611292</code></span>
                          <button type="button" onClick={() => handleCopy('4916217501611292')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }} title="Copy Visa"><Copy size={12} /></button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 6px' }}>
                          <span>MasterCard: <code style={{color: 'var(--primary)'}}>5307732125531191</code></span>
                          <button type="button" onClick={() => handleCopy('5307732125531191')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }} title="Copy MasterCard"><Copy size={12} /></button>
                        </div>
                        <span style={{fontSize: '0.7rem', opacity: 0.8}}>(Use any future expiry date & CVV)</span>
                      </div>
                    )}
                  </>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px', gap: '8px' }}
                  disabled={isProcessing}
                >
                  {paymentMethod === 'Card' ? <CreditCard size={18} /> : <ShoppingBag size={18} />}
                  {isProcessing 
                    ? 'Processing...' 
                    : paymentMethod === 'COD' 
                      ? 'Place Order (Cash on Delivery)' 
                      : isDemoMode 
                        ? 'Place Order (Demo Pay)' 
                        : 'Proceed to PayHere Sandbox'}
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
