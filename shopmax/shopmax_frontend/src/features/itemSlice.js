import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createItem, getItems, deleteItem, getItemById, updateItem } from '../api/itemApi'

// 상품등록
export const createItemThunk = createAsyncThunk('items/createItem', async (itemData, { rejectWithValue }) => {
   try {
      const response = await createItem(itemData)
      return response.data.item
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 전체 상품 리스트 가져오기
export const fetchItemsThunk = createAsyncThunk('items/fetchItems', async (data, { rejectWithValue }) => {
   try {
      // data: 검색어, 페이징 처리에 필요한 데이터가 들어있는 객체
      console.log('data: ', data)
      const response = await getItems(data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 상품 삭제
export const deleteItemThunk = createAsyncThunk('items/deleteItem', async (id, { rejectWithValue }) => {
   try {
      await deleteItem(id)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 특정상품 불러오기
export const fetchItemByIdThunk = createAsyncThunk('items/fetchItemById', async (id, { rejectWithValue }) => {
   try {
      const response = await getItemById(id)
      return response.data.item
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

// 상품 수정
export const updateItemThunk = createAsyncThunk('items/updateItem', async (data, { rejectWithValue }) => {
   try {
      console.log('data: ', data)

      const { id, itemData } = data // id: 상품 id, itemData: 수정 데이터가 있는 formData() 객체
      await updateItem(id, itemData)
      return id
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const itemSlice = createSlice({
   name: 'items',
   initialState: {
      item: null, // 상품 단일 정보
      items: [], // 상품리스트
      pagination: null, // 페이징 객체
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 상품 등록
      builder
         .addCase(createItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createItemThunk.fulfilled, (state, action) => {
            state.loading = false
            state.item = action.payload // insert한 상품 정보 저장
         })
         .addCase(createItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 전체 상품 리스트 가져오기
      builder
         .addCase(fetchItemsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchItemsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload.items
            state.pagination = action.payload.pagination
         })
         .addCase(fetchItemsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 상품 삭제
      builder
         .addCase(deleteItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteItemThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(deleteItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 특정 상품 불러오기
      builder
         .addCase(fetchItemByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchItemByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.item = action.payload
         })
         .addCase(fetchItemByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 상품 수정
      builder
         .addCase(updateItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateItemThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(updateItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default itemSlice.reducer
