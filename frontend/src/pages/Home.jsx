import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ShoppingCart, Sparkles, ArrowRight, Truck, Utensils, ShieldCheck, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', padding: '6px 16px', borderRadius: '30px', color: 'var(--primary)', marginBottom: '24px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
            <Sparkles size={16} />
            The Ultimate Food Experience
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1 }}>
            Satisfy Your Cravings – <span className="text-gradient">Delivered in Minutes!</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '40px', lineHeight: 1.6 }}>
            Choose from a wide variety of delicious meals made with fresh ingredients. Quick delivery right to your doorstep.
          </p>

          {/* Search bar */}
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', maxWidth: '600px', margin: '0 auto', gap: '12px' }}>
            <Search color="var(--text-muted)" size={20} />
            <input 
              type="text" 
              placeholder="Search for pizza, burger, cake..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flexGrow: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1rem', padding: '10px 0' }}
            />
            <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{ padding: '10px 24px' }}>Explore Menu</button>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Featured <span className="text-gradient">Dishes</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Check out our top culinary recommendations for today</p>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-glass'}`}
              style={{ padding: '8px 24px', borderRadius: '30px', fontWeight: 600 }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Items Grid (Limited to 6 Items) */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading catalog...</p>
        ) : (
          <>
            <div className="grid-responsive">
              {homeDisplayFoods.map(food => (
                <div key={food._id} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                        <button 
                          onClick={() => addToCart(food)} 
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px', fontSize: '0.85rem' }}
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', border: '1px solid var(--border-glass)', padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                          Admin Preview Mode
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Explore Full Menu Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
              <button 
                onClick={() => navigate('/menu')} 
                className="btn btn-primary" 
                style={{ padding: '14px 36px', gap: '10px', fontSize: '1.05rem', boxShadow: 'var(--shadow-glow)' }}
              >
                Explore Full Menu
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && homeDisplayFoods.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No food items found matching your filters.</p>
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section style={{ background: 'rgba(20, 22, 30, 0.5)', padding: '80px 0', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)', marginBottom: '80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Why Choose <span className="text-gradient">QuickBite</span>?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>We offer premium delivery operations designed to blow you away</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div className="glass-card animate-fade-in" style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--bg-glass)' }}>
              <div style={{ display: 'inline-flex', background: 'var(--primary-light)', padding: '16px', borderRadius: '20px', color: 'var(--primary)', marginBottom: '24px', border: '1px solid rgba(255,107,53,0.1)' }}>
                <Truck size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Superfast 30 Min Delivery</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Your order is prioritized immediately and dispatched in thermal insulated bags to ensure it arrives smoking hot.
              </p>
            </div>

            <div className="glass-card animate-fade-in" style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--bg-glass)' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(76, 201, 240, 0.15)', padding: '16px', borderRadius: '20px', color: '#4cc9f0', marginBottom: '24px', border: '1px solid rgba(76, 201, 240, 0.1)' }}>
                <Utensils size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Chef Quality Standards</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our ingredients are organic and locally sourced daily. Every single recipe is crafted by master executive chefs.
              </p>
            </div>

            <div className="glass-card animate-fade-in" style={{ padding: '36px 24px', textAlign: 'center', background: 'var(--bg-glass)' }}>
              <div style={{ display: 'inline-flex', background: 'rgba(255, 183, 3, 0.15)', padding: '16px', borderRadius: '20px', color: 'var(--star-color)', marginBottom: '24px', border: '1px solid rgba(255, 183, 3, 0.1)' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Secure Payments</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Processed through PayHere secure checkout sandbox. Completely transparent transaction guarantees for all orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Reviews Section */}
      <section className="container" style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>What Our <span className="text-gradient">Customers Say</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Read reviews from verified gourmet diners</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
          {REVIEWS.map(review => (
            <div key={review.id} className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
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
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{review.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="container">
        <div className="glass-panel" style={{ 
          padding: '60px 40px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(11, 12, 16, 0.8) 100%)',
          border: '1px solid rgba(255, 107, 53, 0.2)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', background: 'var(--primary-light)', padding: '12px', borderRadius: '50%', color: 'var(--primary)', marginBottom: '20px' }}>
              <Mail size={24} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '12px', color: '#fff' }}>Join the Foodie Club</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '32px', lineHeight: '1.6' }}>
              Subscribe to our weekly newsletter for exclusive discounts, gourmet culinary updates, and chef recommendation recipes.
            </p>

            {isSubscribed ? (
              <div className="glass-panel animate-fade-in" style={{ padding: '16px 24px', background: 'rgba(76, 201, 240, 0.12)', border: '1px solid rgba(76, 201, 240, 0.3)', color: '#4cc9f0', fontWeight: 600, borderRadius: '12px' }}>
                🎉 Awesome! You are now subscribed. Check your email for a 20% discount coupon!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="glass-input"
                  style={{ flexGrow: 1, minWidth: '240px', maxWidth: '380px' }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 30px' }}>
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
