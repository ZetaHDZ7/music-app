import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Importa Link para asegurar que el enlace sea de Next.js


interface MusicCardProps {
  title: string;
  artist: string;
  imageUrl: string;
  releaseDate?: string;
  link?: string; // Opcional para enlazar a detalles
}

const MusicCard: React.FC<MusicCardProps> = ({ title, artist, imageUrl, releaseDate, link }) => {
  return (
    <div className="bg-secondary-dark rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-700">
      <div className="relative w-full h-48 sm:h-56 lg:h-64">
        <Image
          src={imageUrl}
          alt={`Portada de ${title} por ${artist}`}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-accent-purple mb-1 truncate">{title}</h3>
        <p className="text-text-gray text-sm mb-2 truncate">{artist}</p>
        {releaseDate && (
          <p className="text-gray-400 text-xs">Lanzamiento: {releaseDate}</p>
        )}
        {link && (
          <div className="mt-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent-pink text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors duration-300"
            >
              Escuchar Ahora
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicCard;