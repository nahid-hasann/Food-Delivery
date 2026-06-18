import React, { useState } from 'react';
import { Search, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

// High-quality mock data for food items
const MOCK_FOODS = [
  { _id: '1', name: 'Premium Pepperoni Pizza', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.8, description: 'Double pepperoni, mozzarella, parmesan, fresh basil, house marinara sauce.' },
  { _id: '2', name: 'Truffle Mushroom Burger', price: 9.49, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.9, description: 'Angus beef patty, black truffle aioli, Swiss cheese, caramelized wild mushrooms.' },
  { _id: '3', name: 'Velvet Chocolate Fudge Cake', price: 6.99, category: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.7, description: 'Rich double-layered dark chocolate cake with velvety ganache icing.' },
  { _id: '4', name: 'Salted Caramel Iced Latte', price: 4.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.6, description: 'Freshly brewed espresso, milk, house salted caramel syrup, served over ice.' },
  { _id: '5', name: 'Spicy Buffalo Wings', price: 8.99, category: 'Burger', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.5, description: 'Crispy fried chicken wings tossed in fiery Buffalo glaze, blue cheese dip.' },
  { _id: '6', name: 'Strawberry Cream Dream', price: 7.49, category: 'Cake', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.8, description: 'Classic Victoria sponge cake topped with fresh organic strawberries and sweet cream.' }
];

const Home = () => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Pizza', 'Burger', 'Cake', 'Drinks'];

  const filteredFoods = MOCK_FOODS.filter(food => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '80px 24px', 
        background: 'linear-gradient(rgba(11, 12, 16, 0.4), rgba(11, 12, 16, 0.95)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80") no-repeat center center',
        backgroundSize: 'cover',
        borderRadius: '0 0 32px 32px',
        textAlign: 'center',
        marginBottom: '48px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-light)', padding: '6px 16px', borderRadius: '30px', color: 'var(--primary)', marginBottom: '24px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
            <Sparkles size={16} />
            The Ultimate Food Experience
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>
            Satisfy Your Cravings – <span className="text-gradient">Delivered in Minutes!</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '36px' }}>
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
            <button className="btn btn-primary" style={{ padding: '10px 24px' }}>Search</button>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="container">
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

        {/* Food Items Grid */}
        <div className="grid-responsive">
          {filteredFoods.map(food => (
            <div key={food._id} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Image Container */}
              <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
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
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{food.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', flexGrow: 1, lineInterspace: '1.4' }}>
                  {food.description}
                </p>
                
                {/* Footer Pricing & CTA */}
                <div className="flex-row-center" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                    ${food.price.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => addToCart(food)} 
                    className="btn btn-primary"
                    style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px', fontSize: '0.85rem' }}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredFoods.length === 0 && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No food items found matching your filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
