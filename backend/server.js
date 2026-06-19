import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import FoodItem from './models/FoodItem.js';
import mongoose from 'mongoose';

// Load env variables
dotenv.config();

// Connect to Database & Run Seeder
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  try {
    // Drop the unique index on payhereOrderId if it exists in the database to prevent E11000 duplicate key on null
    await mongoose.connection.db.collection('orders').dropIndex('payhereOrderId_1');
    console.log('\x1b[32m[Database]\x1b[0m Legacy unique index on payhereOrderId dropped.');
  } catch (error) {
    // Index might not exist, ignore
  }
  
  const app = express();

  // Trust proxy for secure headers (Render, Heroku, etc.)
  app.set('trust proxy', 1);

  // Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/foods', foodRoutes);
  app.use('/api/orders', orderRoutes);

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      message: 'QuickBite Full-Stack Server is running smoothly',
      timestamp: new Date()
    });
  });

  // Port configuration
  const PORT = process.env.PORT || 5005;

  app.listen(PORT, () => {
    console.log(`\x1b[35m[Server]\x1b[0m Running in development mode on port ${PORT}`);
  });
};

// Auto-seeding function to pre-populate menu item data if DB is empty
const seedDatabase = async () => {
  try {
    // Reset foods database on start to ensure we seed all 12 items
    await FoodItem.deleteMany({});
    
    const mockFoods = [
      {
        name: 'Premium Pepperoni Pizza',
        price: 12.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60',
        description: 'Double pepperoni, mozzarella, parmesan, fresh basil, house marinara sauce.',
        rating: 4.8
      },
      {
        name: 'Truffle Mushroom Burger',
        price: 9.49,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
        description: 'Angus beef patty, black truffle aioli, Swiss cheese, caramelized wild mushrooms.',
        rating: 4.9
      },
      {
        name: 'Velvet Chocolate Fudge Cake',
        price: 6.99,
        category: 'Cake',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60',
        description: 'Rich double-layered dark chocolate cake with velvety ganache icing.',
        rating: 4.7
      },
      {
        name: 'Salted Caramel Iced Latte',
        price: 4.49,
        category: 'Drinks',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
        description: 'Freshly brewed espresso, milk, house salted caramel syrup, served over ice.',
        rating: 4.6
      },
      {
        name: 'Spicy Buffalo Wings',
        price: 8.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&auto=format&fit=crop&q=60',
        description: 'Crispy fried chicken wings tossed in fiery Buffalo glaze, blue cheese dip.',
        rating: 4.5
      },
      {
        name: 'Strawberry Cream Dream',
        price: 7.49,
        category: 'Cake',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60',
        description: 'Classic Victoria sponge cake topped with fresh organic strawberries and sweet cream.',
        rating: 4.8
      },
      {
        name: 'Four Cheese Garlic Pizza',
        price: 13.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
        description: 'Mozzarella, gorgonzola, parmesan, cheddar, roasted garlic, extra virgin olive oil.',
        rating: 4.7
      },
      {
        name: 'BBQ Chicken Feast Pizza',
        price: 14.49,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
        description: 'Grilled chicken breast, sweet BBQ glaze, red onions, cilantro, smoked gouda cheese.',
        rating: 4.8
      },
      {
        name: 'Double Bacon Cheddar Burger',
        price: 10.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=60',
        description: 'Double beef patties, crispy hickory bacon, sharp cheddar cheese, lettuce, tomato, BBQ sauce.',
        rating: 4.9
      },
      {
        name: 'Crispy Avocado Veggie Burger',
        price: 8.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&auto=format&fit=crop&q=60',
        description: 'Organic garden veggie patty, panko crispy avocado slices, alfalfa sprouts, spicy herb aioli.',
        rating: 4.6
      },
      {
        name: 'Salted Caramel Cheesecake',
        price: 7.99,
        category: 'Cake',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60',
        description: 'New York style cheesecake topped with rich salted caramel sauce and toasted pecans.',
        rating: 4.7
      },
      {
        name: 'Matcha Green Tea Crepe',
        price: 7.49,
        category: 'Cake',
        image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format&fit=crop&q=60',
        description: 'Twenty layers of delicate matcha crepes with light green tea pastry cream.',
        rating: 4.5
      },
      {
        name: 'Spicy Jalapeno Popper Pizza',
        price: 13.49,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=60',
        description: 'Loaded with spicy jalapenos, cream cheese dollops, cheddar, crispy bacon, and chili flakes.',
        rating: 4.7
      },
      {
        name: 'Classic Cheeseburger Supreme',
        price: 8.49,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
        description: 'Grilled beef patty, cheddar cheese, pickles, onions, mustard, and our house secret sauce.',
        rating: 4.6
      },
      {
        name: 'Red Velvet Cream Cake',
        price: 7.99,
        category: 'Cake',
        image: 'https://images.unsplash.com/photo-1586985289688-ca9cf49d3530?w=500&auto=format&fit=crop&q=60',
        description: 'Elegant layers of deep red velvet cake frosted with rich vanilla cream cheese icing.',
        rating: 4.8
      },
      {
        name: 'Tropical Mango Passion Smoothie',
        price: 5.49,
        category: 'Drinks',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60',
        description: 'Organic sweet mangoes blended with passion fruit, greek yogurt, and honey.',
        rating: 4.8
      },
      {
        name: 'Hawaiian Sunshine Pizza',
        price: 12.49,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60',
        description: 'Sweet tropical pineapples, tender smoked ham, mozzarella, and dynamic tomato sauce.',
        rating: 4.4
      },
      {
        name: 'Iced Matcha Mint Latte',
        price: 4.99,
        category: 'Drinks',
        image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
        description: 'Premium organic ceremonial grade matcha whisked with fresh mint leaves and oat milk over ice.',
        rating: 4.7
      }
    ];
    
    await FoodItem.insertMany(mockFoods);
    console.log('\x1b[32m[Database]\x1b[0m Mock food menu items seeded successfully!');
  } catch (error) {
    console.error('\x1b[31m[Database] Auto-seeding failed:\x1b[0m', error.message);
  }
};

startServer();
