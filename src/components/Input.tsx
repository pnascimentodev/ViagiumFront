import type { ReactNode } from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  icon: ReactNode;
}

export const Input = ({ type, placeholder, icon }: InputProps) => {
  return (
    <div className="w-full mb-8">
      <div className="relative flex items-center w-full">
        {/* Quadrado do ícone igual ao SVG */}
        <span className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center h-[22px] w-[22px] bg-white border border-[#003194] rounded-[4px]" style={{ left: '10px' }}>
          <span className="text-[#003194] text-lg flex items-center justify-center">
            {icon}
          </span>
        </span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full pr-4 h-[44px] border border-[#003194] rounded-[10px] bg-white text-[#003194] placeholder:uppercase placeholder:text-[#003194] placeholder:font-bold placeholder:text-[15px] focus:outline-none focus:border-[#003194] transition-all"
          style={{ boxShadow: 'none', paddingLeft: '40px' }}
        />
      </div>
    </div>
  );
};
