import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import { adminApi, productsApi } from '@/lib/api'
import { DollarSign, Package, ShoppingCart, Users, Loader2 } from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Dashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      try {
        const [statsData, productsData, usersData] = await Promise.all([
          adminApi.getStats(token),
          productsApi.list({ limit: 5, sortOrder: 'DESC' }),
          adminApi.getUsers(token)
        ])
        
        setStats(statsData)
        setRecentProducts(productsData.products)
        setRecentUsers(usersData.slice(0, 5))
      } catch (error) {
        console.error(error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const statItems = [
    { 
      label: 'Total Revenue', 
      value: `${Number(stats?.totalRevenue || 0).toLocaleString()}đ`, 
      icon: DollarSign, 
      color: 'text-green-600' 
    },
    { 
      label: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingCart, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Total Products', 
      value: stats?.totalProducts || 0, 
      icon: Package, 
      color: 'text-orange-600' 
    },
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'text-purple-600' 
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statItems.map((stat, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Products */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Newest Products</h3>
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {product.images?.[0] && (
                          <img src={product.images[0]} alt={product.name} className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="truncate max-w-[150px]" title={product.name}>{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{Number(product.price).toLocaleString()}đ</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Newest Users</h3>
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                          <AvatarFallback>{user.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{user.fullName}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : user.role === 'seller' ? 'secondary' : 'outline'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
