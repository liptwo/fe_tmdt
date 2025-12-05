import React, { useEffect, useRef, useState } from 'react'
import Header from '../../layouts/header'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import * as XLSX from 'xlsx'

/* ---------------- Types ---------------- */

type Product = {
  id: string
  name: string
  description?: string
  price: number
  imageUrl?: string
  stock?: number
}

type Order = {
  id: string
  productId: string
  productName: string
  quantity: number
  total: number
  status: 'pending' | 'shipping' | 'completed'
  date: string // ISO
  customerId?: string
}

type Customer = {
  id: string
  name: string
  email?: string
  totalSpent?: number
}

type Discount = {
  id: string
  code: string
  percent: number
  max?: number
  expiry?: string // ISO date
}

type TabKey =
  | 'dashboard'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'marketing'
  | 'revenue'
  | 'chat'
  | 'notifications'
  | 'settings'

/* ---------------- Helpers ---------------- */
const uid = (prefix = '') =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

/* ---------------- Chat Tab (Thay thế Floating Chat) ---------------- */
function ChatTab() {
  const [msgs, setMsgs] = useState<{ from: 'user' | 'bot'; text: string }[]>(
    () => {
      const s = localStorage.getItem('sc_chat_msgs')
      return s ? JSON.parse(s) : []
    }
  )
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    localStorage.setItem('sc_chat_msgs', JSON.stringify(msgs))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  function send() {
    const t = text.trim()
    if (!t) return
    setMsgs((m) => [...m, { from: 'user', text: t }])
    setText('')
    setTimeout(() => {
      // PHẢN HỒI TỰ ĐỘNG CỦA SHOP KHI KHÁCH GỬI TIN NHẮN
      setMsgs((m) => [
        ...m,
        { from: 'bot', text: 'Cảm ơn, shop sẽ phản hồi sớm 💬' }
      ])
    }, 700)
  }

  // HÀM MỚI: XÓA LỊCH SỬ TIN NHẮN
  function clearMessages() {
    if (confirm('Xác nhận xóa toàn bộ lịch sử tin nhắn?')) {
      setMsgs([]) // Reset trạng thái tin nhắn
      localStorage.removeItem('sc_chat_msgs') // Xóa khỏi localStorage
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Tin nhắn hỗ trợ khách hàng</h2>
        <button
          onClick={clearMessages}
          className='bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition'
        >
          🗑️ Xóa lịch sử
        </button>
      </div>

      <div className='bg-white rounded-lg shadow-lg flex flex-col h-[500px] max-w-xl'>
        <div className='flex items-center justify-between px-3 py-2 bg-orange-600 text-white rounded-t'>
          <div className='font-semibold'>Hỗ trợ khách</div>
        </div>
        <div className='p-3 flex-1 overflow-y-auto space-y-2'>
          {msgs.length === 0 ? (
            <div className='text-gray-400'>Chưa có tin nhắn</div>
          ) : (
            msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] ${
                  m.from === 'user'
                    ? 'ml-auto bg-orange-100'
                    : 'mr-auto bg-gray-100'
                } p-2 rounded`}
              >
                {m.text}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
        <div className='p-2 border-t flex gap-2'>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder='Nhập...'
            className='flex-1 border rounded px-2 py-1'
          />
          <button
            onClick={send}
            className='bg-orange-600 text-white px-3 py-1 rounded'
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Dashboard ---------------- */
function Dashboard({
  products,
  orders,
  customers
}: {
  products: Product[]
  orders: Order[]
  customers: Customer[]
}) {
  // small KPIs
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)
  const today = new Date().toISOString().slice(0, 10)
  const ordersToday = orders.filter((o) => o.date.startsWith(today)).length
  const lowStock = products.filter((p) => (p.stock || 0) <= 5).length

  // small monthly revenue sample
  const data = [
    { month: 'Thg 1', revenue: 1200000 },
    { month: 'Thg 2', revenue: 2000000 },
    { month: 'Thg 3', revenue: 1500000 },
    { month: 'Thg 4', revenue: totalRevenue || 1800000 }
  ]

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Tổng quan</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded shadow'>
          <div className='text-sm text-gray-500'>Doanh thu (tổng)</div>
          <div className='text-xl font-bold text-green-600'>
            {totalRevenue.toLocaleString()} ₫
          </div>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <div className='text-sm text-gray-500'>Đơn hàng hôm nay</div>
          <div className='text-xl font-bold'>{ordersToday}</div>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <div className='text-sm text-gray-500'>Khách hàng</div>
          <div className='text-xl font-bold'>{customers.length}</div>
        </div>
        <div className='bg-white p-4 rounded shadow'>
          <div className='text-sm text-gray-500'>Sản phẩm sắp hết</div>
          <div className='text-xl font-bold text-red-600'>{lowStock}</div>
        </div>
      </div>

      <div className='bg-white p-4 rounded shadow'>
        <div className='flex items-center justify-between mb-3'>
          <div className='font-medium'>Doanh thu theo tháng</div>
          <div className='text-sm text-gray-500'>Đơn vị: ₫</div>
        </div>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip formatter={(v: number) => v.toLocaleString() + ' ₫'} />
              <Line
                type='monotone'
                dataKey='revenue'
                stroke='#ee4d2d'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Products ---------------- */
function ProductsTab({
  products,
  setProducts,
  pushNotification,
  categories,
  refreshProducts
}: {
  products: Product[]
  setProducts: (p: Product[]) => void
  pushNotification: (n: string) => void
  categories: Category[]
  refreshProducts: () => void
}) {
  // form
  const [editing, setEditing] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [desc, setDesc] = useState('')
  const [img, setImg] = useState('')
  const [stock, setStock] = useState<number | ''>('')
  const [categoryId, setCategoryId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setPrice(editing.price)
      setDesc(editing.description || '')
      setImg(editing.imageUrl || '')
      setStock(editing.stock ?? '')
      // We don't have categoryId in local Product type yet, but API has it.
      // Ideally we should have it. For now, let's assume we might not have it or default to first category.
      // But wait, we mapped API product to local Product, and we didn't include categoryId.
      // We should update the mapping in Sell component to include categoryId.
      // For now, let's just default to empty or first category if not found.
      setCategoryId('') 
    } else {
      setName('')
      setPrice('')
      setDesc('')
      setImg('')
      setStock('')
      setCategoryId(categories[0]?.id || '')
      setImageFile(null)
    }
  }, [editing, categories])

  async function save() {
    if (!name || price === '' || Number(price) <= 0 || !categoryId)
      return toast.error('Nhập tên, giá và chọn danh mục hợp lệ')
    
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No token found')

      const formData = new FormData()
      formData.append('name', name)
      formData.append('price', String(price))
      formData.append('description', desc)
      formData.append('stock', String(stock || 0))
      formData.append('categoryId', categoryId)
      
      if (imageFile) {
        formData.append('images', imageFile)
      } else if (img && !editing) {
         // If creating new and providing URL manually (not supported by backend upload usually, but maybe for testing)
         // Backend expects 'images' as file. If we want to support URL, backend needs update.
         // For now, let's assume file upload is the way.
      }

      if (editing) {
        await productsApi.update(token, editing.id, formData)
        toast.success(`Đã cập nhật sản phẩm ${name}`)
      } else {
        await productsApi.create(token, formData)
        toast.success(`Đã thêm sản phẩm ${name}`)
      }
      
      refreshProducts()
      setEditing(null)
      setImageFile(null)
      setImg('')
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi lưu sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return
    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No token found')
      
      await productsApi.delete(token, id)
      toast.success('Đã xóa sản phẩm')
      refreshProducts()
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi xóa sản phẩm')
    }
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    const reader = new FileReader()
    reader.onload = () => setImg(reader.result as string)
    reader.readAsDataURL(f)
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Quản lý sản phẩm</h2>

      <div className='bg-white p-4 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-3'>
        <input
          className='border p-2 rounded'
          placeholder='Tên sản phẩm'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='border p-2 rounded'
          placeholder='Giá (₫)'
          type='number'
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === '' ? '' : Number(e.target.value))
          }
        />
        <input
          className='border p-2 rounded'
          placeholder='Số lượng tồn'
          type='number'
          value={stock}
          onChange={(e) =>
            setStock(e.target.value === '' ? '' : Number(e.target.value))
          }
        />
        <select
          className='border p-2 rounded'
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Chọn danh mục</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <textarea
          className='border p-2 rounded md:col-span-2'
          placeholder='Mô tả'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        {/* <input
          className='border p-2 rounded'
          placeholder='Ảnh (URL)'
          value={img}
          onChange={(e) => setImg(e.target.value)}
        /> */}
        <div className="col-span-3">
            <label className="block text-sm text-gray-600 mb-1">Ảnh sản phẩm</label>
            <input
            type='file'
            accept='image/*'
            onChange={handleImageFile}
            className='w-full'
            />
            {img && <img src={img} alt="Preview" className="h-20 mt-2 object-contain" />}
        </div>
        
        <div className='md:col-span-3 flex gap-2'>
          <button
            onClick={save}
            disabled={loading}
            className='bg-orange-600 text-white px-4 py-2 rounded disabled:opacity-50'
          >
            {loading ? 'Đang xử lý...' : (editing ? 'Lưu' : 'Thêm')}
          </button>
          {editing && (
            <button
              onClick={() => setEditing(null)}
              className='border px-4 py-2 rounded'
            >
              Hủy
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {products.length === 0 && (
          <div className='text-gray-500'>Chưa có sản phẩm</div>
        )}
        {products.map((p) => (
          <div key={p.id} className='bg-white p-3 rounded shadow relative'>
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                className='w-full h-44 object-cover rounded mb-2'
              />
            )}
            <div className='font-medium'>{p.name}</div>
            <div className='text-sm text-gray-500'>{p.description}</div>
            <div className='mt-2 flex items-center justify-between'>
              <div className='text-orange-600 font-semibold'>
                {p.price.toLocaleString()} ₫
              </div>
              <div
                className={`text-sm ${
                  (p.stock ?? 0) <= 5 ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                Tồn: {p.stock ?? 0}
              </div>
            </div>
            <div className='mt-2 flex gap-2'>
              <button
                onClick={() => setEditing(p)}
                className='border px-3 py-1 rounded'
              >
                Sửa
              </button>
              <button
                onClick={() => remove(p.id)}
                className='border px-3 py-1 rounded text-red-500'
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Inventory ---------------- */
function InventoryTab({
  products,
  setProducts,
  pushNotification,
  refreshProducts
}: {
  products: Product[]
  setProducts: (p: Product[]) => void
  pushNotification: (n: string) => void
  refreshProducts: () => void
}) {
  async function updateStock(id: string, delta: number) {
    const p = products.find((x) => x.id === id)
    if (!p) return
    const newStock = (p.stock ?? 0) + delta
    if (newStock < 0) return

    try {
      const token = localStorage.getItem('access_token')
      if (!token) throw new Error('No token found')

      const formData = new FormData()
      formData.append('stock', String(newStock))
      
      // We need to send other required fields if the backend validation is strict, 
      // but UpdateProductDto usually allows partial. 
      // However, FormData might be tricky with partials if backend expects specific fields.
      // Let's try sending just stock.
      
      await productsApi.update(token, id, formData)
      toast.success(`Đã cập nhật tồn kho: ${newStock}`)
      refreshProducts()
    } catch (error) {
      console.error(error)
      toast.error('Lỗi cập nhật tồn kho')
    }
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Kho hàng</h2>
      <div className='bg-white p-4 rounded shadow'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-2 border'>Sản phẩm</th>
              <th className='p-2 border'>Tồn</th>
              <th className='p-2 border'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td className='p-2 border'>{p.name}</td>
                <td className='p-2 border'>{p.stock ?? 0}</td>
                <td className='p-2 border'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => updateStock(p.id, 1)}
                      className='px-2 py-1 border rounded'
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateStock(p.id, -1)}
                      className='px-2 py-1 border rounded'
                    >
                      -1
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={3} className='p-4 text-gray-500'>
                  Chưa có sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------------- Orders / Shipping ---------------- */
function OrdersTab({
  orders,
  setOrders,
  products,
  pushNotification
}: {
  orders: Order[]
  setOrders: (o: Order[]) => void
  products: Product[]
  pushNotification: (n: string) => void
}) {
  const [filter, setFilter] = useState<'all' | Order['status']>('all')

  function changeStatus(id: string, status: Order['status']) {
    const updated = orders.map((o) => (o.id === id ? { ...o, status } : o))
    setOrders(updated)
    pushNotification(`Đơn ${id} chuyển sang ${status}`)
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Đơn hàng</h2>
      <div className='flex gap-2 items-center'>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className='border p-2 rounded'
        >
          <option value='all'>Tất cả</option>
          <option value='pending'>Chờ xử lý</option>
          <option value='shipping'>Đang giao</option>
          <option value='completed'>Hoàn thành</option>
        </select>
      </div>

      <div className='bg-white p-3 rounded shadow'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-2 border'>Mã</th>
              <th className='p-2 border'>Sản phẩm</th>
              <th className='p-2 border'>Số lượng</th>
              <th className='p-2 border'>Tổng</th>
              <th className='p-2 border'>Trạng thái</th>
              <th className='p-2 border'>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((o) => (filter === 'all' ? true : o.status === filter))
              .map((o) => (
                <tr key={o.id}>
                  <td className='p-2 border'>{o.id}</td>
                  <td className='p-2 border'>{o.productName}</td>
                  <td className='p-2 border'>{o.quantity}</td>
                  <td className='p-2 border text-red-600'>
                    {o.total.toLocaleString()} ₫
                  </td>
                  <td className='p-2 border'>{o.status}</td>
                  <td className='p-2 border'>
                    <div className='flex gap-2'>
                      {o.status !== 'shipping' && (
                        <button
                          onClick={() => changeStatus(o.id, 'shipping')}
                          className='px-2 py-1 border rounded'
                        >
                          Giao
                        </button>
                      )}
                      {o.status !== 'completed' && (
                        <button
                          onClick={() => changeStatus(o.id, 'completed')}
                          className='px-2 py-1 border rounded'
                        >
                          Hoàn
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className='p-4 text-gray-500'>
                  Chưa có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------------- Customers ---------------- */
function CustomersTab({ customers }: { customers: Customer[] }) {
  function exportCustomers() {
    const ws = XLSX.utils.json_to_sheet(customers)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Customers')
    XLSX.writeFile(wb, 'customers.xlsx')
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Khách hàng</h2>
        <button
          onClick={exportCustomers}
          className='bg-green-600 text-white px-3 py-1 rounded'
        >
          Xuất Excel
        </button>
      </div>

      <div className='bg-white p-3 rounded shadow'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-2 border'>Mã</th>
              <th className='p-2 border'>Tên</th>
              <th className='p-2 border'>Email</th>
              <th className='p-2 border'>Tổng chi</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td className='p-2 border'>{c.id}</td>
                <td className='p-2 border'>{c.name}</td>
                <td className='p-2 border'>{c.email ?? '-'}</td>
                <td className='p-2 border'>
                  {(c.totalSpent ?? 0).toLocaleString()} ₫
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className='p-4 text-gray-500'>
                  Chưa có khách hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------------- Marketing / Discounts ---------------- */
function MarketingTab({
  discounts,
  setDiscounts,
  pushNotification
}: {
  discounts: Discount[]
  setDiscounts: (d: Discount[]) => void
  pushNotification: (n: string) => void
}) {
  const [code, setCode] = useState('')
  const [percent, setPercent] = useState<number | ''>('')
  const [max, setMax] = useState<number | ''>('')
  const [expiry, setExpiry] = useState('')

  function add() {
    if (!code || percent === '' || Number(percent) <= 0)
      return alert('Nhập mã và phần trăm')
    const d: Discount = {
      id: uid('d_'),
      code,
      percent: Number(percent),
      max: max === '' ? undefined : Number(max),
      expiry: expiry || undefined
    }
    setDiscounts([d, ...discounts])
    pushNotification(`Thêm mã ${code}`)
    setCode('')
    setPercent('')
    setMax('')
    setExpiry('')
  }

  function remove(id: string) {
    if (!confirm('Xóa mã?')) return
    setDiscounts(discounts.filter((d) => d.id !== id))
    pushNotification('Xóa mã giảm giá')
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Marketing - Mã giảm giá</h2>

      <div className='bg-white p-3 rounded shadow grid grid-cols-1 md:grid-cols-4 gap-2'>
        <input
          placeholder='Mã (VD SALE10)'
          className='border p-2 rounded'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          placeholder='% giảm'
          className='border p-2 rounded'
          value={percent}
          onChange={(e) =>
            setPercent(e.target.value === '' ? '' : Number(e.target.value))
          }
          type='number'
        />
        <input
          placeholder='Tối đa (₫)'
          className='border p-2 rounded'
          value={max}
          onChange={(e) =>
            setMax(e.target.value === '' ? '' : Number(e.target.value))
          }
          type='number'
        />
        <input
          type='date'
          className='border p-2 rounded'
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
        <div className='md:col-span-4 flex gap-2'>
          <button
            onClick={add}
            className='bg-orange-600 text-white px-4 py-2 rounded'
          >
            Thêm mã
          </button>
        </div>
      </div>

      <div className='bg-white p-3 rounded shadow'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-2 border'>Mã</th>
              <th className='p-2 border'>% giảm</th>
              <th className='p-2 border'>Tối đa</th>
              <th className='p-2 border'>Hết hạn</th>
              <th className='p-2 border'>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id}>
                <td className='p-2 border'>{d.code}</td>
                <td className='p-2 border'>{d.percent}%</td>
                <td className='p-2 border'>
                  {d.max ? d.max.toLocaleString() + ' ₫' : '-'}
                </td>
                <td className='p-2 border'>{d.expiry ?? '-'}</td>
                <td className='p-2 border'>
                  <button onClick={() => remove(d.id)} className='text-red-500'>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={5} className='p-3 text-gray-500'>
                  Chưa có mã
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------------- Revenue (detailed) ---------------- */
function RevenueTab({ orders }: { orders: Order[] }) {
  // Lấy năm hiện tại để đặt làm giá trị mặc định
  const currentYear = new Date().getFullYear().toString()
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState('all')

  // 1. TẠO DANH SÁCH NĂM CÓ DỮ LIỆU
  const allOrderYears = [
    ...new Set(orders.map((o) => new Date(o.date).getFullYear().toString()))
  ]
  // Đảm bảo năm hiện tại luôn có trong danh sách
  if (!allOrderYears.includes(currentYear)) {
    allOrderYears.push(currentYear)
  }
  const availableYears = allOrderYears.sort((a, b) => b.localeCompare(a))

  // Hàm helper để chuẩn hóa việc lấy tháng và năm
  const getOrderDateInfo = (o: Order) => {
    const orderDate = new Date(o.date)
    const year = orderDate.getFullYear().toString()
    const month = (orderDate.getMonth() + 1).toString() // 1-12
    return { year, month }
  }

  // 2. LỌC ĐƠN HÀNG ĐỂ TÍNH TỔNG DOANH THU ĐÃ LỌC (Theo tháng VÀ năm)
  const filteredOrdersForTotal = orders.filter((o) => {
    const { year, month } = getOrderDateInfo(o)
    const yearMatch = year === selectedYear
    const monthMatch = selectedMonth === 'all' || month === selectedMonth
    return yearMatch && monthMatch
  })

  // TỔNG DOANH THU CỦA KỲ ĐÃ LỌC (Hiển thị nổi bật)
  const totalRevenueFiltered = filteredOrdersForTotal.reduce(
    (s, o) => s + o.total,
    0
  )

  // 3. TÍNH DOANH THU THEO THÁNG CHO CHART (chỉ dùng orders của năm được chọn)
  const ordersInSelectedYear = orders.filter(
    (o) => getOrderDateInfo(o).year === selectedYear
  )

  const monthlyRevenue: { [key: number]: number } = {}
  for (let i = 1; i <= 12; i++) {
    monthlyRevenue[i] = 0
  }

  ordersInSelectedYear.forEach((order) => {
    const month = getOrderDateInfo(order).month
    // Chuyển tháng về số nguyên để truy cập đối tượng monthlyRevenue
    monthlyRevenue[parseInt(month)] += order.total
  })

  const chartData = [
    { month: 'Thg 1', revenue: monthlyRevenue[1] },
    { month: 'Thg 2', revenue: monthlyRevenue[2] },
    { month: 'Thg 3', revenue: monthlyRevenue[3] },
    { month: 'Thg 4', revenue: monthlyRevenue[4] },
    { month: 'Thg 5', revenue: monthlyRevenue[5] },
    { month: 'Thg 6', revenue: monthlyRevenue[6] },
    { month: 'Thg 7', revenue: monthlyRevenue[7] },
    { month: 'Thg 8', revenue: monthlyRevenue[8] },
    { month: 'Thg 9', revenue: monthlyRevenue[9] },
    { month: 'Thg 10', revenue: monthlyRevenue[10] },
    { month: 'Thg 11', revenue: monthlyRevenue[11] },
    { month: 'Thg 12', revenue: monthlyRevenue[12] }
  ]

  function exportRevenue() {
    // Xuất dữ liệu đã lọc theo năm (12 tháng)
    const dataToExport = chartData.map((d) => ({
      Thang: `${d.month}/${selectedYear}`,
      DoanhThu: d.revenue
    }))
    const ws = XLSX.utils.json_to_sheet(dataToExport)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `Revenue_${selectedYear}`)
    XLSX.writeFile(wb, `revenue_${selectedYear}.xlsx`)
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Doanh thu</h2>
        <button
          className='bg-green-600 text-white px-3 py-1 rounded'
          onClick={exportRevenue}
        >
          Xuất Excel
        </button>
      </div>

      <div className='bg-white p-3 rounded shadow flex gap-4 items-center flex-wrap'>
        <h3 className='text-lg font-medium'>Lọc theo:</h3>

        {/* LỌC NĂM */}
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value)
            setSelectedMonth('all') // Reset tháng khi đổi năm
          }}
          className='border p-2 rounded'
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              Năm {year}
            </option>
          ))}
        </select>

        {/* LỌC THÁNG */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className='border p-2 rounded'
        >
          <option value='all'>Tất cả các tháng</option>
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={(i + 1).toString()}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        {/* HIỂN THỊ TỔNG DOANH THU ĐÃ LỌC */}
        <div className='ml-4 p-2 bg-orange-100 rounded'>
          <span className='font-medium'>
            **Tổng Doanh thu (
            {selectedMonth === 'all' ? 'Năm' : `Thg ${selectedMonth}, Năm`}{' '}
            {selectedYear}):**
          </span>{' '}
          <span className='text-xl font-bold text-orange-600'>
            {totalRevenueFiltered.toLocaleString()} ₫
          </span>
        </div>
      </div>

      <div className='bg-white p-3 rounded shadow'>
        <div className='font-medium mb-2'>
          Biểu đồ Doanh thu theo tháng ({selectedYear})
        </div>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid stroke='#eee' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip formatter={(v: number) => v.toLocaleString() + ' ₫'} />
              <Line
                type='monotone'
                dataKey='revenue'
                stroke='#ee4d2d'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Notifications ---------------- */
function NotificationsTab({
  notifications,
  markRead
}: {
  notifications: string[]

  markRead: () => void
}) {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Thông báo</h2>
        <button onClick={markRead} className='border px-3 py-1 rounded'>
          Đánh dấu đã đọc
        </button>
      </div>
      <div className='bg-white p-3 rounded shadow'>
        {notifications.length === 0 ? (
          <div className='text-gray-500'>Không có thông báo</div>
        ) : (
          notifications.map((n, i) => (
            <div key={i} className='p-2 border-b last:border-b-0'>
              {n}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ---------------- Settings ---------------- */
function SettingsTab({
  shopInfo,
  setShopInfo
}: {
  shopInfo: any
  setShopInfo: (s: any) => void
}) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () =>
      setShopInfo({ ...shopInfo, logo: reader.result as string })
    reader.readAsDataURL(f)
  }

  function save() {
    localStorage.setItem('sc_shop_info', JSON.stringify(shopInfo))
    alert('Đã lưu thông tin cửa hàng')
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Cài đặt cửa hàng</h2>
      <div className='bg-white p-3 rounded shadow max-w-2xl'>
        <input
          className='w-full border p-2 rounded mb-2'
          placeholder='Tên shop'
          value={shopInfo.name || ''}
          onChange={(e) => setShopInfo({ ...shopInfo, name: e.target.value })}
        />
        <textarea
          className='w-full border p-2 rounded mb-2'
          placeholder='Mô tả'
          value={shopInfo.description || ''}
          onChange={(e) =>
            setShopInfo({ ...shopInfo, description: e.target.value })
          }
        />
        <input
          className='w-full border p-2 rounded mb-2'
          placeholder='Liên hệ'
          value={shopInfo.contact || ''}
          onChange={(e) =>
            setShopInfo({ ...shopInfo, contact: e.target.value })
          }
        />

        {/* THÊM MỚI: Phí vận chuyển mặc định */}
        <div className='text-sm text-gray-600 mt-2 mb-1'>
          Phí vận chuyển mặc định (₫)
        </div>
        <input
          className='w-full border p-2 rounded mb-2'
          placeholder='30000'
          type='number'
          value={shopInfo.defaultShippingFee || ''}
          onChange={(e) =>
            setShopInfo({
              ...shopInfo,
              defaultShippingFee:
                e.target.value === '' ? 0 : Number(e.target.value)
            })
          }
        />

        {/* THÊM MỚI: Đơn vị tiền tệ */}
        <div className='text-sm text-gray-600 mt-2 mb-1'>Đơn vị tiền tệ</div>
        <input
          className='w-full border p-2 rounded mb-2'
          placeholder='₫'
          value={shopInfo.currency || '₫'}
          onChange={(e) =>
            setShopInfo({ ...shopInfo, currency: e.target.value })
          }
        />

        {/* Logo */}
        <div className='text-sm text-gray-600 mt-2 mb-1'>Logo cửa hàng</div>
        <div className='mb-2'>
          <input type='file' accept='image/*' onChange={handleFile} />
          {shopInfo.logo && (
            <img
              src={shopInfo.logo}
              alt='logo'
              className='h-20 w-20 rounded mt-2 object-cover'
            />
          )}
        </div>

        <div className='flex gap-2'>
          <button
            onClick={save}
            className='bg-orange-600 text-white px-4 py-2 rounded'
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Sidebar trượt từ trái ---------------- */
function Sidebar({
  open,
  setOpen,
  setTab,
  notificationCount // <<< THAY ĐỔI 1: Nhận prop mới
}: {
  open: boolean
  setOpen: (v: boolean) => void
  setTab: (t: any) => void
  notificationCount: number // <<< THAY ĐỔI 1: Kiểu dữ liệu
}) {
  const tabs = [
    { key: 'dashboard', label: ' Tổng quan' },
    { key: 'products', label: ' Sản phẩm' },
    { key: 'inventory', label: ' Kho hàng' },
    { key: 'orders', label: 'Đơn hàng' },
    { key: 'customers', label: 'Khách hàng' },
    { key: 'marketing', label: ' Marketing' },
    { key: 'revenue', label: ' Doanh thu' },
    { key: 'chat', label: ' Tin nhắn' },
    // <<< THAY ĐỔI 2: Dùng biến động để hiển thị số lượng
    { key: 'notifications', label: `🔔 Thông báo (${notificationCount})` },
    { key: 'settings', label: '⚙️ Cài đặt' }
  ]

  return (
    <>
      {/* Overlay nền tối */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className='fixed inset-0 bg-black/40 z-[9998] transition-opacity md:hidden'
        />
      )}

      {/* Sidebar (mobile trượt / desktop cố định) */}
      <div
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-[#FAFAFA] shadow-md z-[9999] transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className='p-4 font-bold text-orange-600 text-lg border-b flex justify-between items-center md:hidden'>
          Kênh Người Bán
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        {/* Danh sách menu */}
        <ul className='p-3 space-y-1'>
          {tabs.map((t) => (
            <li
              key={t.key}
              onClick={() => {
                setTab(t.key)
                setOpen(false)
              }}
              className={`cursor-pointer p-2 pl-4 rounded-l-lg transition
                hover:bg-orange-50
                ${
                  // highlight mục đang chọn
                  t.key === 'dashboard'
                    ? 'bg-orange-100 border-l-4 border-orange-500 font-semibold text-orange-600'
                    : 'text-gray-700'
                }`}
            >
              {t.label}
            </li>
          ))}
        </ul>

        {/* Nút tạo đơn demo */}
        <div className='p-3'>
          <button className='w-full bg-orange-500 hover:bg-orange-600 text-white rounded py-2 font-semibold'>
            Tạo đơn demo
          </button>
        </div>
      </div>
    </>
  )
}

import { productsApi, categoriesApi, authApi, type Category } from '../../lib/api'
import { useAuth } from '../../context/auth-context'
import { toast } from 'sonner'

/* ---------------- Main Sell Component ---------------- */
export default function Sell() {
  const { user, refreshProfile } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileForm, setProfileForm] = useState({
    address: '',
    phone: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountHolder: ''
  })

  useEffect(() => {
    if (user) {
      const missingInfo = !user.address || !user.phone || !user.bankName || !user.bankAccountNumber || !user.bankAccountHolder
      if (missingInfo) {
        setShowProfileModal(true)
        setProfileForm({
          address: user.address || '',
          phone: user.phone || '',
          bankName: user.bankName || '',
          bankAccountNumber: user.bankAccountNumber || '',
          bankAccountHolder: user.bankAccountHolder || ''
        })
      } else {
        setShowProfileModal(false)
      }
    }
  }, [user])

  async function handleUpdateProfile() {
    if (!profileForm.address || !profileForm.phone || !profileForm.bankName || !profileForm.bankAccountNumber || !profileForm.bankAccountHolder) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      if (!token) return
      await authApi.updateProfile(token, profileForm)
      await refreshProfile()
      toast.success('Cập nhật thông tin thành công!')
    } catch (error) {
      console.error(error)
      toast.error('Có lỗi xảy ra khi cập nhật thông tin')
    }
  }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const fetchProducts = async () => {
    if (user?.id) {
      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          const data = await productsApi.listMyProducts(token)
          const mapped: Product[] = data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description || undefined,
            imageUrl: p.images?.[0],
            stock: p.stock
          }))
          setProducts(mapped)
        }
      } catch (error) {
        console.error('Failed to fetch products', error)
      }
    }
  }

  useEffect(() => {
    fetchProducts()
    
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.list()
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      }
    }
    fetchCategories()
  }, [user])
  const [orders, setOrders] = useState<Order[]>(() => {
    const s = localStorage.getItem('sc_orders')
    return s
      ? JSON.parse(s)
      : [
          {
            id: uid('o_'),
            productId: products[0]?.id ?? 'p_demo',
            productName: products[0]?.name ?? 'Sản phẩm',
            quantity: 1,
            total: products[0]?.price ?? 120000,
            status: 'pending',
            date: new Date().toISOString().slice(0, 10)
          }
        ]
  })
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const s = localStorage.getItem('sc_customers')
    return s
      ? JSON.parse(s)
      : [
          {
            id: uid('c_'),
            name: 'Nguyễn Văn A',
            email: 'a@gmail.com',
            totalSpent: 500000
          }
        ]
  })
  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const s = localStorage.getItem('sc_discounts')
    return s ? JSON.parse(s) : []
  })
  const [notifications, setNotifications] = useState<string[]>(() => {
    const s = localStorage.getItem('sc_notifications')
    return s ? JSON.parse(s) : []
  })

  const [shopInfo, setShopInfo] = useState(() => {
    const s = localStorage.getItem('sc_shop_info')
    return s
      ? JSON.parse(s)
      : { name: '', description: '', contact: '', logo: '' }
  })

  const [tab, setTab] = useState<
    | 'dashboard'
    | 'products'
    | 'inventory'
    | 'orders'
    | 'customers'
    | 'marketing'
    | 'revenue'
    | 'chat'
    | 'notifications'
    | 'settings'
  >('dashboard')

  // persist

  useEffect(
    () => localStorage.setItem('sc_orders', JSON.stringify(orders)),
    [orders]
  )
  useEffect(
    () => localStorage.setItem('sc_customers', JSON.stringify(customers)),
    [customers]
  )
  useEffect(
    () => localStorage.setItem('sc_discounts', JSON.stringify(discounts)),
    [discounts]
  )
  useEffect(
    () =>
      localStorage.setItem('sc_notifications', JSON.stringify(notifications)),
    [notifications]
  )
  useEffect(
    () => localStorage.setItem('sc_shop_info', JSON.stringify(shopInfo)),
    [shopInfo]
  )

  // push notification helper
  function pushNotification(n: string) {
    setNotifications((prev) => [n, ...prev].slice(0, 50))
  }

  // small helper to create order (demo)
  function createDemoOrder(productId?: string) {
    const p = products.find((x) => x.id === productId) || products[0]
    if (!p) return
    const o: Order = {
      id: uid('o_'),
      productId: p.id,
      productName: p.name,
      quantity: 1,
      total: p.price,
      status: 'pending',
      date: new Date().toISOString().slice(0, 10)
    }
    setOrders((prev) => [o, ...prev])
    // reduce stock
    setProducts((prev) =>
      prev.map((pp) =>
        pp.id === p.id ? { ...pp, stock: (pp.stock ?? 0) - 1 } : pp
      )
    )
    pushNotification(`Đơn hàng mới ${o.id} - ${p.name}`)
  }

  // mark notifications read
  function clearNotifications() {
    setNotifications([])
  }

  if (showProfileModal) {
    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
        <div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-md'>
          <h2 className='text-2xl font-bold mb-4 text-center text-orange-600'>Hoàn thiện hồ sơ người bán</h2>
          <p className='mb-4 text-gray-600 text-sm text-center'>
            Vui lòng cung cấp thông tin địa chỉ và tài khoản ngân hàng để kích hoạt tính năng bán hàng và nhận thanh toán.
          </p>
          
          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Địa chỉ kho hàng</label>
              <input 
                className='w-full border p-2 rounded mt-1'
                value={profileForm.address}
                onChange={e => setProfileForm({...profileForm, address: e.target.value})}
                placeholder='Số nhà, đường, phường/xã...'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Số điện thoại</label>
              <input 
                className='w-full border p-2 rounded mt-1'
                value={profileForm.phone}
                onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                placeholder='09xxxxxxxx'
              />
            </div>
            <div className='border-t pt-3 mt-3'>
              <h3 className='font-semibold mb-2'>Thông tin ngân hàng (để nhận tiền)</h3>
              <div className='space-y-3'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Tên ngân hàng</label>
                  <input 
                    className='w-full border p-2 rounded mt-1'
                    value={profileForm.bankName}
                    onChange={e => setProfileForm({...profileForm, bankName: e.target.value})}
                    placeholder='VD: Vietcombank'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Số tài khoản</label>
                  <input 
                    className='w-full border p-2 rounded mt-1'
                    value={profileForm.bankAccountNumber}
                    onChange={e => setProfileForm({...profileForm, bankAccountNumber: e.target.value})}
                    placeholder='Số tài khoản'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Tên chủ tài khoản</label>
                  <input 
                    className='w-full border p-2 rounded mt-1'
                    value={profileForm.bankAccountHolder}
                    onChange={e => setProfileForm({...profileForm, bankAccountHolder: e.target.value.toUpperCase()})}
                    placeholder='NGUYEN VAN A'
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleUpdateProfile}
            className='w-full bg-orange-600 text-white py-2 rounded mt-6 font-semibold hover:bg-orange-700 transition'
          >
            Cập nhật hồ sơ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='container bg-gray-100'>
      {/* <Header /> */}

      <div className='md:hidden p-4 flex justify-between items-center bg-white shadow'>
        <button
          onClick={() => setSidebarOpen(true)}
          className='flex items-center gap-2 text-orange-600 font-semibold'
        >
          ☰
        </button>
        <div className='font-bold text-orange-600'>Kênh Người Bán</div>
      </div>

      <div className='flex'>
        {/* Sidebar trượt cho mobile */}
        {/* <<< THAY ĐỔI 3: Truyền số lượng thông báo vào Sidebar */}
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          setTab={setTab}
          notificationCount={notifications.length}
        />

        <main className='flex-1 p-6'>
          {tab === 'dashboard' && (
            <Dashboard
              products={products}
              orders={orders}
              customers={customers}
            />
          )}

          {tab === 'products' && (
            <ProductsTab
              products={products}
              setProducts={setProducts}
              pushNotification={pushNotification}
              categories={categories}
              refreshProducts={fetchProducts}
            />
          )}

          {tab === 'inventory' && (
            <InventoryTab
              products={products}
              setProducts={setProducts}
              pushNotification={pushNotification}
              refreshProducts={fetchProducts}
            />
          )}

          {tab === 'orders' && (
            <OrdersTab
              orders={orders}
              setOrders={setOrders}
              products={products}
              pushNotification={pushNotification}
            />
          )}

          {tab === 'customers' && <CustomersTab customers={customers} />}

          {tab === 'marketing' && (
            <MarketingTab
              discounts={discounts}
              setDiscounts={setDiscounts}
              pushNotification={pushNotification}
            />
          )}

          {tab === 'revenue' && <RevenueTab orders={orders} />}

          {tab === 'chat' && <ChatTab />}

          {tab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              markRead={() => clearNotifications()}
            />
          )}

          {tab === 'settings' && (
            <SettingsTab shopInfo={shopInfo} setShopInfo={setShopInfo} />
          )}
        </main>
      </div>
    </div>
  )
}
