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
import DeleteAcc from './pages/user/DeleteAcc'
import SellAndChatApp from './pages/user/Sell'
import FloatingChatBox from './components/ui/FloatingChatBox'
import NotFound from './pages/not-found'
import SearchPage from './pages/Search'

import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import UserManagement from './pages/admin/UserManagement'
function App() {
  return (
    <div className='relative'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order-success' element={<OrderSuccess />} />
          <Route path='/account/delete' element={<DeleteAcc />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/user/*' element={<User />} />
          {/* thêm các route con ở đây */}
          <Route path='checkout' element={<Checkout />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/channel/*' element={<SellAndChatApp />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Login />} />
        
        {/* Admin Routes */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='users' element={<UserManagement />} />
          <Route path='products' element={<ProductManagement />} />
        </Route>
      </Routes>

      <FloatingChatBox />
    </div>
  )
}

export default App
