import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Login } from './pages/Login'
import { Checkout } from './pages/Checkout'
import Layout from './layouts'
import LayoutChat from './layouts/LayoutChat'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import User from './pages/user/User'
import DeleteAcc from './pages/user/DeleteAcc'
import SellAndChatApp from './pages/user/Sell'
import FloatingChatBox from './components/ui/FloatingChatBox'
import NotFound from './pages/not-found'

function App() {
  return (
    <div className='relative'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/cart' />
          <Route path='/account/delete' element={<DeleteAcc />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/user/*' element={<User />} />
          <Route path='/cart' />
          {/* thêm các route con ở đây */}
          <Route path='checkout' element={<Checkout />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/channel/*' element={<SellAndChatApp />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login />} />
      </Routes>

      <FloatingChatBox />
    </div>
  )
}

export default App
