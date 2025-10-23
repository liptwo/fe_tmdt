import { Bell, FacebookIcon, GlobeIcon, HelpCircleIcon, Instagram, User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import type { NavTopNavItem } from "@/types";
import type { notifications } from "@/types";
import { useState } from "react";
import Logo from "@/components/icons/Logo";
import { SearchBar } from "@/layouts/search-bar";
import { useMobile } from "@/hooks/useMobile";

const navTopNavItemsLeft: NavTopNavItem[] = [

    {
        name: 'Kênh Người Bán',
        to: '/channel'
    },
    {
        name: 'Tải ứng dụng',
        to: '/download'
    }
]

const navTopNavItemsRight: NavTopNavItem[] = [

    {
        name: 'Hỗ Trợ',
        to: '/support',
        icon: <HelpCircleIcon size={18} />
    },
    {
        name: 'Tiếng Việt',
        icon: <GlobeIcon size={18} />
    },
    {
        name: 'Kaito',
        icon: <User size={18} />,
        to: '/user/profile'
    }
]

const notifications: notifications[] = [
    {
        id: 1,
        title: 'Thông Báo',
        description: 'Thông Báo',
        image: 'public/images/notifications/notification-1.jpg'

    },
    {
        id: 2,
        title: 'Thông Báo',
        description: 'Thông Báo',
        image: 'public/images/notifications/notification-3.jpg',
        link: 'https://www.facebook.com/'
    },

]
const Header = () => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});
    const isMobile = useMobile();

    const setDropdownOpen = (name: string, isOpen: boolean) => {
        setDropdownStates(prev => ({ ...prev, [name]: isOpen }));
    };
    return (
        <div className="flex flex-col justify-center py-2 px-1.5 md:py-1 md:px-4 md:10 lg:px-20 xl:px-40" style={{ background: 'var(--header-background)' }}>
            <div className=" justify-between text-[13px] p-1 hidden md:flex">
                <nav className="flex items-center ">
                    <div className="flex gap-3">
                        {navTopNavItemsLeft.map((item) => (
                            <Link className="border-r border-white/30 pr-3 text-white hover:text-orange-100 transition-colors font-light" key={item.name} to={item.to ?? ''}>{item.name}</Link>
                        ))}
                        <div className="flex items-center gap-2">
                            <span className="font-light text-white">Kết nối</span>
                            <Link to="https://www.facebook.com/" className="transition-colors text-red-500 flex items-center justify-center w-5 h-5  rounded-full bg-white border border-white/30" aria-label="Facebook">
                                <FacebookIcon size={12} />
                            </Link>
                            <Link to="https://www.instagram.com/" className="transition-colors text-red-500 flex items-center justify-center w-5 h-5  rounded-full bg-white border border-white/30" aria-label="Instagram">
                                <Instagram size={12} />
                            </Link>
                        </div>
                    </div>

                </nav>

                <nav className="flex gap-2 items-center">
                    <div className="relative">
                        <div
                            className="hover:text-header-hover transition-colors cursor-pointer flex items-center gap-2 text-white py-2"
                            aria-label="Notifications"
                            onMouseEnter={() => setNotificationsOpen(true)}
                            onMouseLeave={() => setNotificationsOpen(false)}
                        >
                            <Bell size={18} />
                            <span className="font-light">Thông Báo</span>

                        </div>

                        {notificationsOpen && (
                            <div
                                className="absolute right-0 mt-1 w-96 bg-white text-gray-900  shadow-lg z-50"
                                onMouseEnter={() => setNotificationsOpen(true)}
                                onMouseLeave={() => setNotificationsOpen(false)}
                            >
                                <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                                <div className=" text-white px-4 flex items-center gap-2">
                                    <Bell size={18} />
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    <div className="py-2 border-b border-gray-200">
                                        <p className="text-gray-500 font-medium">Thông Báo Mới Nhân</p>
                                    </div>

                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4  border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex gap-3">
                                                <img
                                                    src={notification.image || "/placeholder.svg"}
                                                    alt=""
                                                    className="w-12 h-12 rounded shrink-0 bg-gray-200"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 line-clamp-2">{notification.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="px-4 py-3 text-center border-t border-gray-200">
                                    <a href="#" className="text-orange-500 font-medium hover:text-orange-600">
                                        Xem tất cả
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    {navTopNavItemsRight.map((item) => (
                        item.name === 'Hỗ Trợ' ? (
                            <Link key={item.name} className="pr-4 flex gap-2 items-center text-white hover:text-header-hover transition-colors font-light" to={item.to ?? ''}>
                                {item.icon ?? ''}{item.name}
                            </Link>
                        ) : (
                            <div key={item.name} className="relative">
                                <div
                                    className="pr-4 flex gap-2 items-center text-white hover:text-header-hover transition-colors cursor-pointer font-light"
                                    onMouseEnter={() => setDropdownOpen(item.name, true)}
                                    onMouseLeave={() => setDropdownOpen(item.name, false)}
                                >
                                    {item.icon ?? ''}{item.name}
                                </div>

                                {dropdownStates[item.name] && (
                                    <div
                                        className="absolute left-0 top-full mt-1 w-48 bg-white text-gray-900 shadow-lg z-50"
                                        onMouseEnter={() => setDropdownOpen(item.name, true)}
                                        onMouseLeave={() => setDropdownOpen(item.name, false)}
                                    >
                                        {/* Triangle arrow pointing up */}
                                        <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                                        <div className="py-1">
                                            {item.name === 'Tiếng Việt' ? (
                                                <>
                                                    <div className="block px-4 py-2 hover:bg-gray-100 rounded cursor-pointer font-medium">Tiếng Việt</div>
                                                    <div className="block px-4 py-2 hover:bg-gray-100 rounded cursor-pointer font-medium">English</div>
                                                    <div className="block px-4 py-2 hover:bg-gray-100 rounded cursor-pointer font-medium">中文</div>
                                                </>
                                            ) : item.name === 'Kaito' ? (
                                                <>
                                                    <Link to="/user/profile" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Thông tin cá nhân</Link>
                                                    <Link to="/user/orders" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Đơn hàng của tôi</Link>
                                                    <Link to="/user/favorites" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Sản phẩm yêu thích</Link>
                                                    <Link to="/user/settings" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Cài đặt tài khoản</Link>
                                                    <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Đăng xuất</Link>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    ))}

                </nav>

            </div>
            <div className="flex items-center">
                <Logo className="text-[#fffeff] mr-12 hidden md:block" />
                <div className={`${isMobile ? 'flex-2' : 'flex-1'}`}>
                    <SearchBar />
                </div>

                {/* Mobile: Shopping Cart */}
                {isMobile && (
                    <div className="relative flex-1 flex justify-center">
                        <div
                            className="flex items-center justify-center text-white hover:text-header-hover transition-colors duration-200 p-3 cursor-pointer"
                            onMouseEnter={() => setCartOpen(true)}
                            onMouseLeave={() => setCartOpen(false)}
                        >
                            <ShoppingCart size={20} />
                        </div>
                        {cartOpen && (
                            <div
                                className="absolute right-0 mt-1 w-80 bg-white text-gray-900 shadow-lg z-50 rounded-lg"
                                onMouseEnter={() => setCartOpen(true)}
                                onMouseLeave={() => setCartOpen(false)}
                            >
                                <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                                <div className="p-4">
                                    <div className="text-center py-8">
                                        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 font-medium">Chưa có sản phẩm nào</p>
                                        <p className="text-sm text-gray-400 mt-1">Hãy thêm sản phẩm vào giỏ hàng</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile: User icon */}
                {isMobile && (
                    <div className="relative flex-1 flex justify-center">
                        <div
                            className="flex items-center justify-center text-white hover:text-header-hover transition-colors duration-200 cursor-pointer"
                            onMouseEnter={() => setDropdownOpen('Kaito', true)}
                            onMouseLeave={() => setDropdownOpen('Kaito', false)}
                        >
                            <User size={20} />
                        </div>
                        {dropdownStates['Kaito'] && (
                            <div
                                className="absolute right-0 mt-1 w-48 bg-white text-gray-900 shadow-lg z-50 rounded-lg"
                                onMouseEnter={() => setDropdownOpen('Kaito', true)}
                                onMouseLeave={() => setDropdownOpen('Kaito', false)}
                            >
                                <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>
                                <div className="py-1">
                                    <Link to="/user/profile" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Thông tin cá nhân</Link>
                                    <Link to="/user/orders" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Đơn hàng của tôi</Link>
                                    <Link to="/user/favorites" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Sản phẩm yêu thích</Link>
                                    <Link to="/user/settings" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Cài đặt tài khoản</Link>
                                    <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100 rounded font-medium">Đăng xuất</Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Desktop: Shopping Cart */}
                {!isMobile && (
                    <div className="relative">
                        <div
                            className="flex items-center justify-center text-white hover:text-header-hover transition-colors duration-200 md:py-7 md:px-15 cursor-pointer"
                            onMouseEnter={() => setCartOpen(true)}
                            onMouseLeave={() => setCartOpen(false)}
                        >
                            <ShoppingCart size={26} />
                        </div>

                        {cartOpen && (
                            <div
                                className="absolute right-1/4 -mt-5 w-80 bg-white text-gray-900 shadow-lg z-50 rounded-lg"
                                onMouseEnter={() => setCartOpen(true)}
                                onMouseLeave={() => setCartOpen(false)}
                            >
                                {/* Triangle arrow pointing up */}
                                <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"></div>

                                <div className="p-4">
                                    <div className="text-center py-8">
                                        <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 font-medium">Chưa có sản phẩm nào</p>
                                        <p className="text-sm text-gray-400 mt-1">Hãy thêm sản phẩm vào giỏ hàng</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}
export default Header;