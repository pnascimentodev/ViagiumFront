import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginClient from './pages/login/LoginClient'
import LoginAdmin from './pages/login/LoginAdmin'
import Register from './pages/registration/Register'
import LoginAffiliate from './pages/login/LoginAffiliate'
import AffiliatePage from './pages/affiliatepage/AffiliatePage'
import Footer from './components/Footer'
import ResetPassword from './pages/password/ResetClient'
import ForgotPassword from './pages/password/ForgotPassword'
import EmailClient from './pages/password/EmailClient'
import EmailAffiliate from './pages/password/EmailAffiliate'
import ForgotPassClient from './pages/password/ForgotPassClient'
import ForgotPassAffiliate from './pages/password/ForgotPassAffiliate'
import Package from './pages/package/Package'
import ProfileEditor from "./pages/profile/profile-editor.tsx";

function App() {
  return (
    <Routes>
      <Route path="/client" element={<LoginClient />} />
      <Route path="/admin" element={<LoginAdmin />} />
      <Route path="/affiliate" element={<LoginAffiliate />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/affiliatepage" element={<AffiliatePage />} />
      <Route path="footer" element={<Footer/>}/>
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/forgotpassaffiliate" element={<ForgotPassAffiliate />} />
      <Route path="/forgotpassclient" element={<ForgotPassClient />} />
      <Route path="/emailclient" element={<EmailClient />} />
      <Route path="/emailaffiliate" element={<EmailAffiliate />} />
      <Route path="/package" element={<Package />} />
        <Route path="/profile" element={<ProfileEditor />} />
    </Routes>
  )
}

export default App
