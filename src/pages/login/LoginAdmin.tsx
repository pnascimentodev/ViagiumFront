import Login from "./components/Login.tsx";

function LoginAdmin() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, #FFFFFFE6, #003194E6),
url('https://images.pexels.com/photos/12271415/pexels-photo-12271415.jpeg')`,
      }}>

      <Login userType="admin" newUserOption={true} />

    </div>
  )
}

export default LoginAdmin;