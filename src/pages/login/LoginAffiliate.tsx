import Login from "./components/Login.tsx";

function LoginAffiliate() {
    return (
        <div className="min-h-screen flex items-center justify-center"
        style={{backgroundImage: `linear-gradient(to bottom, rgba(0, 49, 148, 0.9), rgba(0, 0, 0, 0.9)),
        url('https://images.pexels.com/photos/32437900/pexels-photo-32437900.jpeg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",}}>

        <Login userType="affiliate" newUserOption={true} />
        
        </div>
  )
}
export default LoginAffiliate;