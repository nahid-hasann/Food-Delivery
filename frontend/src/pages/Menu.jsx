import React, { useState } from 'react';
import { Search, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const MOCK_FOODS = [
  { _id: '1', name: 'Premium Pepperoni Pizza', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.8, description: 'Double pepperoni, mozzarella, parmesan, fresh basil, house marinara sauce.' },
  { _id: '2', name: 'Truffle Mushroom Burger', price: 9.49, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.9, description: 'Angus beef patty, black truffle aioli, Swiss cheese, caramelized wild mushrooms.' },
  { _id: '3', name: 'Velvet Chocolate Fudge Cake', price: 6.99, category: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.7, description: 'Rich double-layered dark chocolate cake with velvety ganache icing.' },
  { _id: '4', name: 'Salted Caramel Iced Latte', price: 4.49, category: 'Drinks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.6, description: 'Freshly brewed espresso, milk, house salted caramel syrup, served over ice.' },
  { _id: '5', name: 'Spicy Buffalo Wings', price: 8.99, category: 'Burger', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.5, description: 'Crispy fried chicken wings tossed in fiery Buffalo glaze, blue cheese dip.' },
  { _id: '6', name: 'Strawberry Cream Dream', price: 7.49, category: 'Cake', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', rating: 4.8, description: 'Classic Victoria sponge cake topped with fresh organic strawberries and sweet cream.' }
];

const Menu = () => {
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
    <div className="container animate-fade-in" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
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
          style={{ flexGrow: 1, background: 'none', border: 'none', color: '#fff', fontSize: '1.05rem', padding: '10px 0' }}
        />
      </div>

      {/* Category Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-glass'}`}
            style={{ padding: '8px 24px', borderRadius: '30px' }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid-responsive">
        {filteredFoods.map(food => (
          <div key={food._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
              <img 
                src={food.image} 
                alt={food.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(20, 22, 30, 0.8)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} color="var(--star-color)" fill="var(--star-color)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{food.rating}</span>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>{food.category}</span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{food.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', flexGrow: 1 }}>
                {food.description}
              </p>
              
              <div className="flex-row-center" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                  ${food.price.toFixed(2)}
                </span>
                <button 
                  onClick={() => addToCart(food)} 
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px' }}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No items found.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
