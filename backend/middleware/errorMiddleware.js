// stops the type cast html so we can custom
// (req, res, next) this overides default err handler
// we did something simular with the asymc handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // If Mongoose not found error, set to 404 and change message
  // also specifically checking for the kind
  //  ** NOT USED **
  // if (err.name === 'CastError' && err.kind === 'ObjectId') {
  //   statusCode = 404
  //   message = 'Resource not found'
  // }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

// bring in in server.js
export { notFound, errorHandler };

/**
 * 
 *  Use promises to avoid the overhead of the try...catch 
 *  block or when using functions that return promises. 
 *  For example:

 *   app.get('/', (req, res, next) => {
 *     Promise.resolve().then(() => {
 *       throw new Error('BROKEN')
 *     }).catch(next) // Errors will be passed to Express.
 *   })
 */
