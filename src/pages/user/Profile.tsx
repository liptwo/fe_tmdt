import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'

const UserProfile = () => {
  const { user, isLoading, refreshProfile } = useAuth()

  useEffect(() => {
    if (!user) {
      void refreshProfile()
    }
  }, [user, refreshProfile])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-16'>
        <p className='text-lg text-gray-500'>Đang tải thông tin tài khoản...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-10'>
      <h1 className='text-2xl font-semibold mb-6'>Thông tin cá nhân</h1>
      <div className='bg-white shadow rounded-lg p-6 space-y-4'>
        <div>
          <p className='text-sm text-gray-500'>Họ và tên</p>
          <p className='text-lg font-medium text-gray-900'>{user.fullName}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Email</p>
          <p className='text-lg font-medium text-gray-900'>{user.email}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Vai trò</p>
          <p className='text-lg font-medium capitalize text-gray-900'>{user.role}</p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Trạng thái</p>
          <span className='inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium'>
            {user.status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

