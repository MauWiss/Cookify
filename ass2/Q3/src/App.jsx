import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ResizableTable from './FCComponents/CCtable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ResizableTable />
    </>
  )
}

export default App
