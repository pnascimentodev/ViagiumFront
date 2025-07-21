import Login from "./components/Login.tsx";

function LoginAdmin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003194]">

      <Login userType="admin" newUserOption={true} />
      
    </div>
  )
}

export default LoginAdmin;