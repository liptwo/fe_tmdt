import { Outlet } from 'react-router-dom'
import Header from './header'
import Footer from './footer'

const Layout = () => {
  return (
    <div className='flex flex-col  justify-center items-center'>
      <Header />
      <div className='container items-center justify-center flex'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
export default Layout
