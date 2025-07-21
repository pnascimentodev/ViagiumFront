import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginAdmin from './pages/login/LoginAdmin'
import LoginAffiliate from './pages/login/LoginAffiliate'

function App() {
  return (
    <Routes>
      <Route path="/affiliate" element={<LoginAffiliate />} />
    </Routes>
  )
}

export default App
