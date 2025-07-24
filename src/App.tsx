import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginClient from './pages/login/LoginClient'
import LoginAdmin from './pages/login/LoginAdmin'
import Register from './pages/registration/Register'
import LoginAffiliate from './pages/login/LoginAffiliate'
import Footer from './components/Footer'
import ForgotPassword from './pages/password/ForgotPassword'
import ResectPassword from './pages/password/ResetPassword'

function App() {
  return (
    <Routes>
      <Route path="/client" element={<LoginClient />} />
      <Route path="/admin" element={<LoginAdmin />} />
      <Route path="/affiliate" element={<LoginAffiliate />} />
      <Route path="/register" element={<Register/>} />
      <Route path="footer" element={<Footer/>}/>
      <Route path="/resetpassword" element={<ResectPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} /> 
    </Routes>
  )
}

export default App
