// parent to the other api slices

/**
 * createSlice for non async we are working with createApi as backend
 * fetchBase will allow us to make request
 * tag types are uses to define the types of data we fetch from the api
 *
 */
// ALL OTHER SLICES ARE CHILDREN OF THIS MAIN API SLICE
// THIS IS DIFFRENT TO A REGULAR SLICE
import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL })

// endpoints directly or injected from a seperate file
// this apiSlice is connected to the STORE
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  // we are INJECTION endpoints
  // instead of writting them here
  // thats why we bring parent into the children
  endpoints: (builder) => ({}),
})
