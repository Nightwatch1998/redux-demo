import { 
  createSlice, 
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'

import { client } from '../../api/client'

const notificationsAdaptor = createEntityAdapter({
  sortComparer:(a,b)=>b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdaptor.getInitialState(),
  reducers: {
    allNotificationsRead(state,action){
      // 此时数据在state.entities中
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })
    }
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      state.push(...action.payload)
      Object.values(state.entities).forEach(notification=>{
        notification.isNew = !notification.read
      })
      notificationsAdaptor.upsertMany(state,action.payload)
    }
  }
})
export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const { selectAll: selectAllNotifications } = 
  notificationsAdaptor.getSelectors(state => state.notifications)