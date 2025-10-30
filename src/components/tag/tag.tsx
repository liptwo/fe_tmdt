type TagType = "cheap" | "commission" | "flash"

interface TagProps {
    type: TagType
    label?: string
}

export const Tag = ({ type, label }: TagProps) => {
    // Tag "Rẻ Vô Địch" - viền cam
    if (type === "cheap") {
        return (
            <span className="inline-flex items-center p-0.5 text-[10px] font-medium text-[#ee4d2d] border border-[#ee4d2d] rounded-xs">
                {label || "Rẻ Vô Địch"}
            </span>
        )
    }

    // Tag "HOA HỒNG XTRA" - dùng ảnh
    if (type === "commission") {
        return (
            <img
                src="/src/assets/image/tag/hoa-hong.png"
                alt="Hoa hồng xtra"
                className="h-4 object-contain"
            />
        )
    }

    // Tag lightning icon (đang bán chạy)
    if (type === "flash") {
        return (
            <div className="inline-flex items-center py-0.5 text-[10px] font-medium text-[#ee4d2d] ">
                <img
                    src="/src/assets/image/tag/shopee-badge.svg"
                    alt="Đang bán chạy"
                    className="h-4 object-contain border border-[#ee4d2d] pr-1"
                />
                <span className="bg-[#f1c2b8] text-white border-l border-[#ee4d2d] pl-1">Đang bán chạy</span>
            </div>

        )
    }

    return null
}
