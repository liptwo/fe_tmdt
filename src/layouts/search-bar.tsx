'use client'

import type React from 'react'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SearchBar() {
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()

  // Hàm xử lý in hoa chữ đầu tiên
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Hàm xử lý in hoa chữ đầu tiên cho mỗi từ
  const capitalizeWords = (str: string): string => {
    return str
      .split(' ')
      .map((word) => capitalizeFirstLetter(word))
      .join(' ')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      const encodedKeyword = encodeURIComponent(searchValue.trim())
      navigate(`/search?q=${encodedKeyword}`)
    }
  }

  const handleKeywordClick = (keyword: string) => {
    const encodedKeyword = encodeURIComponent(keyword)
    navigate(`/search?q=${encodedKeyword}`)
  }

  const popularKeywords = [
    'ly giữ nhiệt',
    'aula f98 pro v2',
    'tai nghe bluetooth',
    'điện thoại',
    'laptop gaming',
    'quần áo nam',
    'giày thể thao',
    'mỹ phẩm'
  ].map((keyword) => capitalizeWords(keyword))

  return (
    <div className='w-full'>
      <form onSubmit={handleSearch} className='w-full'>
        <div className='flex items-center border-3 border-white rounded-xs overflow-hidden bg-white'>
          <input
            type='text'
            placeholder='SIÊU ƯU ĐÃI'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className='flex-1 px-3 md:py-2 text-[#2b2b2b] placeholder-[#757575] focus:outline-none text-sm'
          />
          <button
            type='submit'
            className='bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 flex items-center justify-center transition-colors'
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Popular Keywords */}
      <div className='mt-2  flex-wrap gap-2 hidden md:flex'>
        {popularKeywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => handleKeywordClick(keyword)}
            className='text-xs  text-header-secondary  cursor-pointer'
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  )
}
