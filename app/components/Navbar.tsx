'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="text-text-light">
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-accent-purple transition-colors duration-300">
          Inicio
        </Link>
        <Link href="#" className="hover:text-accent-purple transition-colors duration-300">
          Artistas
        </Link>
        <Link href="#" className="hover:text-accent-purple transition-colors duration-300">
          Lanzamientos
        </Link>
        <Link href="/contact" className="hover:text-accent-purple transition-colors duration-300">
          Contacto
        </Link>
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="text-text-light focus:outline-none focus:ring-2 focus:ring-accent-purple rounded-md p-1">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 right-4 bg-secondary-dark p-4 rounded-lg shadow-xl z-50 animate-fade-in-down">
          <Link href="/" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded-md transition-colors duration-200" onClick={() => setIsOpen(false)}>
            Inicio
          </Link>
          <Link href="/artists" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded-md transition-colors duration-200" onClick={() => setIsOpen(false)}>
            Artistas
          </Link>
          <Link href="/releases" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded-md transition-colors duration-200" onClick={() => setIsOpen(false)}>
            Lanzamientos
          </Link>
          <Link href="/contact" className="block py-2 px-4 text-sm hover:bg-gray-700 rounded-md transition-colors duration-200" onClick={() => setIsOpen(false)}>
            Contacto
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;