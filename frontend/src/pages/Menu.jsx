import React, { useState, useEffect } from 'react';
import { Search, Star, ShoppingCart, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import API_URL from '../config';

// High-quality fallback data for food items (in case backend/DB is not active)
const MOCK_FOODS = [
  { _id: '1', name: 'Premium Pepperoni Pizza', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60', rating: 4.8, description: 'Double pepperoni, mozzarella, parmesan, fresh basil, house marinara sauce.' },
  { _id: '2', name: 'Truffle Mushroom Burger', price: 9.49, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', rating: 4.9, description: 'Angus beef patty, black truffle aioli, Swiss cheese, caramelized wild mushrooms.' },
  { _id: '3', name: 'Velvet Chocolate Fudge Cake', price: 6.99, category: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60', rating: 4.7, description: 'Rich double-layered dark chocolate cake with velvety ganache icing.' },
  { _id: '4', name: 'Salted Caramel Iced Latte', price: 4.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60', rating: 4.6, description: 'Freshly brewed espresso, milk, house salted caramel syrup, served over ice.' },
  { _id: '5', name: 'Spicy Buffalo Wings', price: 8.99, category: 'Burger', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60', rating: 4.5, description: 'Crispy fried chicken wings tossed in fiery Buffalo glaze, blue cheese dip.' },
  { _id: '6', name: 'Strawberry Cream Dream', price: 7.49, category: 'Cake', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60', rating: 4.8, description: 'Classic Victoria sponge cake topped with fresh organic strawberries and sweet cream.' }
];

const Menu = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['All', 'Pizza', 'Burger', 'Cake', 'Drinks'];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${API_URL}/api/foods`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setFoods(data);
          } else {
            setFoods(MOCK_FOODS);
          }
        } else {
          setFoods(MOCK_FOODS);
        }
      } catch (error) {
        console.error('Failed fetching from DB, loading fallbacks.', error);
        setFoods(MOCK_FOODS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoods();
  }, []);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const filteredFoods = foods.filter(food => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
                          food.name.toLowerCase().includes(query) || 
                          (food.description && food.description.toLowerCase().includes(query)) ||
                          food.category.toLowerCase().includes(query) ||
                          food.price.toString().includes(query);
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = filteredFoods.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container" 
      style={{ paddingTop: '40px', paddingBottom: '80px' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
          Explore Our <span className="text-gradient">Delectable Menu</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Selected from premium kitchens, crafted by world-class chefs, and delivered to your table.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', maxWidth: '600px', margin: '0 auto 40px', gap: '12px' }}>
        <Search color="var(--text-muted)" size={20} />
        <input 
          type="text" 
          placeholder="Filter foods..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flexGrow: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.05rem', padding: '10px 0' }}
        />
      </div>

      {/* Category Buttons */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}
      >
        {categories.map(category => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={cardVariants}
            className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-glass'}`}
            style={{ padding: '8px 24px', borderRadius: '30px' }}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid-responsive">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="skeleton skeleton-image" />
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div className="skeleton skeleton-title" style={{ width: '70%' }} />
                <div className="skeleton skeleton-text" style={{ width: '100%' }} />
                <div className="skeleton skeleton-text" style={{ width: '90%', marginBottom: '24px' }} />
                <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '6px' }} />
                  <div className="skeleton" style={{ width: '100px', height: '36px', borderRadius: '8px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid-responsive"
          >
            {currentFoods.map((food) => (
              <motion.div 
                key={food._id} 
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card" 
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div 
                  onClick={() => navigate(`/food/${food._id}`)}
                  style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
                >
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-slow)' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />

                  {/* Heart/Wishlist Button Overlay */}
                  {user?.role !== 'admin' && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          showToast('Please login to add favorites.', 'error');
                          return;
                        }
                        const isFav = isInWishlist(food._id);
                        toggleWishlist(food);
                        showToast(isFav ? `${food.name} removed from favorites.` : `${food.name} added to favorites.`, 'success');
                      }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(20, 22, 30, 0.85)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}
                    >
                      <Heart 
                        size={18} 
                        color={isInWishlist(food._id) ? 'var(--primary)' : 'var(--text-secondary)'} 
                        fill={isInWishlist(food._id) ? 'var(--primary)' : 'none'} 
                        style={{ transition: 'fill 0.2s ease, color 0.2s ease' }}
                      />
                    </motion.button>
                  )}

                  {/* Out of Stock Overlay */}
                  {food.isAvailable === false && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(20, 22, 30, 0.7)',
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
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em'
                      }}>
                        OUT OF STOCK
                      </span>
                    </div>
                  )}

                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(20, 22, 30, 0.8)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-glass)' }}>
                    <Star size={14} color="var(--star-color)" fill="var(--star-color)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{food.rating}</span>
                  </div>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>{food.category}</span>
                  <h3 
                    onClick={() => navigate(`/food/${food._id}`)}
                    style={{ fontSize: '1.2rem', marginBottom: '8px', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseOut={(e) => e.currentTarget.style.color = ''}
                  >
                    {food.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', flexGrow: 1 }}>
                    {food.description}
                  </p>
                  
                  <div className="flex-row-center" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ${food.price.toFixed(2)}
                    </span>
                    {user?.role !== 'admin' ? (
                      food.isAvailable !== false ? (
                        <motion.button 
                          onClick={() => addToCart(food)} 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px' }}
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </motion.button>
                      ) : (
                        <button 
                          className="btn btn-secondary"
                          disabled
                          style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px', cursor: 'not-allowed', opacity: 0.6 }}
                        >
                          Out of Stock
                        </button>
                      )
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', border: '1px solid var(--border-glass)', padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                        Admin Preview Mode
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
              <motion.button 
                onClick={() => handlePageChange(currentPage - 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-glass"
                style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </motion.button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`btn ${currentPage === page ? 'btn-primary' : 'btn-glass'}`}
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    padding: 0, 
                    borderRadius: '8px',
                    fontWeight: 600,
                    boxShadow: currentPage === page ? 'var(--shadow-glow)' : 'none'
                  }}
                >
                  {page}
                </motion.button>
              ))}

              <motion.button 
                onClick={() => handlePageChange(currentPage + 1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-glass"
                style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </>
      )}

      {!loading && filteredFoods.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No items found.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Menu;
