import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
// import { fetchUsers } from './features/users/usersSlice'
import { worker } from './api/server'
import { extendedApiSlice } from './features/users/usersSlice'

// Wrap app rendering so we can wait for the mock API to initialize
async function start() {
  // Start our mock API server
  await worker.start({ onUnhandledRequest: 'bypass' })
  // 一般在query hooks内自动发生,这里手动调用
  store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())
  
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}

start()
