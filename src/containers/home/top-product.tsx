import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import type { TopProducts } from "@/types"

const TopProduct = () => {
    const prefixImage = "/src/assets/image/top-product/"
    const products: TopProducts[] = [
        { id: 1, title: "Sạc Laptop HP", image: `${prefixImage}sac-laptop-hp.png`, sales: "Bán 1k+ / tháng", href: "/search/sac-laptop-hp" },
        { id: 2, title: "Bàn Phím Giả Cơ", image: `${prefixImage}ban-phim-gia-co.png`, sales: "Bán 17k+ / tháng", href: "/search/ban-phim-gia-co" },
        { id: 3, title: "Tai Nghe Gaming", image: `${prefixImage}tai-nghe-gaming.png`, sales: "Bán 7k+ / tháng", href: "/search/tai-nghe-gaming" },
        { id: 4, title: "Sạc Dự Phòng", image: `${prefixImage}sac-du-phong.png`, sales: "Bán 20k+ / tháng", href: "/search/sac-du-phong" },
        { id: 5, title: "Thảm Trải Sàn", image: `${prefixImage}tham-trai-san.png`, sales: "Bán 9k+ / tháng", href: "/search/tham-trai-san" },
        { id: 6, title: "Bộ Vệ Sinh Laptop", image: `${prefixImage}bo-ve-sinh-laptop.png`, sales: "Bán 2k+ / tháng", href: "/search/bo-ve-sinh-laptop" },
        { id: 7, title: "Khăn Trải Bàn Caro", image: `${prefixImage}khan-trai-ban-caro.png`, sales: "Bán 3k+ / tháng", href: "/search/khan-trai-ban-caro" },
        { id: 8, title: "Áo Thun", image: `${prefixImage}ao-thun.png`, sales: "Bán 50k+ / tháng", href: "/search/ao-thun" },
        { id: 9, title: "Bánh Trứng Tipo", image: `${prefixImage}banh-trung-tipo.png`, sales: "Bán 15k+ / tháng", href: "/search/banh-trung-tipo" },
        { id: 10, title: "Dép Đi Trong Nhà", image: `${prefixImage}dep-di-trong-nha.png`, sales: "Bán 12k+ / tháng", href: "/search/dep-di-trong-nha" },
        { id: 11, title: "Cây Lăn Bụi Quần Áo", image: `${prefixImage}cay-lan-bui-quan-ao.png`, sales: "Bán 6k+ / tháng", href: "/search/cay-lan-bui-quan-ao" },
        { id: 12, title: "Dụng Cụ Lấy Ráy Tai", image: `${prefixImage}dung-cu-lay-ray-tai.png`, sales: "Bán 4k+ / tháng", href: "/search/dung-cu-lay-ray-tai" },
        { id: 13, title: "Bộ Chăn Ga Gối Cotton", image: `${prefixImage}bo-chan-ga-goi-cotton.png`, sales: "Bán 9k+ / tháng", href: "/search/bo-chan-ga-goi-cotton" },
        { id: 14, title: "Dầu Gội Nguyên Xuân", image: `${prefixImage}dau-goi-nguyen-xuan.png`, sales: "Bán 8k+ / tháng", href: "/search/dau-goi-nguyen-xuan" },
        { id: 15, title: "Tinh Dầu Bưởi Cocoon", image: `${prefixImage}tinh-dau-buoi-cocoon.png`, sales: "Bán 7k+ / tháng", href: "/search/tinh-dau-buoi-cocoon" },
        { id: 16, title: "Kem Dưỡng Cerave", image: `${prefixImage}kem-duong-cerave.png`, sales: "Bán 11k+ / tháng", href: "/search/kem-duong-cerave" },
        { id: 17, title: "Cây Lau Kính", image: `${prefixImage}cay-lau-kinh.png`, sales: "Bán 3k+ / tháng", href: "/search/cay-lau-kinh" },
    ]

    return (
        <div className="w-full bg-white mt-5">
            <div className="flex items-center justify-between border-b border-[#efeeef] px-5 py-5">
                <header className="font-medium text-[1rem] text-[#d8593b]">TÌM KIẾM HÀNG ĐẦU</header>
                <Link to="/search/top" className="text-[#d8593b] text-sm hover:underline">Xem Tất Cả &gt;</Link>
            </div>

            <div className="relative px-2 md:px-4 py-4">
                {/* Mobile: horizontal scroll list */}
                <div className="md:hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-1">
                        {products.map((p: TopProducts) => (
                            <Link key={p.id} to={p.href} className="snap-start shrink-0 min-w-[180px] bg-white border border-[#efeeef] rounded-md shadow-sm">
                                <div className="relative p-3">
                                    <div className="absolute top-2 left-2 z-10 w-8 h-8">
                                        <img src="/src/assets/top.png" alt="TOP" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="h-36 flex items-center justify-center">
                                        <img src={p.image} alt={p.title} className="max-h-full object-contain" />
                                    </div>
                                    <div className="w-full bg-black text-white text-xs px-2 py-1 opacity-40 absolute bottom-0 left-0 flex items-center justify-center ">
                                        {p.sales}
                                    </div>
                                </div>
                                <div className="mt-2 text-[16px] text-[#555] line-clamp-2 py-2 px-2">
                                    {p.title}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Desktop: carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: false,
                        slidesToScroll: 2,
                    }}
                    className="w-full hidden md:block"
                >
                    <CarouselContent>
                        {products.map((p: TopProducts) => (
                            <CarouselItem
                                key={p.id}
                                className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/6"
                            >
                                <Link to={p.href} className="group block">
                                    <div className="relative bg-white  hover:shadow-md transition-shadow p-3">
                                        {/* TOP badge */}
                                        <div className="absolute top-2 left-2 z-10 w-8 h-8">
                                            <img src="/src/assets/top.png" alt="TOP" className="w-full h-full object-contain" />
                                        </div>

                                        {/* Image */}
                                        <div className="h-40 sm:h-18 md:h-26 lg:h-32 xl:h-40 flex items-center justify-center ">
                                            <img src={p.image} alt={p.title} className="max-h-full object-contain" />
                                        </div>

                                        {/* Sales ribbon */}
                                        <div className="w-full bg-black text-white text-sm px-2 py-1 opacity-40 absolute bottom-0 left-0 flex items-center justify-center ">
                                            {p.sales}
                                        </div>
                                    </div>
                                    {/* Title */}
                                    <div className="mt-2 text-[18px]  text-[#555] line-clamp-2 py-3">
                                        {p.title}
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex items-center justify-center -left-5 -translate-x-1/2 w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full border border-[#efeeef] bg-white shadow-md z-10 hover:scale-150 transition-all duration-300" />
                    <CarouselNext className="hidden md:flex items-center justify-center -right-5 translate-x-1/2 w-2 h-2 md:w-4 md:h-4 lg:w-6 lg:h-6 rounded-full border border-[#efeeef] bg-white shadow-md z-10 hover:scale-150 transition-all duration-300" />
                </Carousel>
            </div>
        </div>
    )
}
export default TopProduct