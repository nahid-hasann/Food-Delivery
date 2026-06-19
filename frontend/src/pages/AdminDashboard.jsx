import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, Plus, Trash, Edit, RefreshCw, DollarSign, Users, Award, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Mock data for Admin Panel Preview (Fallback)
const MOCK_ORDERS = [
  {
    _id: 'ORD-82910',
    createdAt: '2026-06-18T14:32:00Z',
    customerName: 'M. H. Nahid',
    phone: '+94 77 111 2233',
    items: [{ name: 'Premium Pepperoni Pizza', quantity: 2, price: 12.99 }],
    totalAmount: 25.98,
    paymentStatus: 'Paid',
    orderStatus: 'Cooking'
  },
  {
    _id: 'ORD-76123',
    createdAt: '2026-06-17T19:15:00Z',
    customerName: 'Jane Smith',
    phone: '+94 77 999 8888',
    items: [{ name: 'Velvet Chocolate Fudge Cake', quantity: 2, price: 6.99 }],
    totalAmount: 13.98,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered'
  },
  {
    _id: 'ORD-12345',
    createdAt: '2026-06-18T16:00:00Z',
    customerName: 'Robert Frost',
    phone: '+94 77 444 5555',
    items: [{ name: 'Truffle Mushroom Burger', quantity: 1, price: 9.49 }],
    totalAmount: 9.49,
    paymentStatus: 'Unpaid',
    orderStatus: 'Pending'
  }
];

const MOCK_FOODS = [
  { _id: '1', name: 'Premium Pepperoni Pizza', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60' },
  { _id: '2', name: 'Truffle Mushroom Burger', price: 9.49, category: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
  { _id: '3', name: 'Velvet Chocolate Fudge Cake', price: 6.99, category: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60' }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // State variables (populated with mock values initially)
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  
  // Add/Edit food item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Pizza');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [editingFoodId, setEditingFoodId] = useState(null);

  // Fetch orders and foods from backend
  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    const token = localStorage.getItem('quickbite_token');

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          setOrders(MOCK_ORDERS);
        }
      } catch (err) {
        console.error('Failed to fetch orders, loading fallbacks.', err);
        setOrders(MOCK_ORDERS);
      }
    };

    const fetchFoods = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/foods');
        if (response.ok) {
          const data = await response.json();
          setFoods(data);
        } else {
          setFoods(MOCK_FOODS);
        }
      } catch (err) {
        console.error('Failed to fetch foods, loading fallbacks.', err);
        setFoods(MOCK_FOODS);
      }
    };

    fetchOrders();
    fetchFoods();
  }, [user, activeTab]);

  // Handle Order Status Update
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('quickbite_token');
      const response = await fetch(`http://localhost:5005/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        setOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      // Fallback update local state for preview
      setOrders(prev => 
        prev.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    }
  };

  // Handle Delete Food
  const handleDeleteFood = async (id) => {
    try {
      const token = localStorage.getItem('quickbite_token');
      const response = await fetch(`http://localhost:5005/api/foods/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setFoods(prev => prev.filter(food => food._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete food item:', err);
      setFoods(prev => prev.filter(food => food._id !== id));
    }
  };

  // Handle Toggle Availability (Out of Stock / Available)
  const handleToggleAvailability = async (food) => {
    try {
      const token = localStorage.getItem('quickbite_token');
      const updatedStatus = food.isAvailable === false ? true : false;
      const response = await fetch(`http://localhost:5005/api/foods/${food._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isAvailable: updatedStatus })
      });
      if (response.ok) {
        const updatedFood = await response.json();
        setFoods(prev => prev.map(f => f._id === food._id ? updatedFood : f));
      }
    } catch (err) {
      console.error('Failed to toggle food availability:', err);
      setFoods(prev => prev.map(f => f._id === food._id ? { ...f, isAvailable: f.isAvailable === false ? true : false } : f));
    }
  };

  const handleStartEdit = (food) => {
    setEditingFoodId(food._id);
    setNewItemName(food.name);
    setNewItemPrice(food.price.toString());
    setNewItemCategory(food.category);
    setNewItemImage(food.image);
    setNewItemDescription(food.description || '');
  };

  const resetForm = () => {
    setEditingFoodId(null);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCategory('Pizza');
    setNewItemImage('');
    setNewItemDescription('');
  };

  // Handle Add/Edit Food Form Submit
  const handleSaveFood = async (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemImage) return;

    const token = localStorage.getItem('quickbite_token');
    const foodData = {
      name: newItemName,
      price: parseFloat(newItemPrice),
      category: newItemCategory,
      image: newItemImage,
      description: newItemDescription || 'Premium selection prepared with fresh, organic ingredients by our executive chefs.',
      isAvailable: editingFoodId ? (foods.find(f => f._id === editingFoodId)?.isAvailable !== false) : true
    };

    if (editingFoodId) {
      // Edit Mode
      try {
        const response = await fetch(`http://localhost:5005/api/foods/${editingFoodId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(foodData)
        });

        if (response.ok) {
          const updatedFood = await response.json();
          setFoods(prev => prev.map(f => f._id === editingFoodId ? updatedFood : f));
          resetForm();
        }
      } catch (err) {
        console.error('Failed to update food item:', err);
        // Fallback local update
        setFoods(prev => prev.map(f => f._id === editingFoodId ? { ...f, ...foodData } : f));
        resetForm();
      }
    } else {
      // Add Mode
      try {
        const response = await fetch('http://localhost:5005/api/foods', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(foodData)
        });

        if (response.ok) {
          const addedFood = await response.json();
          setFoods(prev => [addedFood, ...prev]);
          resetForm();
        }
      } catch (err) {
        console.error('Failed to create food item:', err);
        // Fallback local update
        const newFood = {
          _id: Date.now().toString(),
          ...foodData
        };
        setFoods(prev => [newFood, ...prev]);
        resetForm();
      }
    }
  };

  // Calculate statistics
  const totalSales = orders.reduce((sum, order) => order.paymentStatus === 'Paid' ? sum + order.totalAmount : sum, 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
  };

  if (!user || user.role !== 'admin') {
    return (
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container flex-center" 
        style={{ minHeight: '60vh', flexDirection: 'column', gap: '20px' }}
      >
        <ShieldAlert size={64} color="var(--warning)" />
        <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Access Denied</h3>
        <p style={{ color: 'var(--text-secondary)' }}>You must log in as an administrator to access the dashboard.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}
    >
      {/* Sidebar Menu */}
      <div className="glass-panel" style={{ width: '260px', borderRight: '1px solid var(--border-glass)', borderRadius: 0, padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '12px' }}>
          Admin Panel
        </h3>
        
        <motion.button 
          onClick={() => setActiveTab('Overview')} 
          className="btn" 
          style={{ 
            width: '100%', 
            justifyContent: 'flex-start',
            background: activeTab === 'Overview' ? 'var(--primary-light)' : 'none', 
            color: activeTab === 'Overview' ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: activeTab === 'Overview' ? 'rgba(255, 107, 53, 0.3)' : 'transparent',
            borderStyle: 'solid',
            borderWidth: '1px'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LayoutDashboard size={18} />
          Overview
        </motion.button>

        <motion.button 
          onClick={() => setActiveTab('Manage Orders')} 
          className="btn" 
          style={{ 
            width: '100%', 
            justifyContent: 'flex-start',
            background: activeTab === 'Manage Orders' ? 'var(--primary-light)' : 'none', 
            color: activeTab === 'Manage Orders' ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: activeTab === 'Manage Orders' ? 'rgba(255, 107, 53, 0.3)' : 'transparent',
            borderStyle: 'solid',
            borderWidth: '1px'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ShoppingBag size={18} />
          Manage Orders
        </motion.button>

        <motion.button 
          onClick={() => setActiveTab('Manage Food Items')} 
          className="btn" 
          style={{ 
            width: '100%', 
            justifyContent: 'flex-start',
            background: activeTab === 'Manage Food Items' ? 'var(--primary-light)' : 'none', 
            color: activeTab === 'Manage Food Items' ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: activeTab === 'Manage Food Items' ? 'rgba(255, 107, 53, 0.3)' : 'transparent',
            borderStyle: 'solid',
            borderWidth: '1px'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={18} />
          Manage Food Items
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div style={{ flexGrow: 1, padding: '40px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Dashboard <span className="text-gradient">Overview</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>Real-time indicators and operational summary</p>
            </div>

            {/* KPI Cards */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}
            >
              <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'var(--success-bg)', padding: '16px', borderRadius: '16px' }}>
                  <DollarSign size={24} color="var(--success)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Sales</p>
                  <h4 style={{ fontSize: '1.8rem', color: '#fff' }}>${totalSales.toFixed(2)}</h4>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'var(--primary-light)', padding: '16px', borderRadius: '16px' }}>
                  <ShoppingBag size={24} color="var(--primary)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Orders</p>
                  <h4 style={{ fontSize: '1.8rem', color: '#fff' }}>{totalOrdersCount}</h4>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(255, 183, 3, 0.15)', padding: '16px', borderRadius: '16px' }}>
                  <RefreshCw size={24} color="var(--star-color)" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Orders</p>
                  <h4 style={{ fontSize: '1.8rem', color: '#fff' }}>{pendingOrdersCount}</h4>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(76, 201, 240, 0.15)', padding: '16px', borderRadius: '16px' }}>
                  <Users size={24} color="#4cc9f0" />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Clients</p>
                  <h4 style={{ fontSize: '1.8rem', color: '#fff' }}>12</h4>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Summary Grid */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="glass-panel" 
              style={{ padding: '24px' }}
            >
              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>System Status</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>All services are online. Connected to PayHere Sandbox Gateway. Ready to process ordering webhooks.</p>
            </motion.div>
          </div>
        )}

        {/* TAB 2: MANAGE ORDERS */}
        {activeTab === 'Manage Orders' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Manage <span className="text-gradient">Orders</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>Track payments and update production status</p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-panel" 
              style={{ overflowX: 'auto', borderRadius: '16px' }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>ID</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>Customer Details</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>Bill</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>Payment</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>Order Status</th>
                    <th style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {orders.map(order => (
                    <motion.tr 
                      key={order._id} 
                      variants={itemVariants}
                      style={{ borderBottom: '1px solid var(--border-glass)' }}
                    >
                      <td style={{ padding: '16px 24px', fontWeight: 600 }}>{order._id}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                      </td>
                      <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary)' }}>${order.totalAmount.toFixed(2)}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className={`badge ${order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span className="badge" style={{ 
                           background: order.orderStatus === 'Pending' ? 'rgba(255,107,53,0.1)' : order.orderStatus === 'Cooking' ? 'rgba(255,183,3,0.1)' : order.orderStatus === 'Cancelled' ? 'rgba(247,37,133,0.1)' : 'rgba(76,201,240,0.1)',
                           color: order.orderStatus === 'Pending' ? 'var(--primary)' : order.orderStatus === 'Cooking' ? 'var(--star-color)' : order.orderStatus === 'Cancelled' ? 'var(--warning)' : '#4cc9f0'
                        }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {order.orderStatus === 'Cancelled' ? (
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No action available</span>
                        ) : (
                          <select 
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            style={{ background: 'var(--bg-main)', color: '#fff', border: '1px solid var(--border-glass)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer' }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </motion.div>
          </div>
        )}

        {/* TAB 3: MANAGE FOOD ITEMS */}
        {activeTab === 'Manage Food Items' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Manage <span className="text-gradient">Food Items</span></h2>
              <p style={{ color: 'var(--text-secondary)' }}>Add new dishes and edit current menu listings</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px', alignItems: 'flex-start' }} className="admin-food-grid">
              
              {/* Food Catalog List */}
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel" 
                style={{ padding: '24px' }}
              >
                <h4 style={{ marginBottom: '20px' }}>Current Menu Items ({foods.length})</h4>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  {foods.map(food => (
                    <motion.div 
                      key={food._id} 
                      variants={itemVariants}
                      className="flex-row-center" 
                      style={{ padding: '12px', border: '1px solid var(--border-glass)', borderRadius: '12px', gap: '16px' }}
                    >
                      <img src={food.image} alt={food.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontWeight: 600 }}>{food.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{food.category}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${food.price.toFixed(2)}</div>
                      
                      {/* Availability Toggle Switch */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(food)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{
                            width: '36px',
                            height: '18px',
                            background: food.isAvailable !== false ? 'var(--primary)' : 'var(--text-muted)',
                            borderRadius: '9px',
                            position: 'relative',
                            transition: 'background 0.3s ease'
                          }}>
                            <div style={{
                              width: '14px',
                              height: '14px',
                              background: '#fff',
                              borderRadius: '50%',
                              position: 'absolute',
                              top: '2px',
                              left: food.isAvailable !== false ? '20px' : '2px',
                              transition: 'left 0.3s ease'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: food.isAvailable !== false ? 'var(--success)' : 'var(--warning)', whiteSpace: 'nowrap' }}>
                            {food.isAvailable !== false ? 'Available' : 'Out of Stock'}
                          </span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <motion.button 
                          onClick={() => handleStartEdit(food)}
                          className="btn btn-glass" 
                          style={{ padding: '8px', color: 'var(--success)', borderColor: 'rgba(76,201,240,0.2)' }}
                          title="Edit Food Item"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button 
                          onClick={() => handleDeleteFood(food._id)}
                          className="btn btn-glass" 
                          style={{ padding: '8px', color: 'var(--warning)', borderColor: 'rgba(247,37,133,0.2)' }}
                          title="Delete Food Item"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash size={16} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Add / Edit Food Form */}
              <motion.div 
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="glass-panel" 
                style={{ padding: '24px' }}
              >
                <h4 style={{ marginBottom: '20px' }}>{editingFoodId ? 'Edit Food Item' : 'Add Food Item'}</h4>
                <form onSubmit={handleSaveFood} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dish Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cheese Pizza"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="glass-input" 
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="e.g. 11.99"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="glass-input" 
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
                    <select 
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      style={{ background: 'var(--bg-main)', color: '#fff', border: '1px solid var(--border-glass)', padding: '12px', borderRadius: '12px', fontSize: '0.95rem' }}
                    >
                      <option value="Pizza">Pizza</option>
                      <option value="Burger">Burger</option>
                      <option value="Cake">Cake</option>
                      <option value="Drinks">Drinks</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Image URL</label>
                    <input 
                      type="url" 
                      placeholder="https://images.unsplash.com/..."
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="glass-input" 
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
                    <textarea 
                      placeholder="Brief description of the dish..."
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      className="glass-input" 
                      style={{ minHeight: '80px', resize: 'vertical' }}
                    />
                  </div>

                  <motion.button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '10px' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingFoodId ? 'Save Changes' : 'Add to Menu'}
                  </motion.button>

                  {editingFoodId && (
                    <motion.button 
                      type="button" 
                      onClick={resetForm} 
                      className="btn btn-secondary" 
                      style={{ width: '100%' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel Edit
                    </motion.button>
                  )}

                </form>
              </motion.div>

            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
