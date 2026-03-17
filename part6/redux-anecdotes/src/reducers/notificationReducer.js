import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return null
    }
  }
})

export const { showNotification, clearNotification } = notificationSlice.actions

let timeoutId = null

export const setNotification = (message, seconds = 5) => {
  return (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    dispatch(showNotification(message))
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
