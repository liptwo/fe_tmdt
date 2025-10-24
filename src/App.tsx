import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/home'
import { Login } from './pages/Login'
import { Checkout } from './pages/Checkout'
import Layout from './layouts'

function App() {
  return (
    <Routes>
<!--       <Route path='/' element={<Home />} /> -->
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Login />} />
      <Route path='/cart' />
      <Route path='/checkout' element={<Checkout />} />
      <!-- <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
         <Route path='hold' element={<Hold />} /> 
      </Route> -->
    </Routes>
  )
}

export default App
