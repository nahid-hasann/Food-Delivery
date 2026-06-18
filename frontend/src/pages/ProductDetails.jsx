import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// High-quality fallback data for food items (in case backend/DB is not active)
const MOCK_FOODS = [
  { _id: '1', name: 'Premium Pepperoni Pizza', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60', rating: 4.8, description: 'Double pepperoni, mozzarella, parmesan, fresh basil, house marinara sauce.' },
  { _id: '2', name: 'Truffle Mushroom Burger', price: 9.49, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', rating: 4.9, description: 'Angus beef patty, black truffle aioli, Swiss cheese, caramelized wild mushrooms.' },
  { _id: '3', name: 'Velvet Chocolate Fudge Cake', price: 6.99, category: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60', rating: 4.7, description: 'Rich double-layered dark chocolate cake with velvety ganache icing.' },
  { _id: '4', name: 'Salted Caramel Iced Latte', price: 4.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60', rating: 4.6, description: 'Freshly brewed espresso, milk, house salted caramel syrup, served over ice.' },
  { _id: '5', name: 'Spicy Buffalo Wings', price: 8.99, category: 'Burger', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60', rating: 4.5, description: 'Crispy fried chicken wings tossed in fiery Buffalo glaze, blue cheese dip.' },
  { _id: '6', name: 'Strawberry Cream Dream', price: 7.49, category: 'Cake', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60', rating: 4.8, description: 'Classic Victoria sponge cake topped with fresh organic strawberries and sweet cream.' }
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5005/api/foods/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFood(data);
        } else {
          // Find in fallback data
          const fallbackItem = MOCK_FOODS.find(item => item._id === id);
          setFood(fallbackItem || null);
        }
      } catch (error) {
        console.error('Failed to fetch food details:', error);
        const fallbackItem = MOCK_FOODS.find(item => item._id === id);
        setFood(fallbackItem || null);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id]);

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCartClick = () => {
    if (!food) return;
    addToCart(food, quantity);
    showToast(`🎉 Added ${quantity}x ${food.name} to your basket!`, 'success');
  };

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading food details...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Food Item Not Found</h3>
        <p style={{ color: 'var(--text-secondary)' }}>The requested dish could not be located in our menu.</p>
        <button onClick={() => navigate('/menu')} className="btn btn-primary">
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Back Link */}
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-glass"
        style={{ marginBottom: '32px', padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <ChevronLeft size={16} />
        Back
      </button>

      {/* Details Grid Container */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left Column: Image Card */}
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-glass)' }}>
          <div style={{ width: '100%', height: '400px', overflow: 'hidden', position: 'relative' }}>
            <img 
              src={food.image} 
              alt={food.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Badges on Image */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(20, 22, 30, 0.85)', padding: '6px 14px', borderRadius: '30px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={16} color="var(--star-color)" fill="var(--star-color)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{food.rating}</span>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
              <span className="badge badge-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>{food.category}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: '24px', border: '1px solid var(--border-glass)', boxShadow: 'var(--shadow-md)' }}>
          
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '14px', border: '1px solid rgba(255, 107, 53, 0.1)' }}>
              <Sparkles size={12} />
              Chef Recommendation
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', color: '#fff', lineHeight: 1.1 }}>{food.name}</h1>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>${food.price.toFixed(2)}</p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>Description</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{food.description}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px', marginTop: '8px' }}>
            {user?.role !== 'admin' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Quantity Control */}
                <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)', gap: '16px' }}>
                  <button 
                    onClick={handleDecrement}
                    className="btn-circle btn-glass"
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                  <button 
                    onClick={handleIncrement}
                    className="btn-circle btn-glass"
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button 
                  onClick={handleAddToCartClick}
                  className="btn btn-primary" 
                  style={{ padding: '14px 28px', borderRadius: '12px', flexGrow: 1, gap: '8px', minWidth: '180px' }}
                >
                  <ShoppingCart size={18} />
                  Add to Cart (${(food.price * quantity).toFixed(2)})
                </button>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '16px 20px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                ⚡ Admin Preview Mode (Shopping is disabled for administrator roles)
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProductDetails;
