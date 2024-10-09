import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

//  * .product-title {
// height: 2.5em; /* Set a fixed height */
// overflow: hidden; /* Hide overflow content */
// text-overflow: ellipsis; /* Add ellipsis for long text */
// white-space: nowrap; /* Prevent wrapping */

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          {/* display as a <div> */}
          <Card.Title as="div" className="prouct-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
