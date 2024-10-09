import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
// used to interact witn the state
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'

import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  //   loading is auto created
  const [login, { isLoading }] = useLoginMutation()

  const { userInfo } = useSelector((state) => state.auth)

  // check if if redirect is in the params and if logged out then redirect
  // checkout auto sends to login
  const { search } = useLocation()
  const sp = new URLSearchParams(search) // pass search into the constructor
  // redirect = /shipping
  const redirect = sp.get('redirect') || '/'
  console.log(redirect)

  // handle redirect

  useEffect(() => {
    // if logged in navigate to whatever the redirect is
    // will not get redirected if not logged in
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  // we have to call login at the mutation (this sends the req to the backend and sets the cookie)
  // 1-- send to login call to backend users api slice
  // 2-- when we get the user data back we call
  //     from the auth slice setCredentials
  //      token does NOT get put in local storage

  /**
   *
   *
   * we login by calling botth LOGIN from USER API SLICE
   * and by calling SET CREDENTIALS from the auth slice
   * check the in console / application / cookies
   * http only will be checked
   *
   *
   */

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const res = await login({ email, password }).unwrap()
      //   once we get data back
      dispatch(setCredentials({ ...res }))
      // if redirect then got to shipping if not redirect got to INDEX PAGE

      navigate(redirect)
    } catch (err) {
      // catch the throw errors here
      //? if undefined
      toast.error(err?.data?.message || err.error)
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            autoComplete="true"
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* while id loading then disabled  */}
        <Button disabled={isLoading} type="submit" variant="primary">
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
