const Footer = () => {
    return (
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
    )
}
export default Footer;