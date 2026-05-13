import Heartmoong from '../assets/heartmoong.png';

interface SumungMascotProps {
  className?: string;
}

export default function SumungMascot({ className = "w-36 h-40" }: SumungMascotProps) {
  return (
    <img
      src={Heartmoong}
      alt="수뭉이"
      className={`${className} object-contain drop-shadow-xl`}
    />
  );
}
