// nothing to do with api calls
import { createSlice } from '@reduxjs/toolkit'

// fisrt check to see if there is a user in local storage
const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload
      // stringify the usr an pass it in
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },

    logout: (state, action) => {
      state.userInfo = null
      // clear local storage on logout
      localStorage.clear()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

// add to the store
// we do not add products and users api to the slice
// is they are childs of the api slice
export default authSlice.reducer
