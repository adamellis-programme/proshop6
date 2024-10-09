import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const SearchBox = () => {
  const navigate = useNavigate()
  const { keyword: urlKeyword } = useParams()
  // pass in the url keyword as default
  const [keyword, setKeyword] = useState(urlKeyword || '')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword) {
      // always naviage to the home page but implementing search
      navigate(`/search/${keyword.trim()}`)
      setKeyword('')
    } else {
      navigate('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q" // q = query
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
