import ModalHotel from "./components/ModalHotel";

function PaginaTeste() {

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-[url('https://images.pexels.com/photos/13644895/pexels-photo-13644895.jpeg')]">

      <div className="absolute inset-0 bg-gradient-to-b from-[#FFA62BE6] to-[#000000E6]" />

      <div className="relative z-10">
        <ModalHotel />
      </div>
      
    </div>
  )
}
export default PaginaTeste;