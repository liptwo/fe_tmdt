// ...existing code...
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { Login } from './pages/Login'
import { Checkout } from './pages/Checkout'
import Layout from './layouts'
import Home from './pages/Home'
import User from './pages/user/User'
import DeleteAcc from './pages/user/DeleteAcc'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />

        <Route path='/user/*' element={<User />} />
        <Route path='/cart' />
        <Route path='/account/delete' element={<DeleteAcc />} />
        {/* thêm các route con ở đây */}
      </Route>
      <Route path='checkout' element={<Checkout />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Login />} />


    </Routes>
  )
}

export default App
