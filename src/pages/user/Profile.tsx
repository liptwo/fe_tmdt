// import { Avatar } from "@radix-ui/react-avatar";
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'

const Profile = () => {
  const { user, isLoading, refreshProfile } = useAuth()

  // 🔴 IMPORTANT: All hooks MUST be called before any conditional returns!
  const [isEditEmail, setIsEditEmail] = useState(false)
  const [isEditNPhone, setIsEditNPhone] = useState(false)
  const [phoneError, setPhoneError] = useState('')

  const [profile, setProfile] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    day: '',
    month: '',
    year: '',
    avatar: '',
    address: '',
    city: '',
    district: '',
    ward: ''
  })

  // 🟢 Sync with user data from Auth Context
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        username: user.email?.split('@')[0] || '',
        name: user.fullName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  // 🟢 Load additional fields from localStorage (phone, avatar, etc.)
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('profileData') || '{}')
    if (savedProfile) {
      setProfile(prev => ({
        ...prev,
        phone: savedProfile.phone || prev.phone,
        gender: savedProfile.gender || prev.gender,
        day: savedProfile.day || prev.day,
        month: savedProfile.month || prev.month,
        year: savedProfile.year || prev.year,
        avatar: savedProfile.avatar || prev.avatar,
        address: savedProfile.address || prev.address,
        city: savedProfile.city || prev.city,
        district: savedProfile.district || prev.district,
        ward: savedProfile.ward || prev.ward
      }))
    }
  }, [])

  useEffect(() => {
    if (!user) {
      void refreshProfile()
    }
  }, [user, refreshProfile])

  // 🟢 Xử lý thay đổi trong input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Validate phone number
    if (name === 'phone') {
      setPhoneError('')
      
      if (value && value.length > 0) {
        // Check if starts with 0
        if (!value.startsWith('0')) {
          setPhoneError('Số điện thoại phải bắt đầu bằng số 0')
        }
        // Check if only contains numbers
        else if (!/^[0-9]+$/.test(value)) {
          setPhoneError('Số điện thoại chỉ được chứa chữ số')
        }
        // Check length
        else if (value.length < 10) {
          setPhoneError('Số điện thoại phải có ít nhất 10 chữ số')
        }
        else if (value.length > 11) {
          setPhoneError('Số điện thoại không được vượt quá 11 chữ số')
        }
      }
    }
    
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageData = reader.result
        setProfile((prev) => ({
          ...prev,
          avatar: imageData as string
        }))
        localStorage.setItem(
          'profileData',
          JSON.stringify({
            ...profile,
            avatar: imageData
          })
        )
      }
      reader.readAsDataURL(file)
    }
  }

  // 🟢 Xử lý lưu vào localStorage
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate phone before saving
    if (profile.phone && phoneError) {
      toast.error('Vui lòng nhập số điện thoại hợp lệ')
      return
    }
    
    // Final validation for phone format
    if (profile.phone) {
      if (!profile.phone.startsWith('0')) {
        toast.error('Số điện thoại phải bắt đầu bằng số 0')
        return
      }
      if (!/^0[0-9]{9,10}$/.test(profile.phone)) {
        toast.error('Số điện thoại không hợp lệ (phải có 10-11 chữ số và bắt đầu bằng 0)')
        return
      }
    }
    
    localStorage.setItem('profileData', JSON.stringify(profile))
    
    // TODO: Gọi API để update profile trên backend
    // await authApi.updateProfile(token, {
    //   fullName: profile.name,
    //   phone: profile.phone,
    //   address: profile.address,
    //   ...
    // })
    
    toast.success('Lưu thông tin thành công!')
  }

  // ✅ NOW we can do conditional returns AFTER all hooks
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
    <div className='bg-white mx-4 text-gray-700 p-6 rounded-lg shadow-sm'>
      <div className='border-b pb-3 mb-5'>
        <h2 className='text-lg font-semibold text-gray-800'>Hồ Sơ Của Tôi</h2>
        <p className='text-sm text-gray-500'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      <div className='grid grid-cols-12 gap-6'>
        {/* Form bên trái */}
        <div className='col-span-8'>
          <form onSubmit={handleSave}>
            <table className='table-auto w-full'>
              <tbody>
                <tr className='h-18 '>
                  <td className='w-1/4 pr-4 font-medium'>
                    <label>Tên đăng nhập</label>
                  </td>
                  <td>
                    <input
                      name='username'
                      value={profile.username}
                      onChange={handleChange}
                      type='text'
                      className='border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-amber-400 outline-none'
                      placeholder='Nhập tên đăng nhập'
                    />
                  </td>
                </tr>

                <tr className='h-18'>
                  <td className='pr-4 font-medium'>
                    <label>Tên</label>
                  </td>
                  <td>
                    <input
                      name='name'
                      value={profile.name}
                      onChange={handleChange}
                      type='text'
                      className='border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-amber-400 outline-none'
                      placeholder='Nhập tên hiển thị'
                    />
                  </td>
                </tr>

                <tr className='h-18'>
                  <td className='pr-4 font-medium'>Email</td>
                  <td>
                    <div className='flex items-center justify-between border border-gray-300 rounded-md p-2'>
                      {isEditEmail ? (
                        <input
                          name='email'
                          // value={user.email}
                          onChange={handleChange}
                          type='text'
                          className='border-none border-gray-300 w-full p-2 rounded-md  outline-none'
                          placeholder='Nhập email ...'
                        />
                      ) : (
                        <span>{profile.email}</span>
                      )}

                      <button
                        type='button'
                        className={`text-amber-500 hover:underline text-sm ${
                          isEditEmail && 'hidden'
                        }`}
                        onClick={() => setIsEditEmail(!isEditEmail)}
                      >
                        Thay đổi
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className='h-18'>
                  <td className='pr-4 font-medium'>Số điện thoại</td>
                  <td>
                    <div className='flex items-center justify-between border border-gray-300 rounded-md p-2'>
                      {isEditNPhone ? (
                        <div className='w-full'>
                          <input
                            name='phone'
                            value={profile.phone}
                            onChange={handleChange}
                            type='text'
                            className='border-none w-full p-0 rounded-md outline-none'
                            placeholder='Nhập số điện thoại..'
                            maxLength={11}
                          />
                        </div>
                      ) : (
                        <span>{profile.phone || 'Chưa có'}</span>
                      )}
                      <button
                        type='button'
                        className={`text-amber-500 hover:underline text-sm ml-2 flex-shrink-0 ${
                          isEditNPhone && 'hidden'
                        }`}
                        onClick={() => setIsEditNPhone(!isEditNPhone)}
                      >
                        Thay đổi
                      </button>
                    </div>
                    {phoneError && (
                      <p className='text-red-500 text-sm mt-1'>{phoneError}</p>
                    )}
                  </td>
                </tr>

                <tr className='h-18'>
                  <td className='pr-4 font-medium'>Giới tính</td>
                  <td>
                    <div className='flex gap-4'>
                      {['Nam', 'Nữ', 'Khác'].map((g) => (
                        <label key={g} className='flex items-center gap-2'>
                          <input
                            type='radio'
                            name='gender'
                            value={g}
                            checked={profile.gender === g}
                            onChange={handleChange}
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>

                <tr className='h-18'>
                  <td className='pr-4 font-medium'>Ngày sinh</td>
                  <td>
                    <div className='flex gap-3'>
                      <select
                        name='day'
                        value={profile.day}
                        onChange={handleChange}
                        className='border border-gray-300 rounded-md p-2'
                      >
                        <option value=''>Ngày</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        name='month'
                        value={profile.month}
                        onChange={handleChange}
                        className='border border-gray-300 rounded-md p-2'
                      >
                        <option value=''>Tháng</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>

                      <select
                        name='year'
                        value={profile.year}
                        onChange={handleChange}
                        className='border border-gray-300 rounded-md p-2'
                      >
                        <option value=''>Năm</option>
                        {Array.from({ length: 50 }, (_, i) => {
                          const y = 2025 - i
                          return (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  </td>
                </tr>

                <tr className='h-18'>
                  <td></td>
                  <td>
                    <button
                      type='submit'
                      className='bg-amber-500 text-white py-2 px-6 rounded-md hover:bg-amber-600 transition-all'
                    >
                      Lưu
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>

        {/* Bên phải - ảnh đại diện */}
        {/* Ảnh đại diện */}
        <div className='col-span-4 border-l pl-8 flex flex-col items-center justify-start'>
          <div className='relative w-32 h-32'>
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt='Avatar'
                className='w-32 h-32 rounded-full object-cover border'
              />
            ) : (
              <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400'>
                Chưa có ảnh
              </div>
            )}
          </div>
          <label className='mt-4 cursor-pointer bg-amber-400 text-white px-3 py-1 rounded-md hover:bg-amber-500'>
            Chọn ảnh
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
            />
          </label>
        </div>
      </div>
    </div>
  )
}

export default Profile
