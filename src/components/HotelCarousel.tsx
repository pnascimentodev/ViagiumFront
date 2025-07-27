import { useKeenSlider } from "keen-slider/react";
import { useState, } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "keen-slider/keen-slider.min.css";

const hotels = [
    {
        name: "Hotel Paris Tower",
        image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
    },
    {
        name: "Hotel Vista Mar",
        image: "https://images.pexels.com/photos/21014/pexels-photo.jpg",
    },
    {
        name: "Hotel Jardim Europa",
        image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
    },
    {
        name: "Hotel Central Palace",
        image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    },
    {
        name: "Hotel Lago Azul",
        image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    },
];

const HotelCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
        loop: true,
        slides: {
            perView: 1.2,
            spacing: 6,
        },
        breakpoints: {
            '(min-width: 640px)': {
                slides: { perView: 1.5, spacing: 8 },
            },
            '(min-width: 768px)': {
                slides: { perView: 2.2, spacing: 10 },
            },
            '(min-width: 1024px)': {
                slides: { perView: 3.2, spacing: 12 },
            },
        },
        slideChanged(slider) {
            setCurrentSlide(slider.track.details.rel);
        },
    });

    return (
        <div className="relative w-full mx-auto">
            <div ref={sliderRef} className="keen-slider rounded-lg overflow-visible">
                {hotels.map((hotel, idx) => (
                    <div key={idx} className="keen-slider__slide flex items-center justify-center">
                        <div className="bg-gray-100 rounded-xl shadow-md flex items-center justify-center w-[100%] h-90 md:h-90 mx-auto transition-transform duration-300 relative overflow-hidden">
                            <img src={hotel.image} alt={hotel.name} className="object-cover w-full h-full rounded-xl" />
                            <div className="absolute inset-0 flex items-center justify-center ">
                                <span className="text-white font-bold text-3xl px-8 py-2 rounded-lg text-center" style={{ textShadow: "2px 2px 8px #000" }}>{hotel.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {/* Paginação (dots) sobre o carrossel */}
                <div className="absolute left-0 right-0 bottom-4 flex justify-center gap-2 z-20 pointer-events-none">
                    {hotels.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-3 h-3 rounded-full transition border border-blue-700 ${currentSlide === idx ? 'bg-blue-700' : 'bg-white'} pointer-events-auto`}
                            aria-label={`Ir para o slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
            {/* Botões de navegação */}
            <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow-md z-10 transition"
                aria-label="Anterior"
            >
                <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-blue-700 rounded-full p-2 shadow-md z-10 transition"
                aria-label="Próximo"
            >
                <FaChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default HotelCarousel;
