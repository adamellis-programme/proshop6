// GOOD PRACTICES WE HAVE TO DO OUR SELVES MVC
import asyncHandler from '../middleware/asyncHandler.js'
import Product from '../models/productModel.js'

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT
  // set to the page number that is in the url (req.query) to get what ever we called it in thhe query params
  // cast it to a number
  const page = Number(req.query.pageNumber) || 1

  // ret obj
  // we use regex as when wwe type phone it gives us all iphones 10 etc
  // options 'i' makes case insenitive
  // req.query comes in through params req obj
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : // no keyword
      {}

  // count documents is a mongoose method
  // gets total number of products
  // still limit the count
  const count = await Product.countDocuments({ ...keyword })

  // skip works if on 3 page it skips all pages before it
  // spread across ...keyword do the same and find only products with this keyword
  // IF THERE IS A KEYWORD
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  // return an object
  // first round up then divide count by the page size
  // pages is 100 / 10 gives us 10 pages
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    return res.json(product)
  }
  // this will throw a cast html error
  // test in postman with id of 1 (does not exist)
  // res.status(404).json({ message: 'Product not found' })
  res.status(404)
  throw new Error('Resource not found')
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)
  // console.log(product.reviews)
  // console.log(req.user)

  /**
   * find the first that matches
   * loop through the reviews array and find first one
   *
   * r.user.toString() = name of the reviewer on each review object
   *
   * req.user._id.toString() = is the logged in user
   *
   * if these two match then run true
   *
   *        -- if reviewerId matches logged in
   *        -- id this means the loggedin user
   *        -- has reviewed this product before
   *
   *    if all reviews were separate records in the reviews collection
   *    then we would check if productReviews (look In $in ) .includes(user._id)
   *    look in the reviewIds array and see if user._id is in that array
   *
   *    reviewIds: ['id1, id2, id3, id4, ']
   *    when a review is deleted we loop through and
   *    remove the userId
   *
   *    ($in like the next property project)
   *    next properties
   *
   *
   */
  if (product) {
    const alreadyReviewed = product.reviews.find(
      // match it to a loggedin users id as a string
      (r) => r.user.toString() === req.user._id.toString()
    )

    console.log('ALREADY REVIEWED', alreadyReviewed)

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating), // make sure is number
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    // set the reviews to whatever the number of reviews are
    // after we push on new review
    product.numReviews = product.reviews.length

    // get the overall rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})
export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
}
