import { useEffect, useState } from 'react'
import { productsApi } from '@/lib/api'
import { useAuth } from '@/context/auth-context'
import { Image as ImageIcon, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function ProductManagement() {
  const { token } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Fetch ALL products for admin
      const data = await productsApi.list({ limit: 100 })
      setProducts(data.products)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

    try {
      if (token) {
        await productsApi.delete(token, id)
        toast.success('Product deleted successfully')
        fetchProducts()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
        <div className="text-sm text-gray-500">
          Total Products: {products.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="flex items-center gap-3">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                  <span className="font-medium truncate max-w-[200px]" title={product.name}>
                    {product.name}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{product.seller?.fullName || 'Unknown'}</span>
                    <span className="text-xs text-gray-500">{product.seller?.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category?.name || 'Uncategorized'}</Badge>
                </TableCell>
                <TableCell>${Number(product.price).toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.sold || 0}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
