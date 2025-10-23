import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/home'
import { Login } from './pages/Login'
import { Checkout } from './pages/Checkout'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Login />} />
      <Route path='/cart' />
      <Route path='/checkout' element={<Checkout />} />
    </Routes>
  )
}

export default App
