// helper function
/**
 *   - for the user cart to get hiddenn when the user leaves
 *   - store the care in the database and set to local storage
 *   - when signing in and then delete local storage when that
 *   - user signs out but fetch the next users cart on their
 *   - signin
 */

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

// Update the prices and save to storage
/**
 *
 * KEEP ALL STATE HERE IN ONE FILE
 * SO WE DO NOT HAVE TO KEEP WRITTING
 * OUT THE SAME CODE OVER AGAIN
 *
 */
export const updateCart = (state) => {
  // we are passimg state so we can use it in here
  // Calculate the items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )

  // Calculate the shipping price | If items price is greater than 100, shipping is free | If not, shipping is 10
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)

  // Calculate the tax price | Tax is 15% of the items price
  // make sure it is a number
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)))

  // Calculate the total price | Total price is the sum of the items price, shipping price and tax price / everything formated as a number
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2)

  // Save the cart to localStorage
  localStorage.setItem('cart', JSON.stringify(state))

  return state
}
