import { Home, Heart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: '홈',         icon: Home,  path: '/home'      },
  { label: '하트핑',     icon: Heart, path: '/heartpings' },
  { label: '나의 프로필', icon: User,  path: '/profile'   },
];

export default function NavBar() {
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="absolute bottom-0 left-0 w-full px-4 pb-4 z-20 pointer-events-none">
      <div
        className="pointer-events-auto flex justify-around items-center rounded-[24px] p-2"
        style={{
          background:    'rgba(255,255,255,0.25)',
          backdropFilter:'blur(20px)',
          border:        '1px solid rgba(255,255,255,0.4)',
        }}
      >
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center py-2 px-6 rounded-xl transition-all"
            >
              <div
                className="flex items-center justify-center transition-all"
                style={isActive ? {
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  boxShadow: '0 4px 12px rgba(198,42,71,0.25)',
                } : { padding: '6px 14px' }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? '#C62A47' : 'rgba(255,255,255,0.6)' }}
                  fill={isActive && path === '/heartpings' ? 'currentColor' : 'none'}
                />
              </div>
              <span
                className="text-[10px] mt-1 font-medium"
                style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)' }}
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
