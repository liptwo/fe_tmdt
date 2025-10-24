// ...existing code...
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { Login } from './pages/Login'
import { Checkout } from './pages/Checkout'
import Layout from './layouts'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='checkout' element={<Checkout />} />
        {/* thêm các route con ở đây */}
      </Route>

      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Login />} />
      <Route path='/cart' />
    </Routes>
  )
}

export default App
