import express from 'express';
import { 
  getFoodItems, 
  getFoodItemById, 
  createFoodItem, 
  updateFoodItem, 
  deleteFoodItem 
} from '../controllers/foodController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getFoodItems)
  .post(protect, authorize('admin'), createFoodItem);

router.route('/:id')
  .get(getFoodItemById)
  .put(protect, authorize('admin'), updateFoodItem)
  .delete(protect, authorize('admin'), deleteFoodItem);

export default router;
