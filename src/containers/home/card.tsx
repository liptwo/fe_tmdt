import { Link } from "react-router-dom"
import { Tag } from "@/components/tag/tag"

type TagType = "cheap" | "commission" | "flash"

interface CardProps {
    id: number
    title: string
    image: string
    originalPrice: number
    price: number
    discount: number
    sold: number
    rating?: number
    href: string
    tags?: TagType[]
}

const Card = ({ title, image, originalPrice, price, discount, sold, rating, href, tags }: CardProps) => {
    return (
        <Link to={href} className="block bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-[#00000017] overflow-hidden">
            {/* Image */}
            <div className="relative aspect-square bg-[#f5f5f5]">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                {discount > 0 && (
                    <div className="absolute top-0 right-0 bg-[#fdeeea] text-[#ee4d2d] text-xs  px-1 py-0.5">
                        -{discount}%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-2">

                {/* Title */}
                <h3 className="text-sm text-[#212121] line-clamp-2 min-h-[40px] mb-1">
                    {title}
                </h3>
                {/* Tags */}
                {tags && tags.length > 0 && (
                    <div className="relative flex items-center gap-1 mb-1 flex-nowrap overflow-hidden">
                        {tags.map((tagType, idx) => (
                            <Tag key={idx} type={tagType} />
                        ))}
                    </div>
                )}


                {/* Price */}
                <div className="flex items-center gap-2 mb-1">
                    {originalPrice && originalPrice > price && (
                        <span className="text-xs text-[#757575] line-through">
                            ₫{originalPrice.toLocaleString()}
                        </span>
                    )}
                    <span className="text-base text-[#ee4d2d] font-medium">
                        ₫{price.toLocaleString()}
                    </span>
                </div>

                {/* Rating & Sold */}
                <div className="flex items-center justify-between text-xs text-[#767676] mb-1">
                    {rating && rating > 0 && (
                        <div className="flex items-center gap-1">
                            <span className="text-[#ffce3d]">★</span>
                            <span>{rating.toFixed(1)}</span>
                        </div>
                    )}
                    <span>Đã bán {sold >= 1000 ? `${(sold / 1000).toFixed(1)}k` : sold}</span>
                </div>


            </div>
        </Link>
    )
}

export default Card