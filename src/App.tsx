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
import AffiliateDashboard from './pages/affiliatedashboard/AffiliateDashboard'
import Package from './pages/package/Package'
import ResetClient from './pages/password/ResetClient'
import ResetAffiliate from './pages/password/ResetAffiliate'
import ProfileEditor from "./pages/profile/profile-editor.tsx";
import Review from './pages/review/Review.tsx'

function App() {
  return (
    <Routes>
      <Route path="/client" element={<LoginClient />} />
      <Route path="/admin" element={<LoginAdmin />} />
      <Route path="/affiliate" element={<LoginAffiliate />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/affiliatepage" element={<AffiliatePage />} />
      <Route path="/footer" element={<Footer/>}/>
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/forgotpassaffiliate" element={<ForgotPassAffiliate />} />
      <Route path="/forgotpassclient" element={<ForgotPassClient />} />
      <Route path="/resetpassclient" element={<ResetClient />} />     
      <Route path="/resetpassaffiliate" element={<ResetAffiliate />} />         
      <Route path="/emailclient" element={<EmailClient />} />
      <Route path="/emailaffiliate" element={<EmailAffiliate />} />
      <Route path="/affiliatedashboard" element={<AffiliateDashboard />} />
      <Route path="/package" element={<Package />} />
      <Route path="/profile" element={<ProfileEditor />} />
      <Route path="/review" element={<Review />} />
    </Routes>
  )
}

export default App
