import React from 'react';
import Heartmoong from '../assets/heartmoong.png';

interface SumungMascotProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function SumungMascot({ className = "w-36 h-40", style }: SumungMascotProps) {
  return (
    <img
      src={Heartmoong}
      alt="수뭉이"
      className={`${className} object-contain drop-shadow-xl`}
      style={style}
    />
  );
}
