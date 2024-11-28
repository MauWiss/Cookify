import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CCGradeForm from './ClassComps/CCGradeForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Check your grade!</h1>
      <div className="card">
        <CCGradeForm/>
      </div>
    </>
  )
}

export default App
