import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers',async ()=>{
  const res = await client.get('/fakeApi/users')
  return res.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder){
    builder.addCase(fetchUsers.fulfilled,(state,action)=>{
      // 第二种方式，直接返回一个结果
      return action.payload
    })
  }
})

export default usersSlice.reducer

export const selectAllUsers = state => state.users

export const selectUserById = (state, userId) =>
  state.users.find(user => user.id === userId)