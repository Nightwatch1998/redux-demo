import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { fetchNotifications } from '../features/notifications/notificationsSlice'

export const Navbar = () => {
  const dispatch = useDispatch()

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications())
  }

  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/">文章</Link>
            <Link to="/users">用户</Link>
            <Link to="/notifications">通知</Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            刷新通知
          </button>
        </div>
      </section>
    </nav>
  )
}
