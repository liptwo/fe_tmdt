import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import React from 'react'
const Home = () => {
  return (
    <div>
      {' '}
      <div className='flex min-h-svh flex-col items-center justify-center'>
        <Button variant='outline'> Xin chào</Button>
        <ModeToggle></ModeToggle>
      </div>
    </div>
  )
}

export default Home
