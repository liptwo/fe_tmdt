import type { Product } from './api'

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Ly Giữ Nhiệt Inox 500ml - Màu Xanh Rêu',
    price: 58000,
    originalPrice: 75000,
    images: ['/images/tumbler1.jpg'],
    category: { id: 'c1', name: 'Ly, Cốc & Kính' },
    rating: 5,
    location: 'Hà Nội',
    sold: 126,
    isFavorite: true,
    isCheap: true,
    voucher: 'VOUCHER10'
  },
  {
    id: 'p2',
    name: 'Bình Nước LocknLock 750ml - Màu Đen',
    price: 698000,
    originalPrice: 850000,
    images: ['/images/tumbler2.jpg'],
    category: { id: 'c2', name: 'Bình nước & Phụ kiện' },
    rating: 4.8,
    location: 'TP. Hồ Chí Minh',
    sold: 54,
    isFavorite: false,
    isCheap: false
  },
  {
    id: 'p3',
    name: 'Ly Giữ Nhiệt Có ống Hút 550ml - Hồng',
    price: 15999,
    images: ['/images/tumbler3.jpg'],
    category: { id: 'c1', name: 'Ly, Cốc & Kính' },
    rating: 4.8,
    location: 'Thái Nguyên',
    sold: 320,
    isFavorite: true,
    isCheap: true,
    voucher: 'FREESHIP'
  },
  {
    id: 'p4',
    name: 'Cốc Giữ Nhiệt Starbucks 350ml',
    price: 99000,
    images: ['/images/tumbler4.jpg'],
    category: { id: 'c1', name: 'Ly, Cốc & Kính' },
    rating: 5,
    location: 'Hà Nội',
    sold: 88,
    isFavorite: false,
    isCheap: false
  },
  {
    id: 'p5',
    name: 'Bình Nước Thể Thao 1L - Xanh Dương',
    price: 120000,
    images: ['/images/tumbler5.jpg'],
    category: { id: 'c2', name: 'Bình nước & Phụ kiện' },
    rating: 4.6,
    location: 'Lạng Sơn',
    sold: 17,
    isFavorite: false,
    isCheap: true
  },
  {
    id: 'p6',
    name: 'Bình Giữ Nhiệt YETI 500ml - Màu Bạc',
    price: 899000,
    originalPrice: 999000,
    images: ['/images/tumbler6.jpg'],
    category: { id: 'c2', name: 'Bình nước & Phụ kiện' },
    rating: 5,
    location: 'TP. Hồ Chí Minh',
    sold: 210,
    isFavorite: true,
    isCheap: false
  },
  {
    id: 'p7',
    name: 'Ly Thủy Tinh Cao Cấp 300ml',
    price: 45000,
    images: ['/images/tumbler7.jpg'],
    category: { id: 'c1', name: 'Ly, Cốc & Kính' },
    rating: 4.5,
    location: 'Hà Nội',
    sold: 12
  },
  {
    id: 'p8',
    name: 'Bình Nước Du Lịch 600ml - Hồng Pastel',
    price: 89000,
    images: ['/images/tumbler8.jpg'],
    category: { id: 'c2', name: 'Bình nước & Phụ kiện' },
    rating: 4.7,
    location: 'TP. Hồ Chí Minh',
    sold: 72,
    isCheap: true
  }
]

export async function getMockProducts(opts?: {
  categoryId?: string
  search?: string
}) {
  await new Promise((r) => setTimeout(r, 150))
  let items = mockProducts.slice()
  if (opts?.categoryId)
    items = items.filter((p) => p.category?.id === opts.categoryId)
  if (opts?.search) {
    const q = opts.search.toLowerCase()
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category?.name || '').toLowerCase().includes(q)
    )
  }
  return { products: items }
}
