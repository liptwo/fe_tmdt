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

const Pannels = () => {
    const [remoteProducts, setRemoteProducts] = useState<PanelProduct[]>([])
    const [error, setError] = useState<string>("")
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)

    const fetchProducts = async (pageNum: number) => {
        setLoading(true)
        try {
            const data = await productsApi.list({ limit: 12, page: pageNum, sortBy: "createdAt", sortOrder: "DESC" })
            
            const mapped: PanelProduct[] = data.products.map((product) => ({
                id: product.id,
                title: product.name,
                image: product.images?.[0] ?? `${prefixImage}aula-f75.webp`,
                originalPrice: Number(product.originalPrice) || Number(product.price),
                price: Number(product.price),
                discount: product.discount || 0,
                sold: product.sold || 0,
                location: product.location || product.category?.name || "Kho tổng",
                rating: product.rating || 0,
                href: `/product?id=${product.id}`,
                tags: [] as TagType[],
            }))

            if (mapped.length < 12) {
                setHasMore(false)
            }

            setRemoteProducts(prev => [...prev, ...mapped])
        } catch (err) {
            console.error("Failed to fetch home products", err)
            setError("Không thể tải danh sách gợi ý.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts(1)
    }, [])

    const handleLoadMore = () => {
        const nextPage = page + 1
        setPage(nextPage)
        fetchProducts(nextPage)
    }

    const products = useMemo(() => remoteProducts, [remoteProducts])

    if (products.length === 0 && !loading) return null

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
            {hasMore && (
                <div className="flex justify-center p-3">
                    <Button 
                        className="rounded-none min-w-[200px]" 
                        onClick={handleLoadMore}
                        disabled={loading}
                    >
                        {loading ? "Đang tải..." : "Xem thêm"}
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Pannels