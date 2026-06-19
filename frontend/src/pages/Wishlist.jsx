import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, Sparkles } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (food) => {
    addToCart(food, 1);
    showToast(`🎉 Added ${food.name} to your basket!`, 'success');
  };

  const handleRemove = (food) => {
    removeFromWishlist(food._id);
    showToast(`Removed ${food.name} from favorites.`, 'success');
  };

  if (!user) {
    return (
      <div className="container flex-center" style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
        <Heart size={48} color="var(--warning)" />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Please sign in to view your wishlist</h3>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      
      {/* Header */}
      <div className="animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--primary-light)', padding: '12px', borderRadius: '16px' }}>
          <Heart size={24} color="var(--primary)" fill="var(--primary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>My <span className="text-gradient">Favorites</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Easily access and order your favorite gourmet selections</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="glass-panel reveal" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>Your favorites list is empty.</p>
          <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{ gap: '8px' }}>
            <Sparkles size={16} />
            Explore Gourmet Menu
          </button>
        </div>
      ) : (
        <div className="grid-responsive">
          {wishlistItems.map((food, index) => (
            <div key={food._id} className={`glass-card reveal delay-${(index % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Card Image */}
              <div 
                onClick={() => navigate(`/food/${food._id}`)}
                style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
              >
                <img 
                  src={food.image} 
                  alt={food.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(20, 22, 30, 0.8)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={14} color="var(--star-color)" fill="var(--star-color)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{food.rating}</span>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                  <span className="badge badge-primary">{food.category}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 
                  onClick={() => navigate(`/food/${food._id}`)}
                  style={{ fontSize: '1.15rem', marginBottom: '8px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.color = ''}
                >
                  {food.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px', flexGrow: 1, lineInterspace: '1.4' }}>
                  {food.description}
                </p>

                {/* Footer Operations */}
                <div className="flex-row-center" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ${food.price.toFixed(2)}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleRemove(food)}
                      className="btn btn-glass"
                      style={{ padding: '8px', color: 'var(--warning)', borderColor: 'rgba(247, 37, 133, 0.2)' }}
                      title="Remove from favorites"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleAddToCart(food)}
                      className="btn btn-primary"
                      style={{ padding: '8px 14px', borderRadius: '8px', gap: '4px', fontSize: '0.85rem' }}
                    >
                      <ShoppingCart size={14} />
                      Order
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
