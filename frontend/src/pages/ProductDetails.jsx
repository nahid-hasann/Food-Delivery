import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, ShoppingCart, Star, Sparkles, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';

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
  const { toggleWishlist, isInWishlist } = useWishlist();

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
      <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        <div className="skeleton" style={{ width: '80px', height: '36px', borderRadius: '8px', marginBottom: '32px' }} />
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column Image Skeleton */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', border: '1px solid var(--border-glass)' }}>
            <div className="skeleton" style={{ width: '100%', height: '400px' }} />
          </div>
          {/* Right Column Details Skeleton */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div className="skeleton skeleton-title" style={{ width: '80%', height: '36px' }} />
              <div className="skeleton" style={{ width: '150px', height: '20px', borderRadius: '6px' }} />
            </div>
            <div className="skeleton" style={{ width: '80px', height: '24px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
            <div style={{ borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)', padding: '20px 0' }}>
              <div className="skeleton skeleton-text" style={{ width: '100%' }} />
              <div className="skeleton skeleton-text" style={{ width: '90%' }} />
              <div className="skeleton skeleton-text" style={{ width: '95%' }} />
            </div>
          </div>
        </div>
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
            {/* Out of Stock Image Overlay */}
            {food.isAvailable === false && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(20, 22, 30, 0.6)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5
              }}>
                <span style={{
                  background: 'var(--warning-bg)',
                  color: 'var(--warning)',
                  border: '1px solid rgba(247, 37, 133, 0.4)',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '0.05em'
                }}>
                  OUT OF STOCK
                </span>
              </div>
            )}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              {food.isAvailable === false ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--warning-bg)', padding: '4px 12px', borderRadius: '20px', color: 'var(--warning)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '14px', border: '1px solid rgba(247, 37, 133, 0.2)' }}>
                  Out of Stock
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--primary-light)', padding: '4px 12px', borderRadius: '20px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '14px', border: '1px solid rgba(255, 107, 53, 0.1)' }}>
                  <Sparkles size={12} />
                  Chef Recommendation
                </div>
              )}
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)', lineHeight: 1.1 }}>{food.name}</h1>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>${food.price.toFixed(2)}</p>
            </div>
            
            {user?.role !== 'admin' && (
              <button
                onClick={() => {
                  if (!user) {
                    showToast('Please login to add favorites.', 'error');
                    return;
                  }
                  const isFav = isInWishlist(food._id);
                  toggleWishlist(food);
                  showToast(isFav ? `${food.name} removed from favorites.` : `${food.name} added to favorites.`, 'success');
                }}
                className="btn btn-glass"
                style={{
                  padding: '10px',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(20, 22, 30, 0.6)',
                  border: '1px solid var(--border-glass)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.background = 'rgba(20, 22, 30, 0.85)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(20, 22, 30, 0.6)';
                }}
              >
                <Heart 
                  size={22} 
                  color={isInWishlist(food._id) ? 'var(--primary)' : 'var(--text-secondary)'} 
                  fill={isInWishlist(food._id) ? 'var(--primary)' : 'none'}
                  style={{ transition: 'fill 0.2s ease, color 0.2s ease' }}
                />
              </button>
            )}
          </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>Description</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{food.description}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px', marginTop: '8px' }}>
            {user?.role !== 'admin' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                {/* Quantity Control */}
                <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)', gap: '16px', opacity: food.isAvailable !== false ? 1 : 0.5 }}>
                  <button 
                    onClick={handleDecrement}
                    disabled={food.isAvailable === false}
                    className="btn-circle btn-glass"
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: food.isAvailable !== false ? 'pointer' : 'not-allowed' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{food.isAvailable !== false ? quantity : 0}</span>
                  <button 
                    onClick={handleIncrement}
                    disabled={food.isAvailable === false}
                    className="btn-circle btn-glass"
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, cursor: food.isAvailable !== false ? 'pointer' : 'not-allowed' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                {food.isAvailable !== false ? (
                  <button 
                    onClick={handleAddToCartClick}
                    className="btn btn-primary" 
                    style={{ padding: '14px 28px', borderRadius: '12px', flexGrow: 1, gap: '8px', minWidth: '180px' }}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart (${(food.price * quantity).toFixed(2)})
                  </button>
                ) : (
                  <button 
                    disabled
                    className="btn btn-secondary" 
                    style={{ padding: '14px 28px', borderRadius: '12px', flexGrow: 1, gap: '8px', minWidth: '180px', cursor: 'not-allowed', opacity: 0.6 }}
                  >
                    Out of Stock
                  </button>
                )}
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
