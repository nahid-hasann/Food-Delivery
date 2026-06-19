import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, ShoppingCart, Sparkles, ArrowRight, Truck, Utensils, ShieldCheck, Mail, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
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

const REVIEWS = [
  {
    id: 1,
    name: 'M. H. Nahid',
    rating: 5,
    role: 'Regular Customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=60',
    comment: 'QuickBite has completely changed my food ordering experience! The Truffle Burger is out of this world, and the PayHere checkout is super convenient.'
  },
  {
    id: 2,
    name: 'Sadia Rahman',
    rating: 4.8,
    role: 'Dessert Lover',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=60',
    comment: 'The Salted Caramel Cheesecake is incredibly rich and delicious. Highly recommend QuickBite for quick dessert deliveries in Colombo!'
  },
  {
    id: 3,
    name: 'Afnan Ahmed',
    rating: 4.9,
    role: 'Pizza Fanatic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60',
    comment: 'Excellent service! The Double Pepperoni Pizza arrived piping hot within 25 minutes. Outstanding crust and generous toppings.'
  }
];

const Home = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Handle cross-page scrolling
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const sectionId = location.state.scrollTo;
      // Reset navigation state to prevent scrolling again on navigation/refresh
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories = ['All', 'Pizza', 'Burger', 'Cake', 'Drinks'];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/foods');
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

  // Limit foods shown on Homepage to exactly 6 items
  const homeDisplayFoods = filteredFoods.slice(0, 6);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setIsSubscribed(true);
      setNewsletterEmail('');
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
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ paddingBottom: '60px' }}
    >
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '100px 24px', 
        background: 'linear-gradient(rgba(11, 12, 16, 0.4), rgba(11, 12, 16, 0.95)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80") no-repeat center center',
        backgroundSize: 'cover',
        borderRadius: '0 0 32px 32px',
        textAlign: 'center',
        marginBottom: '64px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="animate-slide-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', padding: '6px 16px', borderRadius: '30px', color: 'var(--primary)', marginBottom: '24px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
            <Sparkles size={16} />
            The Ultimate Food Experience
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="animate-slide-up animation-delay-1" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1 }}>
            Satisfy Your Cravings – <span className="text-gradient">Delivered in Minutes!</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="animate-slide-up animation-delay-2" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px', lineHeight: 1.6 }}>
            Choose from a wide variety of delicious meals made with fresh ingredients. Quick delivery right to your doorstep.
          </motion.p>

          {/* Search bar */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="glass-panel animate-slide-up animation-delay-3" style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', maxWidth: '600px', margin: '0 auto', gap: '12px' }}>
            <Search color="var(--text-muted)" size={20} />
            <input 
              type="text" 
              placeholder="Search for pizza, burger, cake..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flexGrow: 1, background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1rem', padding: '10px 0' }}
            />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/menu')} className="btn btn-primary" style={{ padding: '10px 24px' }}>Explore Menu</motion.button>
          </motion.div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="container" 
        style={{ marginBottom: '80px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Featured <span className="text-gradient">Dishes</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Check out our top culinary recommendations for today</p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-glass'}`}
              style={{ padding: '8px 24px', borderRadius: '30px', fontWeight: 600 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Food Items Grid (Limited to 6 Items) */}
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
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="grid-responsive"
            >
              {homeDisplayFoods.map((food) => (
                <motion.div 
                  key={food._id} 
                  variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card" 
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                >
                  {/* Image Container */}
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

                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(20, 22, 30, 0.8)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                      style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)', cursor: 'pointer', transition: 'color 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    >
                      {food.name}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', flexGrow: 1, lineInterspace: '1.4' }}>
                      {food.description}
                    </p>
                    
                    {/* Footer Pricing & CTA */}
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
                            style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px', fontSize: '0.85rem' }}
                          >
                            <ShoppingCart size={16} />
                            Add to Cart
                          </motion.button>
                        ) : (
                          <button 
                            className="btn btn-secondary"
                            disabled
                            style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px', fontSize: '0.85rem', cursor: 'not-allowed', opacity: 0.6 }}
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

            {/* Explore Full Menu Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
              <motion.button 
                onClick={() => navigate('/menu')} 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary" 
                style={{ padding: '14px 36px', gap: '10px', fontSize: '1.05rem', boxShadow: 'var(--shadow-glow)' }}
              >
                Explore Full Menu
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && homeDisplayFoods.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No food items found matching your filters.</p>
          </div>
        )}
      </motion.section>

      {/* How it Works Section */}
      <motion.section 
        id="how-it-works" 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ padding: '80px 0', marginBottom: '80px' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px' }}>Simple 3-Step Process</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>How <span className="text-gradient">QuickBite</span> Works</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>From browsing our menu to taking your first delicious bite, we make the culinary journey effortless.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', position: 'relative' }}
          >
            {/* Step 1 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card" 
              style={{ padding: '40px 30px', textAlign: 'center', background: 'rgba(20, 22, 30, 0.65)', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'visible' }}
            >
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-gradient)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)' }}>
                1
              </div>
              <div style={{ display: 'inline-flex', background: 'var(--primary-light)', padding: '18px', borderRadius: '24px', color: 'var(--primary)', marginBottom: '24px', border: '1px solid rgba(255, 107, 53, 0.15)' }}>
                <Search size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '14px', fontWeight: 700 }}>Browse & Choose</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Explore our curated gallery of chef-crafted pizzas, burgers, desserts, and cold mocktails. Use filters to find exactly what you crave.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card" 
              style={{ padding: '40px 30px', textAlign: 'center', background: 'rgba(20, 22, 30, 0.65)', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'visible' }}
            >
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-gradient)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)' }}>
                2
              </div>
              <div style={{ display: 'inline-flex', background: 'rgba(76, 201, 240, 0.15)', padding: '18px', borderRadius: '24px', color: '#4cc9f0', marginBottom: '24px', border: '1px solid rgba(76, 201, 240, 0.15)' }}>
                <ShoppingCart size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '14px', fontWeight: 700 }}>Place Secure Order</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Add items to your sliding cart, proceed to checkout, and complete your purchase seamlessly through sandbox integrated payment processing.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card" 
              style={{ padding: '40px 30px', textAlign: 'center', background: 'rgba(20, 22, 30, 0.65)', position: 'relative', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'visible' }}
            >
              <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-gradient)', color: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)' }}>
                3
              </div>
              <div style={{ display: 'inline-flex', background: 'rgba(255, 183, 3, 0.15)', padding: '18px', borderRadius: '24px', color: 'var(--star-color)', marginBottom: '24px', border: '1px solid rgba(255, 183, 3, 0.15)' }}>
                <Truck size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '14px', fontWeight: 700 }}>Fast Delivery & Dine</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Our swift riders dispatch immediately in thermal insulated bags. Enjoy hot, restaurant-quality dishes delivered within 30 minutes!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        id="features" 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ background: 'var(--bg-section)', padding: '80px 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)', marginBottom: '80px' }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Why Choose <span className="text-gradient">QuickBite</span>?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>We offer premium delivery operations designed to blow you away</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}
          >
            <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-card" style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--bg-glass)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-flex', alignSelf: 'center', background: 'var(--primary-light)', padding: '16px', borderRadius: '20px', color: 'var(--primary)', marginBottom: '24px', border: '1px solid rgba(255,107,53,0.1)' }}>
                <Truck size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Superfast 30 Min Delivery</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Your order is prioritized immediately and dispatched in thermal insulated bags to ensure it arrives smoking hot.
              </p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-card" style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--bg-glass)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-flex', alignSelf: 'center', background: 'rgba(76, 201, 240, 0.15)', padding: '16px', borderRadius: '20px', color: '#4cc9f0', marginBottom: '24px', border: '1px solid rgba(76, 201, 240, 0.1)' }}>
                <Utensils size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Chef Quality Standards</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our ingredients are organic and locally sourced daily. Every single recipe is crafted by master executive chefs.
              </p>
            </motion.div>

            <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-card" style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--bg-glass)', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'inline-flex', alignSelf: 'center', background: 'rgba(255, 183, 3, 0.15)', padding: '16px', borderRadius: '20px', color: 'var(--star-color)', marginBottom: '24px', border: '1px solid rgba(255, 183, 3, 0.1)' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Secure Payments</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Processed through PayHere secure checkout sandbox. Completely transparent transaction guarantees for all orders.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section 
        id="about-us" 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ padding: '80px 0', borderTop: '1px solid var(--border-glass)', marginBottom: '80px' }}
      >
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '56px', alignItems: 'center' }}>
            
            {/* Left Column - Text Content */}
            <div className="reveal-left" style={{ flex: '1 1 400px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px' }}>Our Story</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: '1.2' }}>
                Crafting Premium <span className="text-gradient">Culinary Experiences</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                At QuickBite, we believe that fast food shouldn't mean compromised quality. Our journey began with a simple mission: to bridge the gap between elite, restaurant-grade fine dining and ultimate home convenience. 
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', lineHeight: '1.7', marginBottom: '36px' }}>
                We partner with handpicked local organic growers to ensure only the crispest, freshest ingredients enter our kitchen. Every recipe is meticulously designed and prepared by executive master chefs, guaranteeing a gourmet delight in every order.
              </p>
              
              {/* Stats Grid */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
              >
                <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(20, 22, 30, 0.5)' }}>
                  <h4 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>15k+</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Diners Served</p>
                </motion.div>
                <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(20, 22, 30, 0.5)' }}>
                  <h4 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4cc9f0', marginBottom: '4px' }}>50+</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Expert Chefs</p>
                </motion.div>
                <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'rgba(20, 22, 30, 0.5)' }}>
                  <h4 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--star-color)', marginBottom: '4px' }}>25m</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Avg Delivery</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Premium Collage / Graphic */}
            <div className="reveal-right" style={{ flex: '1 1 300px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Radial gradient backing glow */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120%',
                height: '120%',
                background: 'radial-gradient(circle, rgba(255, 107, 53, 0.08) 0%, transparent 60%)',
                zIndex: 0,
                pointerEvents: 'none'
              }} />

              {/* Main Image Container */}
              <motion.div 
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
                  border: '4px solid rgba(255, 255, 255, 0.08)',
                  width: '100%',
                  maxWidth: '450px',
                  height: '420px'
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80" 
                  alt="Elite Chef plating food" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Glass Badge Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '24px',
                  background: 'rgba(20, 22, 30, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '12px 24px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)'
                }}>
                  <Sparkles size={18} color="var(--primary)" fill="var(--primary)" />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500, textTransform: 'uppercase' }}>Gourmet Standard</span>
                    <span style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Est. 2026</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Buyer Reviews Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="container" 
        style={{ marginBottom: '80px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>What Our <span className="text-gradient">Customers Say</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Read reviews from verified gourmet diners</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}
        >
          {REVIEWS.map((review) => (
            <motion.div 
              key={review.id} 
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass-card" 
              style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}
            >
              <div style={{ marginBottom: '20px' }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '14px' }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star 
                      key={index} 
                      size={16} 
                      color="var(--star-color)" 
                      fill={index < Math.floor(review.rating) ? 'var(--star-color)' : 'none'} 
                    />
                  ))}
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{review.comment}"
                </p>
              </div>

              {/* Reviewer Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-glass)' }} 
                />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{review.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="container"
      >
        <div className="glass-panel" style={{ 
          padding: '80px 48px', 
          textAlign: 'center',
          background: 'radial-gradient(circle at 10% 20%, rgba(76, 201, 240, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(255, 107, 53, 0.08) 0%, transparent 40%), rgba(20, 22, 30, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Ambient decorative glows */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'var(--primary)',
            filter: 'blur(100px)',
            opacity: 0.15,
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '200px',
            height: '200px',
            background: '#4cc9f0',
            filter: 'blur(100px)',
            opacity: 0.15,
            pointerEvents: 'none'
          }} />

          <div style={{ maxWidth: '620px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'inline-flex', 
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(76, 201, 240, 0.15) 100%)', 
              border: '1px solid rgba(255, 255, 255, 0.12)', 
              padding: '18px', 
              borderRadius: '24px', 
              color: 'var(--primary)', 
              marginBottom: '28px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}>
              <Mail size={32} style={{ color: '#fff' }} />
            </div>
            
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px', color: '#fff', letterSpacing: '-0.03em' }}>
              Join the <span className="text-gradient">Foodie Club</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '36px', lineHeight: '1.6', fontWeight: 400 }}>
              Subscribe to our weekly newsletter for exclusive discounts, gourmet culinary updates, and chef recommendation recipes.
            </p>

            {isSubscribed ? (
              <div className="glass-panel animate-fade-in" style={{ padding: '20px 28px', background: 'rgba(76, 201, 240, 0.12)', border: '1px solid rgba(76, 201, 240, 0.3)', color: '#4cc9f0', fontWeight: 600, borderRadius: '16px' }}>
                🎉 Awesome! You are now subscribed. Check your email for a 20% discount coupon!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center',
                background: 'rgba(0, 0, 0, 0.25)', 
                padding: '6px 6px 6px 16px', 
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                maxWidth: '520px',
                margin: '0 auto',
                flexWrap: 'nowrap'
              }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{ 
                    flexGrow: 1, 
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: '0.95rem',
                    padding: '8px 0',
                    width: '100%'
                  }}
                  required
                />
                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary" 
                  style={{ 
                    padding: '12px 28px', 
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Subscribe
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </motion.section>

    </motion.div>
  );
};

export default Home;
