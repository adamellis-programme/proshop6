const asyncHandler = (fn) => (req, res, next) =>
  // resolve a proise, if res calls next
  Promise.resolve(fn(req, res, next)).catch(next)

export default asyncHandler

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
