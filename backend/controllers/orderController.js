// we consume these endpoints in the frontend to crud
import asyncHandler from '../middleware/asyncHandler.js'
import Order from '../models/orderModel.js'

// changing add order items and update order to paid
import Product from '../models/productModel.js'
import { calcPrices } from '../utils/calcPrices.js'
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js'

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

/**
 * **
 * not placed direcly in as in orderSchema product is just an id
 * order items will be an array of objects with name, qty, img, etc
 * BUT there will be not 'product' which is an id that has to be saved in the database
 * we need to map through get each order
 * spread out and add on TO ORDER ITEMS
 * 1: product which is the ObjectId(...)
 * 2: set _id to undefined (AS NOT NEEDED) this will get set automaticly by mongoose anyway
 */
// here we are not gettig the calc prices from the client

const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body

  // check if order items are there
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    })

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      )
      //  **
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      }
    })

    // calculate prices
    // pass in order otems to calc price
    // then de-structure to get those prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems)

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  /**
   * populate: add user name and email to the order
   * populate from the user collection
   * and populate the name and email field
   * adds the fields of name / email from user model
   * which we have a reference to in the order model at the top
   * it has the ref and creates name / email fields and uses the data from the user ref in the order schema
   *
   * populate automaticly places the id of that user in the 'user' object
   */
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // call our verified function which makes reqest to paypal API and gets the token back
  // if verified then verified will  be true
  //
  const { verified, value } = await verifyPayPalPayment(req.body.id)
  if (!verified) throw new Error('Payment not verified')

  // check if this transaction has been used before
  // not charging the customer twice
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id)
  if (!isNewTransaction) throw new Error('Transaction has been used before')

  const order = await Order.findById(req.params.id)

  if (order) {
    // check the correct amount was paid
    // returns true only if payment matches the value
    const paidCorrectAmount = order.totalPrice.toString() === value
    // if false then it sis sthe incorrect amount
    if (!paidCorrectAmount) throw new Error('Incorrect amount paid')

    // only after the checks do we set paid to true
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // populate from the user collction the id and the name
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
})

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
}
