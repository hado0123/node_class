import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { followUser } from '../api/snsApi'

// 팔로우
export const followUserThunk = createAsyncThunk('user/followUser', async (id, { rejectWithValue }) => {
   try {
      const response = await followUser(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '팔로우 실패')
   }
})

const userSlice = createSlice({
   name: 'user',
   initialState: {
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      //팔로우
      builder
         .addCase(followUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(followUserThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(followUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default userSlice.reducer
