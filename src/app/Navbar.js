import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { 
  fetchNotifications,
  selectAllNotifications
} from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const numUnreadNotifications = notifications.filter(n=>!n.read).length
  const fetchNewNotifications = () => {
    dispatch(fetchNotifications())
  }

  let unreadNotificationsBadge
  if(numUnreadNotifications > 0){
    unreadNotificationsBadge = (
      <span className='badge'>{numUnreadNotifications}</span>
    )
  }
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">文章</Link>
            <Link to="/users">用户</Link>
            <Link to="/notifications">
              通知 {unreadNotificationsBadge}
            </Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            刷新通知
          </button>
        </div>
      </section>
    </nav>
  )
}
