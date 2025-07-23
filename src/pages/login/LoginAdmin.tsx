import Login from "./components/Login.tsx";

function LoginAdmin() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('https://images.pexels.com/photos/12271415/pexels-photo-12271415.jpeg')]">

      <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-[#003194e6]"/>

      <div className="relative z-10">
        <Login userType="admin" newUserOption={false} />
      </div>
      
    </div>
  )
}

export default LoginAdmin;