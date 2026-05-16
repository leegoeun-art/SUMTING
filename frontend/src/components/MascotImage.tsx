import imgBasic      from '../assets/basic.png';
import imgBusiness   from '../assets/business.png';
import imgComputer   from '../assets/computer.png';
import imgArt        from '../assets/art.png';
import imgMusic      from '../assets/music.png';
import imgSport      from '../assets/sport.png';
import imgRibbonBoy  from '../assets/ribbonboy.png';
import imgRibbonGirl from '../assets/ribbongirl.png';

const MASCOT_IMAGES: Record<string, string> = {
  basic:      imgBasic,
  business:   imgBusiness,
  computer:   imgComputer,
  art:        imgArt,
  music:      imgMusic,
  sport:      imgSport,
  ribbonboy:  imgRibbonBoy,
  ribbongirl: imgRibbonGirl,
};

interface MascotImageProps {
  type: string;
  className?: string;
}

export default function MascotImage({ type, className = "" }: MascotImageProps) {
  const src = MASCOT_IMAGES[type] ?? imgBasic;
  return (
    <img src={src} alt="수뭉이" className={`object-contain ${className}`} />
  );
}
