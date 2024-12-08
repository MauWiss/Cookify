import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CCColors from './ClassComps/CCColors'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Change color:</h1>
      <div className="card">
        <CCColors/>
      </div>
    </>
  )
}

export default App
