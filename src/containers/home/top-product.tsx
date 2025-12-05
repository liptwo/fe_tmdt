import { useEffect, useMemo, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import type { TopProducts } from "@/types"
import { productsApi } from "@/lib/api"

const prefixImage = "/src/assets/image/top-product/"

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value))

const TopProduct = () => {
    const [remoteProducts, setRemoteProducts] = useState<TopProducts[]>([])

    useEffect(() => {
        let isMounted = true
        const fetchProducts = async () => {
            try {
                const data = await productsApi.list({ limit: 12, sortBy: "createdAt", sortOrder: "DESC" })
                if (!isMounted) return
                const mapped: TopProducts[] = data.products.map((product) => ({
                    id: product.id,
                    title: product.name,
                    image: product.images?.[0] ?? `${prefixImage}sac-laptop-hp.png`,
                    sales: formatCurrency(product.price),
                    href: `/product?id=${product.id}`,
                }))
                setRemoteProducts(mapped)
            } catch (error) {
                console.error("Failed to fetch products", error)
            }
        }

        fetchProducts()
        return () => {
            isMounted = false
        }
    }, [])

    const products = useMemo(() => remoteProducts, [remoteProducts])

    if (products.length === 0) return null

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