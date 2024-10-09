import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice'

const ProductEditScreen = () => {
  const { id: productId } = useParams()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId)

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation()
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation()


  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      // creating the product object here
      // objec is being created inside the updateProduct function
      // straight off
      await updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        // ** MUST HAVE THE UNWRAP HERE TO CATCH THE ERROR ** //
      }).unwrap() // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('product updated successfully')
      refetch()
      // navigate back to the product list
      navigate('/admin/productlist')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }
  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setBrand(product.brand)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
  }, [product])

  const uploadFileHandler = async (e) => {
    const formData = new FormData()
    formData.append('image', e.target.files[0])
    try {
      // use unwrap as we return a promise 
      const res = await uploadProductImage(formData).unwrap()
      toast.success(res.message)
      setImage(res.image)
    } catch (err) {
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            {/* IMAGE INPUT PLACEHOLDER */}
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control> 

              <Form.Control
                label="Choose File"
                onChange={uploadFileHandler}
                type="file"
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" style={{ marginTop: '1rem' }}>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen

/**
 * 
 * const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        const { data } = await createProduct();
        const newProductId = data._id;
        navigate(`/admin/product/${newProductId}/edit`);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };


    * Usually you would unwrap an AsyncThunk when you need to wait for the resolution of the Promise at component level before you do something, like redirecting a user, or when you need to do something at component level with the resolution of the Promise, like show a message with some information from the Promise returned from your AsyncThunk.
    * Hope that answers it for you, let me know.
    * 
    * 
    * The mutation returns a Promise so we can await the resolution of that before navigating the user, but here we don't need the error or success payload from the mutation, so we don't need to unwrap it.
    * 
    * providesTags allows you to 'tag' the cached data, basically give some information about whatever the data is so you can identify it later.
    * 
    * invalidatesTags can then specify which 'tags' you identified with your providesTags should be refreshed and the associated tags data be updated in the cache.
    * 
    * https://redux-toolkit.js.org/rtk-query/overview
https://redux-toolkit.js.org/rtk-query/api/createApi#providestags
 */
