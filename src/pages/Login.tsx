import { Button } from '@/components/ui/button'
import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
export function Login() {
  const location = useLocation()
  const isRegister = location.pathname === '/register'
  console.log('isRegister', isRegister)
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegisterSubmit = (e) => {
    e.preventDefault()

    // Kiểm tra số điện thoại Việt Nam: 10 số, bắt đầu 0
    const phoneRegex = /^0\d{9}$/
    if (!phoneRegex.test(phone)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập 0xxxxxxxxx')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải ít nhất 6 ký tự')
      return
    }

    setError('')
    // TODO: Gọi API đăng ký ở đây
    console.log('Đăng ký thành công:', { phone, email, password })
  }

  const handleLoginSubmit = (e: any) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Mật khẩu phải ít nhất 6 ký tự')
      return
    }
    setError('')
    // TODO: Gọi API đăng nhập
    console.log('Đăng nhập:', { email, password })
  }
  return (
    <div className=' flex flex-col items-center justify-center gap-6 bg-sky-50 overflow-x-hidden'>
      <div className='w-screen h-screen flex flex-col items-center justify-center gap-6 bg-sky-50 '>
        {/* Navbar */}
        <div className='h-[5rem] w-full flex justify-between mx-auto  bg-background shadow-md items-center px-4'>
          <div className='container w-full flex justify-between mx-auto'>
            <div className='flex items-center justify-center'>
              <h1 className='text-3xl font-bold text-red-500 ml-4'>
                ShopOnline
              </h1>
            </div>
            <Button
              variant='link'
              about='/help'
              className='flex justify-center items-center'
            >
              Bạn cần hỗ trợ?
            </Button>
          </div>
        </div>
        <div className='flex items-center justify-between mx-auto px-4 w-screen h-screen max-w-7xl '>
          <div className=''>
            <div className='w-auto relative px-[2rem]'>
              <div className='flex absolute -top-50 left-20 justify-center items-center '>
                <Avatar
                  className='w-32 h-32 mb-4 animate__animated  animate__pulse'
                  style={{
                    animationDuration: '3s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  <AvatarImage src='https://i.pinimg.com/736x/c7/2c/b2/c72cb29c701292c591d9663130279fdb.jpg' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <h1 className='text-5xl font-bold  text-red-500 mb-4'>
                Chào mừng bạn đến với ShopOnline
              </h1>
              <p className='text-lg text-red-500 '>
                Mua sắm những sản phẩm yêu thích của bạn ngay hôm nay!
              </p>
            </div>
          </div>
          <Card className='w-full max-w-md shadow-lg'>
            {isRegister ? (
              <CardHeader>
                <CardTitle>Đăng ký</CardTitle>
                <CardDescription>
                  Nhập thông tin tài khoản của bạn để đăng ký
                </CardDescription>
              </CardHeader>
            ) : (
              <CardHeader>
                <CardTitle>Đăng nhập</CardTitle>
                <CardDescription>
                  Nhập thông tin tài khoản của bạn để đăng nhập
                </CardDescription>
              </CardHeader>
            )}

            <CardContent>
              {error && <p className='text-red-500 mb-2'>{error}</p>}
              {isRegister ? (
                <form>
                  <div className='flex flex-col gap-6'>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='sdt'>Số điện thoại</Label>
                      </div>
                      <Input id='sdt' type='sdt' placeholder='Nhập số điện thoại  ' required />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='m@example.com'
                        required
                      />
                    </div>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Mật khẩu</Label>
                      </div>
                      <Input id='password' type='password' placeholder='Nhập mật khẩu  ' required />
                    </div>
                  </div>
                </form>
              ) : (
                <form>
                  <div className='flex flex-col gap-6'>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input
                        id='email'
                        type='email'
                        placeholder='m@example.com'
                        required
                      />
                    </div>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Mật khẩu</Label>
                        <a
                          href='#'
                          className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                        >
                          Quên mật khẩu?
                        </a>
                      </div>
                      <Input id='password' type='password' placeholder='Nhập mật khẩu  ' required />
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter className='flex-col gap-2'>
              {isRegister ? (
                <>
                  <Button
                    type='submit'
                    onClick={handleRegisterSubmit}
                    className='w-full'
                  >
                    Đăng ký
                  </Button>
                  <Separator className='my-2 w-full' />
                  <Button variant='outline' className='w-full'>
                    Đăng ký với Google
                  </Button>
                  <div className='text-sm mt-2 flex justify-center items-center flex-wrap text-muted-foreground'>
                    Bằng việc đăng kí, bạn đã đồng ý với Shopee về &&nbsp;
                    <span className='text-red-500'> Điều khoản dịch vụ </span>
                    &nbsp;&&nbsp;
                    <span className='text-red-500'> Chính sách bảo mật </span>
                  </div>
                  <div className='text-sm mt-2 text-muted-foreground'>
                    {' '}
                    Đã có tài khoản?
                    <Link
                      to={'/login'}
                      className='p-0 ml-1 text-red-500 font-bold'
                    >
                      Đăng nhập
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    type='submit'
                    onClick={handleLoginSubmit}
                    className='w-full'
                  >
                    Đăng nhập
                  </Button>
                  <Separator className='my-2 w-full' />
                  <Button variant='outline' className='w-full'>
                    Đăng nhập với Google
                  </Button>
                  <div className='text-sm mt-2 text-muted-foreground'>
                    {' '}
                    Nếu bạn chưa có tài khoản?
                    {/* <Link to={'/register'}> */}
                    <Link
                      to={'/register'}
                      className='p-0 ml-1 text-red-500 font-bold'
                    >
                      Đăng ký
                    </Link>
                    {/* </Link> */}
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* Footer */}
      <div className='w-full h-auto flex flex-col items-center justify-center bg-background mt-auto shadow-inner py-2'>
        <div className='max-w-7xl h-auto grid grid-cols-3 border-b border-muted/50'>
          <div className='flex flex-col items-start p-6 space-y-4'>
            <div className=''>DỊCH VỤ KHÁCH HÀNG</div>

            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>Trung tâm trợ giúp</li>
              <li>Hướng dẫn mua hàng</li>
              <li>Chính sách đổi trả</li>
              <li>Phương thức vận chuyển</li>
              <li>Thanh toán & Hoàn tiền</li>
            </ul>
          </div>
          <div className='flex flex-col items-start p-6 space-y-4'>
            <div className=''>VỀ SHOPONLINE</div>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>Giới thiệu về chúng tôi</li>
              <li>Blog</li>
              <li>Việc làm</li>
              <li>Điều khoản</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
          <div className='flex flex-col items-start p-6 space-y-4'>
            <div className=''>KẾT NỐI VỚI CHÚNG TÔI</div>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>Facebook</li>
              <li>Twitter</li>
              <li>Instagram</li>
              <li>LinkedIn</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
        <p className='text-sm text-muted-foreground'>
          &copy; 2024 ShopOnline. All rights reserved.
        </p>
        <p className='text-sm text-muted-foreground ml-4'>
          <a href='/login'>Dịch vụ khách hàng</a> |{' '}
          <a href='/login'>Điều khoản sử dụng</a> |{' '}
          <a href='/login'>Chính sách bảo mật</a>
        </p>
      </div>
    </div>
  )
}
