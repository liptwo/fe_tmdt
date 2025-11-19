import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Checkout } from './pages/Checkout'
import Layout from './layouts'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import OrderSuccess from './pages/OrderSuccess'
import User from './pages/user/User'
import UserProfile from './pages/user/Profile'
import SellAndChatApp from './pages/user/Sell'
import FloatingChatBox from './components/ui/FloatingChatBox'
import NotFound from './pages/not-found'

function App() {
  return (
    <div className='relative'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/user' element={<User />} />
          <Route path='/user/profile' element={<UserProfile />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/order-success' element={<OrderSuccess />} />
          <Route path='/channel/*' element={<SellAndChatApp />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login />} />
      </Routes>

      <FloatingChatBox />
    </div>
  )
}

export default App
