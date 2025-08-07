import { FaLinkedinIn, FaInstagram } from "react-icons/fa"
import Navbar from "../../components/Navbar"
import dudaImg from '../../assets/img/duda.jpg';
import priscilaImg from '../../assets/img/priscila.jpg';
import miggeImg from '../../assets/img/migge.jpeg';
import melImg from '../../assets/img/mel.jpeg';
import myrellaImg from '../../assets/img/myrella.jpeg';
import silasImg from '../../assets/img/silas.jpeg';
import vanessaImg from '../../assets/img/vanessa.jpg';
import viagium2Img from '../../assets/img/viagium2.jpeg';

function AboutUsPage() {
  const teamMembers = [
    {
      id: 1,
      name: "Maria Eduarda",
      role: "Assoc, Full-Stack Development at Avanade",
      image: dudaImg,
      social: {
        linkedin: "https://www.linkedin.com/in/maria-eduarda-carneiro/",
        instagram: "instagram.com/dudasheep",
      },
    },
    {
      id: 2,
      name: "Maria Priscila",
      role: "Assoc, Full-Stack Development at Avanade",
      image: priscilaImg,
      social: {
        linkedin: "https://www.linkedin.com/in/devpnascimento/",
        instagram: "instagram.com/pnxcnt",
      },
    },
    {
      id: 3,
      name: "Matheus Migge",
      role: "Assoc, Full-Stack Development at Avanade",
      image: miggeImg,
      social: {
        linkedin: "https://www.linkedin.com/in/matheusmigge/",
        instagram: "instagram.com/matheusmigge",
      },
    },
    {
      id: 4,
      name: "Melissa Valentin",
      role: "Assoc, Full-Stack Development at Avanade",
      image: melImg,
      social: {
        linkedin: "https://www.linkedin.com/in/melissavalentindev",
        instagram: "nstagram.com/melissavalentinn",
      },
    },
    {
      id: 5,
      name: "Myrella Gomes",
      role: "Assoc, Full-Stack Development at Avanade",
      image: myrellaImg,
      social: {
        linkedin: "https://www.linkedin.com/in/myrellaggomes/",
        instagram: "nstagram.com/myrella-gomes",
      },
    },
    {
      id: 6,
      name: "Silas Sefas",
      role: "Assoc, Full-Stack Development at Avanade",
      image: silasImg,
      social: {
        linkedin: "https://www.linkedin.com/in/silassefas/",
        instagram: "instagram.com/silassefas1",
      },
    },
    {
      id: 7,
      name: "Vanessa Ribeiro",
      role: "Assoc, Full-Stack Development at Avanade",
      image: vanessaImg,
      social: {
        linkedin: "https://www.linkedin.com/in/vanessaribeiro-/",
        instagram: "instagram.com/_vanessa.ribeiro",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="fixed top-0 left-0 w-full z-50 bg-white">
        <Navbar />
      </div>
      
      {/* About Us Section - Layout and colors inspired by the provided images */}
      <section className="py-12 md:py-20 px-6 md:px-10 bg-[#003194] mt-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-4 pr-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-6">
              Sobre a <span className="text-[#FF6600]">Viagium</span>
            </h1>
            <p className="text-lg md:text-xl text-white mb-4">
              Somos um grupo de desenvolvedores apaixonados por tecnologia e inovação, e estamos transformando uma ideia em realidade com um projeto de agência de viagens, usando uma abordagem centrada no usuário.
            </p>
            <p className="text-lg md:text-xl text-white mb-4">
              Na Viagium, acreditamos que cada viagem é uma história esperando para ser contada. Mais do que uma plataforma digital, estamos construindo uma experiência onde tecnologia e turismo se encontram para criar memórias inesquecíveis.
            </p>
            <p className="text-lg md:text-xl text-white font-semibold">
              Junte-se a nós e descubra o mundo com a Viagium — uma agência feita por quem sonha, para quem ama viajar.
            </p>
          </div>
          <div className="flex justify-center items-center pl-4">
            <img
              src={viagium2Img}
              alt="Grupo Viagium"
              className="rounded-lg shadow-lg object-cover w-full max-w-xl h-auto"
            />
          </div>
        </div>
      </section>

      {/* Team Section - Styling consistent with the overall design */}
      <section className="py-12 md:py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#003194] mb-4">Nossa Equipe</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Conheça as mentes e corações por trás da Viagium, dedicados a tornar suas viagens extraordinárias.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 gap-8 justify-items-center">
            {teamMembers.slice(0, 3).map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center max-w-sm">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="rounded-full w-36 h-36 object-cover mb-4 border-4 border-[#FF6600]"
                />
                <h3 className="text-xl font-semibold text-[#003194]">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex gap-4">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#FF6600]"
                    >
                      <FaLinkedinIn size={24} />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  )}
                  {member.social.instagram && (
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#FF6600]"
                    >
                      <FaInstagram size={24} />
                      <span className="sr-only">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Segunda linha com 4 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center mt-8">
            {teamMembers.slice(3).map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center max-w-sm">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="rounded-full w-36 h-36 object-cover mb-4 border-4 border-[#FF6600]"
                />
                <h3 className="text-xl font-semibold text-[#003194]">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex gap-4">
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#FF6600]"
                    >
                      <FaLinkedinIn size={24} />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  )}
                  {member.social.instagram && (
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[#FF6600]"
                    >
                      <FaInstagram size={24} />
                      <span className="sr-only">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsPage