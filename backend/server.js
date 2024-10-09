import path from 'path' // at top as built in node modules as convention
import express from 'express'
import dotenv from 'dotenv'
dotenv.config() // call above where we uer the variables
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 5001 // fallback

// body parser middlewart
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// cookie parser m/w - allows access to req.cookies - ours is called jwt so we can access req.cookies.jwt
app.use(cookieParser())

connectDB() // call at begining of app

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

/**
 *
 * paypal can make a request to this route and get the id
 * kept in server for security reasons
 * paypal makes req to this route and this route gets it from the env securely
 *
 */
app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
})

// make uploads folder a static folder
// For example, if your project directory is /home/user/project, this line will resolve the uploads directory as /home/user/project/uploads.
const __dirname = path.resolve() // set __dirname to current directory

// make static by express.static and passing in a location
// This tells your Express app to use the upload router for any requests to /api/upload.
// path.resolve() = ensuring that __dirname is set to the current working directory from which the Node.js process is running.

console.log(__dirname, '/uploads') // =  /Users/adamellis/Desktop/pro shop august 2024/proshop august 2024 copy 4 /uploads
// this emsures that the path is root / uploads

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// express.static is a built-in middleware
// function in Express. It is used to serve static
// files (like images, CSS files, JavaScript files, etc.)
// directly from a specified directory.

// Static files are files that the server
// does not need to process or modify—files
// that are served directly as they are stored.

// path.join is used to create a normalized path by joining the current directory (__dirname) with the /uploads directory. This ensures that the server correctly resolves the path regardless of the operating system.
// For example, if your project directory is /home/user/project, this line will resolve the uploads directory as /home/user/project/uploads.

// make sure under all routes

// ANY OTHER ROUTES THAT DO NOT MATCH GET SENT HERE
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}
app.use(notFound)
app.use(errorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
