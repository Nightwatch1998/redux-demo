// 从特定于 React 的入口点导入 RTK Query 方法
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// 定义我们的单个 API Slice 对象
export const apiSlice = createApi({
  // 缓存减速器预计将添加到 `state.api` （已经默认 - 这是可选的）
  reducerPath: 'api',
  // 我们所有的请求都有以 “/fakeApi” 开头的 URL
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  // 定义标签列表
  tagTypes: ['Post'],
  // “endpoints” 代表对该服务器的操作和请求
  endpoints: builder => ({
    // `getPosts` endpoint 是一个返回数据的 “Query” 操作
    getPosts: builder.query({
      // 请求的 URL 是“/fakeApi/posts”
      query: () => '/posts',
      // 添加帖子后重新获取,可以是数组，也可以是回调
      providesTags: (result = [], error, arg)=>[
        'Post',
        ...result.map(({id})=>({type:'Post',id}))
      ]
    }),
    getPost: builder.query({
      query: postId => `/posts/${postId}`,
      // 单个对象tag
      providesTags: (result, error, arg) => [{type: 'Post', id: arg}]
    }),
    // post 操作
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: initialPost
      }),
      // 每次运行后失效的标签,之后自动获取整个列表
      invalidatesTags: ['Post']
    }),
    // 更新帖子
    editPost: builder.mutation({
      query: post => ({
        url: `/posts/${post.id}`,
        method: 'PATCH',
        body: post
      }),
      invalidatesTags:(result, error, arg)=>[{type:'Post',id: arg.id}]
    }),
    // 添加交互
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `posts/${postId}/reactions`,
        method: 'POST',
        // 在一个真实的应用程序中，我们可能需要以某种方式基于用户 ID
        // 这样用户就不能多次做出相同的反应
        body: { reaction }
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        // `updateQueryData` 需要请求接口名称和缓存键参数，
        // 所以它知道要更新哪一块缓存状态
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, draft => {
            // `draft` 是 Immer-wrapped 的，可以像 createSlice 中一样 “mutated”
            const post = draft.find(post => post.id === postId)
            if (post) {
              post.reactions[reaction]++
            }
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    })
  })
})

// 为 `getPosts` Query endpoint 导出自动生成的 hooks
export const { 
  useGetPostsQuery, 
  useGetPostQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation
} = apiSlice