import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

console.log(crypto.randomUUID())

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Encrypt password using bcrypt
// PRE = do something before the data is saved in the database
// POST = something after
// this is middleware for mongoose
// if we are not dealing with the pasword we move on
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  // if we are modyfiing the password
  const salt = await bcrypt.genSalt(10)
  // trading tne plain ps for the hashed password
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User

//  Because bcrypt.compare already returns a Promise, so no need to wrap in another Promise.
// userSchema.methods.matchPassword = function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
//   };

/**
 *
 *  Mongoose Middleware: Functions like pre('save') run at specific points in the document's lifecycle (e.g., before saving). Middleware allows you to add custom logic, such as hashing a password before saving it.
 *
 *  In Your Code: If the password hasn’t been modified, next() is called to skip any further processing (like password hashing) and continue with the save operation.
 * 
 *  next(): It’s a callback function used in Mongoose middleware to signal that the middleware has finished and that Mongoose can move on to the next step (either another middleware or the main operation like saving the document).
 *
 *  The reason for checking if the password field has been modified, even when registering a new user, is to handle scenarios where the same save middleware might be used for both creating new users and updating existing users. Here’s a deeper explanation:
 */
