import Login from "./components/Login.tsx";

function LoginAffiliate() {
 return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('https://images.pexels.com/photos/32437900/pexels-photo-32437900.jpeg')]">

      <div className="absolute inset-0 bg-gradient-to-b from-[#003194E6] to-[#000000E6]" />

      <div className="relative z-10">
        <Login userType="affiliate" newUserOption={true} />
      </div>

    </div>
  )
}
export default LoginAffiliate;