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
import RoomType from './pages/roomtype/RoomType'
import HomePage from './pages/home/HomePage'
import AffiliateDashboard from './pages/affiliatedashboard/AffiliateDashboard'
import Package from './pages/package/Package'
import ResetClient from './pages/password/ResetClient'
import ResetAffiliate from './pages/password/ResetAffiliate'
import ProfileEditor from "./pages/profile/profile-editor.tsx";
import AdminDashboard from './pages/admindashboard/AdminDashboard.tsx'
import FAQSection from './pages/faqsection/FaqSection.tsx'
import Review from './pages/review/Review.tsx'
import Payment from './pages/payment/Payment.tsx'
import PackageSearch from './pages/package-search/packageSearch.tsx'
import Reservation from './pages/reservation/Reservation.tsx'
import TravelHistoryPage from './pages/travelhistory/TravelHistoryPage.tsx'
import AboutUsPage from './pages/about-us/aboutus.tsx'
import RoomTypeManagement from "./pages/roomtype/RoomTypeManagement.tsx";
import PrivacyPolicyPage from './pages/policyandprivate/privacy-policy.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/client" element={<LoginClient />} />
      <Route path="/admin" element={<LoginAdmin />} />
      <Route path="/affiliate" element={<LoginAffiliate />} />
      <Route path="/register" element={<Register />} />
      <Route path="/affiliatepage" element={<AffiliatePage />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/forgotpassaffiliate" element={<ForgotPassAffiliate />} />
      <Route path="/forgotpassclient" element={<ForgotPassClient />} />
      <Route path="/resetpassclient" element={<ResetClient />} />
      <Route path="/resetpassaffiliate" element={<ResetAffiliate />} />
      <Route path="/emailclient" element={<EmailClient />} />
      <Route path="/emailaffiliate" element={<EmailAffiliate />} />
      <Route path='/roomtype' element={<RoomType />} />
      <Route path="/affiliatedashboard" element={<AffiliateDashboard />} />
      <Route path="/package/:packageId" element={<Package />} />
      <Route path="/profile" element={<ProfileEditor />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/faq" element={<FAQSection />} />
      <Route path="/review" element={<Review />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/packagesearch" element={<PackageSearch />} />
      <Route path="/reservation" element={<Reservation />} />
      <Route path="/roomtypemanagement" element={<RoomTypeManagement />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/travelhistory" element={<TravelHistoryPage />} />
      <Route path="/aboutus" element={<AboutUsPage />} />
    </Routes>
  )
}

export default App
