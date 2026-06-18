import crypto from 'crypto';
import Order from '../models/Order.js';

// Helper to generate PayHere MD5 signature
const generatePayHereHash = (merchantId, orderId, amount, currency, merchantSecret) => {
  // 1. Calculate MD5 hash of merchantSecret
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase();
    
  // 2. Format amount to 2 decimal places (without thousands separators)
  const amountFormatted = Number(amount).toFixed(2);
  
  // 3. Concat variables
  const mainString = merchantId + orderId + amountFormatted + currency + hashedSecret;
  
  // 4. Generate final MD5 hash
  return crypto
    .createHash('md5')
    .update(mainString)
    .digest('hex')
    .toUpperCase();
};

// @desc    Initiate Checkout and generate PayHere parameters
// @route   POST /api/orders/checkout
// @access  Private
export const checkout = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, phone, frontendUrl } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Create unique order record in Database
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      deliveryAddress,
      phone,
      paymentStatus: 'Unpaid',
      orderStatus: 'Pending'
    });

    // PayHere configurations
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_SECRET;
    const currency = 'USD'; // Using USD or LKR
    
    // Generate signature hash
    const hash = generatePayHereHash(
      merchantId,
      order._id.toString(),
      totalAmount,
      currency,
      merchantSecret
    );

    // Build dynamic client urls (fall back to port 5173 if not passed)
    const clientUrl = frontendUrl || 'http://localhost:5173';

    // Assemble payment parameters to send back to frontend
    const paymentParams = {
      sandbox: true,
      merchant_id: merchantId,
      return_url: `${clientUrl}/my-orders?payment=success&orderId=${order._id.toString()}`,
      cancel_url: `${clientUrl}/`,
      notify_url: 'http://localhost:5005/api/orders/notify', // Actual webhook endpoint
      order_id: order._id.toString(),
      items: items.map(item => item.name).join(', '),
      amount: totalAmount.toFixed(2),
      currency: currency,
      first_name: req.user.name,
      last_name: '',
      email: req.user.email,
      phone: phone,
      address: deliveryAddress,
      city: 'Colombo',
      country: 'Sri Lanka',
      hash: hash
    };

    res.status(201).json({
      orderId: order._id,
      paymentParams
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    PayHere IPN (Instant Payment Notification) Webhook
// @route   POST /api/orders/notify
// @access  Public
export const payhereNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = req.body;

    const merchantSecret = process.env.PAYHERE_SECRET;

    // Verify signature to validate authenticity of PayHere webhook
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();
      
    const mainString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
    
    const localHash = crypto
      .createHash('md5')
      .update(mainString)
      .digest('hex')
      .toUpperCase();

    // Check if signature matches
    if (localHash === md5sig) {
      const order = await Order.findById(order_id);
      
      if (order) {
        // Status code '2' means Payment is successful
        if (status_code === '2') {
          order.paymentStatus = 'Paid';
        } else {
          order.paymentStatus = 'Failed';
        }
        await order.save();
        return res.status(200).json({ message: 'Order status updated successfully' });
      }
    }
    
    res.status(400).json({ message: 'Signature validation failed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Simulate Payment Success (For localhost demo backup since PayHere Sandbox cannot hit localhost directly)
// @route   POST /api/orders/simulate-success/:id
// @access  Public
export const simulatePaymentSuccess = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.paymentStatus = 'Paid';
    await order.save();
    
    res.json({ message: 'Order payment simulated as Paid successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get customer's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
      
    // Reshape to match the frontend expectations
    const reshapedOrders = orders.map(order => ({
      _id: order._id,
      createdAt: order.createdAt,
      customerName: order.userId?.name || 'Deleted User',
      phone: order.phone || order.userId?.phone || 'N/A',
      items: order.items,
      totalAmount: order.totalAmount,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus
    }));

    res.json(reshapedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order (Customer only, if status is Pending)
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this order' });
    }

    // Check status
    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled because it is already ' + order.orderStatus });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
