import { motion } from 'motion/react';

interface MascotImageProps {
  type: string;
  className?: string;
}

export default function MascotImage({ type, className = "" }: MascotImageProps) {
  // Simple adorable SVG mascot
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Shadow */}
        <ellipse cx="50" cy="85" rx="30" ry="5" fill="rgba(0,0,0,0.1)" />
        
        {/* Body */}
        <path
          d="M20,70 C20,30 30,10 50,10 C70,10 80,30 80,70 C80,85 70,90 50,90 C30,90 20,85 20,70 Z"
          fill={type === 'shy' ? '#FFE4E1' : 
                type === 'cool' ? '#E0FFFF' : 
                type === 'heart' ? '#FFF0F5' : '#FFFFFF'}
          stroke="#000"
          strokeWidth="0.5"
        />

        {/* Eyes */}
        {type === 'cool' ? (
          <rect x="30" y="35" width="40" height="8" rx="2" fill="#000" />
        ) : type === 'shy' ? (
          <>
            <path d="M35,38 Q40,35 45,38" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
            <path d="M55,38 Q60,35 65,38" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="40" cy="40" r="3" fill="#000" />
            <circle cx="60" cy="40" r="3" fill="#000" />
          </>
        )}

        {/* Blushing */}
        <circle cx="35" cy="50" r="5" fill="#FFB6C1" opacity="0.6" />
        <circle cx="65" cy="50" r="5" fill="#FFB6C1" opacity="0.6" />

        {/* Mouth */}
        <path d="M45,55 Q50,60 55,55" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />

        {/* Extras */}
        {type === 'heart' && (
          <path 
            d="M50,75 C50,75 45,70 45,67 C45,64 48,64 50,66 C52,64 55,64 55,67 C55,70 50,75 50,75" 
            fill="#FF69B4" 
          />
        )}
      </svg>
    </motion.div>
  );
}
