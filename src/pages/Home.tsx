
import Banner from "@/containers/home/banner"
import CategoryList from "@/containers/home/category-list"
import TopProduct from "@/containers/home/top-product"
import Pannels from "@/containers/home/pannels"

const Home = () => {

  return (
    <div className='flex flex-col items-center justify-center md:pt-7'>
      <Banner />
      <main className="w-full min-h-200 md:mx-auto md:px-40 mt-[18px] overflow-x-auto md:overflow-x-visible bg-[#f8f4f5] border-b-4 border-[#df513b]">
        <CategoryList />
        <TopProduct />
        <Pannels />
      </main>
    </div>
  )
}

export default Home
