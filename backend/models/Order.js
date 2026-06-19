import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      foodItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid', 'Failed'],
    default: 'Unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'COD'],
    default: 'Card'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Cooking', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  payhereOrderId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Order', orderSchema);
