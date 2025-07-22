import Login from "./components/Login.tsx";

function LoginClient() {
  return(
  <div
    className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
    style={{backgroundImage: `linear-gradient(to bottom, rgba(255, 166, 43, 0.9), rgba(0, 0, 0, 0.9)),
      url('https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg')`,
    backgroundSize: "cover",
          backgroundPosition: "center",}}>
          <Login userType="client" newUserOption={true} />
    </div>
  )
}
export default LoginClient;