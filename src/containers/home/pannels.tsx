import { useEffect, useMemo, useState } from "react"
import Card from "./card"
import type { TagType } from "./card"
import { Button } from "@/components/ui/button"
import { productsApi } from "@/lib/api"

const prefixImage = "/src/assets/image/pannels/"

type PanelProduct = {
    id: number | string
    title: string
    image: string
    originalPrice: number
    price: number
    discount: number
    sold: number
    location: string
    rating?: number
    href: string
    tags: TagType[]
}

const FALLBACK_PRODUCTS: PanelProduct[] = [
    { id: 1, title: "(NEW) AULA  F75 | S75PRO| Hi75  -Bàn phím cơ không dây  | 3 Mode | Mạch Xuôi| Hotswap | RGB", image: `${prefixImage}aula-f75.webp`, originalPrice: 1200000, price: 599000, discount: 50, sold: 3200, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=1", tags: ["cheap", "commission"] as TagType[] },
    { id: 2, title: "Bộ Dụng Cụ Vệ Sinh Laptop Máy Tính SMTech Bộ Vệ Sinh Bàn Phím Màn Hình Tai Nghe Điện Thoại Nhỏ Gọn", image: `${prefixImage}bo-ve-sinh-laptop.webp`, originalPrice: 150000, price: 69000, discount: 54, sold: 8900, location: "Hà Nội", rating: 4.7, href: "/product?id=2", tags: ["flash", "cheap"] as TagType[] },
    { id: 3, title: "🔥 SOFA BED THÔNG MINH DINO, GHẾ SOFA GIƯỜNG GẤP GỌN – GIẢI PHÁP HOÀN HẢO CHO KHÔNG GIAN SỐNG! 🔥", image: `${prefixImage}sofa-bed.webp`, originalPrice: 3500000, price: 1899000, discount: 46, sold: 1200, location: "Hà Nội", rating: 4.9, href: "/product?id=3", tags: ["commission"] as TagType[] },
    { id: 4, title: "Áo khoác phao unisex lót lông cừu⚡𝐇𝐚̀𝐧𝐠 𝐂𝐚̂́𝐩⚡thêu chữ CELEMEN'S Nam nữ dều mặc dược, dày dặn siêu ấm", image: `${prefixImage}ao-khoac-phao.webp`, originalPrice: 450000, price: 199000, discount: 56, sold: 15200, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=4", tags: ["flash"] as TagType[] },
    { id: 5, title: "Đồng Hồ Thông Minh HUAWEI WATCH GT6 Series | Tập Luyện Nâng Cao | Theo Dõi Sức Khỏe Toàn Diện | Pin Đến 21 Ngày", image: `${prefixImage}huawei-watch-gt6.webp`, originalPrice: 8000000, price: 5999000, discount: 25, sold: 890, location: "Hà Nội", rating: 4.9, href: "/product?id=5", tags: ["commission"] as TagType[] },
    { id: 6, title: "Thảm lót bàn PU chống thấm nước chống trầy xước bảo vệ mắt nhiều kích thước nhiều màu sắc", image: `${prefixImage}tham-lot-ban.webp`, originalPrice: 200000, price: 79000, discount: 61, sold: 6700, location: "Đà Nẵng", rating: 4.6, href: "/product?id=6", tags: ["cheap"] as TagType[] },
    { id: 7, title: "Ổ Cắm Điện Đa Năng Tích Hợp Cổng USB 5V Chịu Tải 2500W Cắm Mọi Thiết Bị Dây Dài 2.5M", image: `${prefixImage}o-cam-dien.webp`, originalPrice: 250000, price: 99000, discount: 60, sold: 12500, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=7", tags: ["flash"] as TagType[] },
    { id: 8, title: "NỆM TOPPER TRẢI SÀN, ĐỆM TOPPER HÀNG XUẤT NHẬT DÀY ÊM ÁI GỌN NHẸ", image: `${prefixImage}nem-topper.webp`, originalPrice: 800000, price: 399000, discount: 50, sold: 2400, location: "Hà Nội", rating: 4.7, href: "/product?id=8", tags: ["commission"] as TagType[] },
    { id: 9, title: "Bàn phím cơ không dây AULA F75 - Hỗ trợ hotswap - LED RGB nhiều chế dộ - 3 mode kết nối tiện lợi", image: `${prefixImage}ban-phim-aula.webp`, originalPrice: 1100000, price: 549000, discount: 50, sold: 4100, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=9", tags: ["cheap"] as TagType[] },
    { id: 10, title: "Áo Mưa (Giá sỉ, Cao Cấp, Nhiều màu tùy chọn) vải tổ ong cao cấp vải dù không thấm nước", image: `${prefixImage}ao-mua.webp`, originalPrice: 150000, price: 45000, discount: 70, sold: 18900, location: "Hải Phòng", rating: 4.6, href: "/product?id=10", tags: ["flash", "cheap"] as TagType[] },
    { id: 11, title: "(NEW) AULA  F75 | S75PRO| Hi75  -Bàn phím cơ không dây  | 3 Mode | Mạch Xuôi| Hotswap | RGB", image: `${prefixImage}aula-f75.webp`, originalPrice: 1200000, price: 599000, discount: 50, sold: 3200, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=1", tags: ["cheap", "commission"] as TagType[] },
    { id: 12, title: "Bộ Dụng Cụ Vệ Sinh Laptop Máy Tính SMTech Bộ Vệ Sinh Bàn Phím Màn Hình Tai Nghe Điện Thoại Nhỏ Gọn", image: `${prefixImage}bo-ve-sinh-laptop.webp`, originalPrice: 150000, price: 69000, discount: 54, sold: 8900, location: "Hà Nội", rating: 4.7, href: "/product?id=2", tags: ["flash", "cheap"] as TagType[] },
    { id: 13, title: "🔥 SOFA BED THÔNG MINH DINO, GHẾ SOFA GIƯỜNG GẤP GỌN – GIẢI PHÁP HOÀN HẢO CHO KHÔNG GIAN SỐNG! 🔥", image: `${prefixImage}sofa-bed.webp`, originalPrice: 3500000, price: 1899000, discount: 46, sold: 1200, location: "Hà Nội", rating: 4.9, href: "/product?id=3", tags: ["commission"] as TagType[] },
    { id: 14, title: "Áo khoác phao unisex lót lông cừu⚡𝐇𝐚̀𝐧𝐠 𝐂𝐚̂́𝐩⚡thêu chữ CELEMEN'S Nam nữ dều mặc dược, dày dặn siêu ấm", image: `${prefixImage}ao-khoac-phao.webp`, originalPrice: 450000, price: 199000, discount: 56, sold: 15200, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=4", tags: ["flash"] as TagType[] },
    { id: 15, title: "Đồng Hồ Thông Minh HUAWEI WATCH GT6 Series | Tập Luyện Nâng Cao | Theo Dõi Sức Khỏe Toàn Diện | Pin Đến 21 Ngày", image: `${prefixImage}huawei-watch-gt6.webp`, originalPrice: 8000000, price: 5999000, discount: 25, sold: 890, location: "Hà Nội", rating: 4.9, href: "/product?id=5", tags: ["commission"] as TagType[] },
    { id: 16, title: "Thảm lót bàn PU chống thấm nước chống trầy xước bảo vệ mắt nhiều kích thước nhiều màu sắc", image: `${prefixImage}tham-lot-ban.webp`, originalPrice: 200000, price: 79000, discount: 61, sold: 6700, location: "Đà Nẵng", rating: 4.6, href: "/product?id=6", tags: ["cheap"] as TagType[] },
    { id: 17, title: "Ổ Cắm Điện Đa Năng Tích Hợp Cổng USB 5V Chịu Tải 2500W Cắm Mọi Thiết Bị Dây Dài 2.5M", image: `${prefixImage}o-cam-dien.webp`, originalPrice: 250000, price: 99000, discount: 60, sold: 12500, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=7", tags: ["flash"] as TagType[] },
    { id: 18, title: "NỆM TOPPER TRẢI SÀN, ĐỆM TOPPER HÀNG XUẤT NHẬT DÀY ÊM ÁI GỌN NHẸ", image: `${prefixImage}nem-topper.webp`, originalPrice: 800000, price: 399000, discount: 50, sold: 2400, location: "Hà Nội", rating: 4.7, href: "/product?id=8", tags: ["commission"] as TagType[] },
    { id: 19, title: "Bàn phím cơ không dây AULA F75 - Hỗ trợ hotswap - LED RGB nhiều chế dộ - 3 mode kết nối tiện lợi", image: `${prefixImage}ban-phim-aula.webp`, originalPrice: 1100000, price: 549000, discount: 50, sold: 4100, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=9", tags: ["cheap"] as TagType[] },
    { id: 20, title: "Áo Mưa (Giá sỉ, Cao Cấp, Nhiều màu tùy chọn) vải tổ ong cao cấp vải dù không thấm nước", image: `${prefixImage}ao-mua.webp`, originalPrice: 150000, price: 45000, discount: 70, sold: 18900, location: "Hải Phòng", rating: 4.6, href: "/product?id=10", tags: ["flash", "cheap"] as TagType[] },
    { id: 21, title: "Ổ Cắm Điện Đa Năng Tích Hợp Cổng USB 5V Chịu Tải 2500W Cắm Mọi Thiết Bị Dây Dài 2.5M", image: `${prefixImage}o-cam-dien.webp`, originalPrice: 250000, price: 99000, discount: 60, sold: 12500, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=7", tags: ["flash"] as TagType[] },
    { id: 22, title: "NỆM TOPPER TRẢI SÀN, ĐỆM TOPPER HÀNG XUẤT NHẬT DÀY ÊM ÁI GỌN NHẸ", image: `${prefixImage}nem-topper.webp`, originalPrice: 800000, price: 399000, discount: 50, sold: 2400, location: "Hà Nội", rating: 4.7, href: "/product?id=8", tags: ["commission"] as TagType[] },
    { id: 23, title: "Bàn phím cơ không dây AULA F75 - Hỗ trợ hotswap - LED RGB nhiều chế dộ - 3 mode kết nối tiện lợi", image: `${prefixImage}ban-phim-aula.webp`, originalPrice: 1100000, price: 549000, discount: 50, sold: 4100, location: "TP. Hồ Chí Minh", rating: 4.8, href: "/product?id=9", tags: ["cheap"] as TagType[] },
    { id: 24, title: "Áo Mưa (Giá sỉ, Cao Cấp, Nhiều màu tùy chọn) vải tổ ong cao cấp vải dù không thấm nước", image: `${prefixImage}ao-mua.webp`, originalPrice: 150000, price: 45000, discount: 70, sold: 18900, location: "Hải Phòng", rating: 4.6, href: "/product?id=10", tags: ["flash", "cheap"] as TagType[] },
]

const Pannels = () => {
    const [remoteProducts, setRemoteProducts] = useState<PanelProduct[]>([])
    const [error, setError] = useState<string>("")

    useEffect(() => {
        let isMounted = true
        const fetchProducts = async () => {
            try {
                const data = await productsApi.list({ limit: 24, sortBy: "createdAt", sortOrder: "DESC" })
                if (!isMounted) return
                const mapped: PanelProduct[] = data.products.map((product) => ({
                    id: product.id,
                    title: product.name,
                    image: product.images?.[0] ?? `${prefixImage}aula-f75.webp`,
                    originalPrice: Number(product.price),
                    price: Number(product.price),
                    discount: 0,
                    sold: product.stock,
                    location: product.category?.name ?? "Kho tổng",
                    rating: undefined,
                    href: `/product?id=${product.id}`,
                    tags: [] as TagType[],
                }))
                setRemoteProducts(mapped)
            } catch (err) {
                console.error("Failed to fetch home products", err)
                if (isMounted) {
                    setError("Không thể tải danh sách gợi ý. Đang hiển thị dữ liệu mẫu.")
                }
            }
        }

    fetchProducts()
        return () => {
            isMounted = false
        }
    }, [])

    const products = useMemo(() => (remoteProducts.length > 0 ? remoteProducts : FALLBACK_PRODUCTS), [remoteProducts])

    return (
        <div className="w-full mt-10 mb-15">
            <header className="sticky top-0 z-30 bg-white font-medium text-[1rem] text-center py-4 px-4 text-[#df513b] border-b-4 border-[#df513b]">GỢI Ý HÔM NAY</header>
            {error && <p className="text-center text-xs text-red-500 mt-2">{error}</p>}
            <div className="relative p-2">
                {/* Mobile: horizontal scroll */}
                <div className="md:hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2">
                        {products.map((product) => (
                            <div key={product.id} className="snap-start shrink-0 w-[160px]">
                                <Card {...product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop: grid */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                    {products.map((product) => (
                        <Card key={product.id} {...product} />
                    ))}
                </div>
            </div>
            <div className="flex justify-center p-3">
                <Button className="rounded-none">Xem thêm</Button>
            </div>
        </div>
    )
}

export default Pannels