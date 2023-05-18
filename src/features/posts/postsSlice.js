import { 
  createSlice, 
  createAsyncThunk, 
  createSelector,
  createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})

// 返回空的{ids: [], entities: {}} 范式化对象
const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null
})

// 异步请求的函数
export const fetchPosts = createAsyncThunk('posts/fetchPosts',async ()=>{
  const response = await client.get('/fakeApi/posts')
  return response.data
})

// 发送数据到后台
export const addNewPost = createAsyncThunk('posts/addNewPost',async initialPost =>{
  const res = await client.post('/fakeApi/posts',initialPost)
  return res.data
})

const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers: {
      reactionAdded(state,action){
        const { postId, reaction} = action.payload
        const existingPost = state.entities[postId]
        if(existingPost){
          existingPost.reactions[reaction]++
        }
      },
      postUpdated(state,action){
        const { id, title, content } = action.payload
        const existingPost = state.entities[id]
        if(existingPost){
          existingPost.title = title
          existingPost.content = content
        }
      }
    },
    extraReducers(builder){
      builder
        .addCase(fetchPosts.pending,(state, action)=>{
          // 请求开始时
          state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled,(state, action)=>{
          // 请求成功
          state.status = 'succeeded'
          postsAdapter.upsertMany(state,action.payload)
        })
        .addCase(fetchPosts.rejected,(state, action)=>{
          // 请求失败
          state.status = 'falied'
          state.error = action.error.message
        })
        .addCase(addNewPost.fulfilled,(state,action)=>{
          // 向服务器发送之后，添加到现有的列表中
          postsAdapter.addOne(state,action.payload)
        })
    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
export default postsSlice.reducer

// 自动生成selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
)