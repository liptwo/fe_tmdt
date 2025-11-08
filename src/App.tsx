// ...existing code...
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { Login } from "./pages/Login";
import { Checkout } from "./pages/Checkout";
import Layout from "./layouts";
import LayoutChat from "./layouts/LayoutChat";
import Home from "./pages/Home";
import User from "./pages/user/User";
import SellAndChatApp from "./pages/user/Sell";

import FloatingChatBox from "./components/ui/FloatingChatBox";

function App() {
  return (
    <div className="relative">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/cart" />
          {/* thêm các route con ở đây */}
        </Route>

        <Route path="/channel/*" element={<SellAndChatApp />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />
      </Routes>

      {/* Floating Chat hiển thị ở mọi trang */}
      <FloatingChatBox />
    </div>
  );
}

export default App;
