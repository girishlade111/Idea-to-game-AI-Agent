import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/create-game', label: 'Create' },
    { to: '/gallery', label: 'Gallery' },
  ];

  return (
    <header
      className={`py-4 px-6 flex items-center justify-between transition-opacity duration-700 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Link
        to="/"
        className="font-bold text-white text-2xl md:text-3xl tracking-widest hover:text-arcade-purple transition-colors"
        style={{ fontFamily: 'Arial', letterSpacing: '0.2em' }}
      >
        ENGINE ARCADE
      </Link>

      <nav className="flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`text-sm md:text-base font-medium transition-colors ${
              location.pathname === link.to
                ? 'text-arcade-purple'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
