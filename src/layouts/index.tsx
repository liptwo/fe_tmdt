import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

const Layout = () => {
    return (
        <div className="container mx-auto min-h-screen">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
export default Layout;