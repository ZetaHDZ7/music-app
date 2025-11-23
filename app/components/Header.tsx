import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';

const Header: React.FC = () => {
  return (
    <header className="bg-secondary-dark shadow-lg text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold text-white hover:text-accent-pink transition-colors duration-300">
          🎶 APP MUSIC
        </Link>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;