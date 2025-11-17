import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/auth-context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
)
