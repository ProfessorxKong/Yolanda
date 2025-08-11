import { useState } from 'react'
import './App.css'
import ReactLogo from '@/assets/react.svg?react'
import viteLogo from '/vite.svg'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { increment } from '@/store/slices/appSlice'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="logo react" aria-label="React logo">
          <ReactLogo width={120} height={120} />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <ReduxDemo />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App

function ReduxDemo() {
  const dispatch = useAppDispatch()
  const value = useAppSelector((s) => s.app.counter)
  return (
    <div style={{ marginTop: 12 }}>
      <button onClick={() => dispatch(increment())}>Redux counter: {value}</button>
    </div>
  )
}
