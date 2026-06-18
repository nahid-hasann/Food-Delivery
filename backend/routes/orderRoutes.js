import express from 'express';
import { 
  checkout, 
  payhereNotify, 
  simulatePaymentSuccess, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', protect, checkout);
router.post('/notify', payhereNotify);
router.post('/simulate-success/:id', simulatePaymentSuccess);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
