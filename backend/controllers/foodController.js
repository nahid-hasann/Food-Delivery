import FoodItem from '../models/FoodItem.js';

// @desc    Get all food items (optional filtering by category)
// @route   GET /api/foods
// @access  Public
export const getFoodItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isAvailable: true };

    // Apply category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Apply search search filter
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const foods = await FoodItem.find(query).sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
export const getFoodItemById = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFoodItem = async (req, res) => {
  try {
    const { name, price, category, image, description, rating } = req.body;

    const food = await FoodItem.create({
      name,
      price,
      category,
      image,
      description,
      rating: rating || 4.5
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const updatedFood = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFoodItem = async (req, res) => {
  try {
    const food = await FoodItem.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    await food.deleteOne();
    res.json({ message: 'Food item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
