import Login from "./components/Login.tsx";

function LoginClient() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg')]">

      <div className="absolute inset-0 bg-gradient-to-b from-[#FFA62BE6] to-[#000000E6]" />

      <div className="relative z-10">
        <Login userType="client" newUserOption={true} />
      </div>

    </div>
  )
}
export default LoginClient;