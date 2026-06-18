import React, { useState, useEffect } from 'react';
import { Search, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const Menu = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
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
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading catalog...</p>
      ) : (
        <>
          <div className="grid-responsive">
            {currentFoods.map(food => (
              <div key={food._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(20, 22, 30, 0.8)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                      <button 
                        onClick={() => addToCart(food)} 
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', borderRadius: '8px', gap: '6px' }}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '48px' }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                className="btn btn-glass"
                style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
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
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                className="btn btn-glass"
                style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {!loading && filteredFoods.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '16px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No items found.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
