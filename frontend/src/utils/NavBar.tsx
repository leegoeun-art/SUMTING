import { Home, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: '홈',         icon: Home,  path: '/home'       },
  { label: '하트핑',     icon: Heart, path: '/heartpings'  },
  { label: '나의 프로필', icon: User,  path: '/profile'    },
];

export default function NavBar() {
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="absolute bottom-0 left-0 w-full px-4 pb-4 z-20 pointer-events-none">
      <div
        className="pointer-events-auto flex justify-around items-center rounded-[24px] p-2"
        style={{
          background: 'rgba(18, 12, 40, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center py-2 px-6 rounded-xl transition-colors"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-white' : 'text-gray-500'}
                fill={isActive && path === '/heartpings' ? 'currentColor' : 'none'}
              />
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
