import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Agentation } from 'agentation'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* App returns early for several views, so the provider sits above it. */}
    <TooltipProvider delayDuration={150}>
      <App />
    </TooltipProvider>
    {/* Annotation toolbar for design feedback. Dev only, so it stays out of builds. */}
    {import.meta.env.DEV ? <Agentation /> : null}
  </StrictMode>,
)
