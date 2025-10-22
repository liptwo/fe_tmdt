import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Layout from './layouts'
import Hold from './pages/Hold'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='hold' element={<Hold />} />
      </Route>
    </Routes>
  )
}

export default App
