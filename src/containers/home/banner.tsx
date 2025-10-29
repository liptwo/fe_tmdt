import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import BannerImage from "@/assets/image/banner/banner.png"
import type { FeatBanner } from "@/types"
import { Link } from "react-router-dom"

const Banner = () => {

    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    )
    const images: string[] = [
        BannerImage,
        BannerImage,
        BannerImage,
        BannerImage,
        BannerImage,
    ]

    console.log(BannerImage)

    const renderTitleAfterFourWords = (title: string) => {
        const words = title.trim().split(/\s+/)
        const firstLine = words.slice(0, 4).join(" ")
        const secondLine = words.slice(4).join(" ")
        return (
            <>
                <span className="block">{firstLine}</span>
                {secondLine && (
                    <span className="block truncate">{secondLine}</span>
                )}
            </>
        )
    }

    const featBanners: FeatBanner[] = [
        {
            href: "/",
            image: "/src/assets/image/feat/sieu-re.png",
            title: "Deal từ 1.000Đ",
        },
        {
            href: "/",
            image: "/src/assets/image/feat/xu-ly.png",
            title: "Shopee Xử Lý",

        },
        {
            href: "/",
            image: "/src/assets/image/feat/flash_sale.png",
            title: "Deal Hot Giờ Vàng",

        },
        {
            href: "/",
            image: "/src/assets/image/feat/shopee_style.png",
            title: "Shopee Style Voucher 30%",

        },
        {
            href: "/",
            image: "/src/assets/image/feat/giaithuong.png",
            title: "Săn Ngay 100.000 Xu",

        },
        {
            href: "/",
            image: "/src/assets/image/feat/uu-dai.png",
            title: "Khách Hàng Thân Thiết",

        },
        {
            href: "/",
            image: "/src/assets/image/feat/ma-giam-gia.png",
            title: "Mã Giảm Giá",

        },
    ]


    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className='hidden md:flex justify-center items-center w-full '>
                <Carousel
                    className="flex-2 "
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}>
                    <CarouselContent>
                        {images.map((src, index) => (
                            <CarouselItem key={index} className="h-full">
                                <Card className="h-full">
                                    <CardContent className="p-0 h-full">
                                        <img src={src} alt={`banner-${index + 1}`} className="w-full h-full" />
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                </Carousel>
                <div className="flex flex-col flex-1 justify-between items-center ml-[5px] gap-1 w-[35%]">
                    <img src={BannerImage} alt="banner" className="w-full object-cover" />
                    <img src={BannerImage} alt="banner" className="w-full object-cover " />
                </div>
            </div>
            <div className="w-full md:max-w-[1200px] md:mx-auto mt-[18px] mb-0 md:px-4 overflow-x-auto md:overflow-x-visible pb-2">
                <div className="flex md:justify-around gap-4 px-4 w-max md:w-full">
                    {featBanners.map((featBanner, index) => (
                        <Link
                            to={featBanner.href}
                            key={index}
                            className="flex flex-col items-center justify-start  w-[150px] "
                        >
                            <img src={featBanner.image} alt={featBanner.title} className="w-10 h-10  md:w-11 md:h-11 mb-2 object-contain" />
                            <p className="text-[13px] text-center leading-4">
                                {renderTitleAfterFourWords(featBanner.title)}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default Banner
