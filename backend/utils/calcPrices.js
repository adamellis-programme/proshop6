// exactly the same as the frontend helper fucntions
// we keep it on the server to stop tech savy people changing the values

function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2)
}

export function calcPrices(orderItems) {
  // Calculate the items price
  const itemsPrice = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  // Calculate the shipping price
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10)
  // Calculate the tax price
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)))
  // Calculate the total price
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2)
  // items price is what is in the cart
  return { itemsPrice, shippingPrice, taxPrice, totalPrice }
}

// used in the order controller