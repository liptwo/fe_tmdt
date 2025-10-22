import './App.css'
import { Button } from './components/ui/button'
import { ModeToggle } from './components/ui/mode-toggle'

function App() {
  return (
    <>
      <div className='flex min-h-svh flex-col items-center justify-center'>
        <Button variant='outline'> Xin chào</Button>
        <ModeToggle></ModeToggle>
      </div>
    </>
  )
}

export default App
