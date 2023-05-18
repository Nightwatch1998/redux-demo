import { 
  createSelector,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
      // 缓存前修改response
      transformResponse: responseData => {
        // 返回范式化结构
        return usersAdapter.setAll(initialState,responseData)
      }
    })
  })
})

export const { useGetUsersQuery } = extendedApiSlice

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()

const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)
// 调用select 会生成一个selector,该selector会返回带参数查询的查询结果对象
// 要为特定查询参数生成 selector，请调用 `select(theQueryArg)`

export default extendedApiSlice.reducer

// 自动生成selector
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)