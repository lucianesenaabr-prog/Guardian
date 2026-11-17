import { createRoot } from 'react-dom/client'
import { App } from './App'
import { registerProtocols } from './engine/protocols'
import './styles.css'

registerProtocols()

createRoot(document.getElementById('root')!).render(<App />)
