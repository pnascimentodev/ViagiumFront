import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginClient from './pages/login/LoginClient'
import LoginAdmin from './pages/login/LoginAdmin'
import Register from './pages/registration/Register'
import LoginAffiliate from './pages/login/LoginAffiliate'
import AffiliatePage from './pages/affiliatepage/AffiliatePage'
import Footer from './components/Footer'
import PaginaTeste from './pages/affiliate/AddHotel'
        
function App() {
  return (
    <Routes>
      <Route path="/client" element={<LoginClient />} />
      <Route path="/admin" element={<LoginAdmin />} />
      <Route path="/affiliate" element={<LoginAffiliate />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/affiliatepage" element={<AffiliatePage />} />
      <Route path="footer" element={<Footer/>}/>
      <Route path="/addhotel" element={<PaginaTeste />} />
    </Routes>
  )
}

export default App
