import React from 'react';
import { Result } from '../../types';

interface PosterProps {
  program: { event: string; category: string };
  winners: Result[];
}

const Poster3: React.FC<PosterProps> = ({ program, winners }) => {
  const winner1 = winners.find(w => w.position === 1);
  const winner2 = winners.find(w => w.position === 2);
  const winner3 = winners.find(w => w.position === 3);

  return (
    <div className="w-full h-full bg-gradient-to-br from-red-800 via-purple-800 to-indigo-900 text-white font-sans flex flex-col justify-between p-8 relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] opacity-20"></div>
      <header className="relative">
        <h2 className="text-2xl font-bold uppercase tracking-widest">{program.event}</h2>
        <p className="text-indigo-300 font-medium">{program.category}</p>
      </header>
      
      <main className="relative">
        {winner1 && (
          <div className="text-center">
            <p className="text-yellow-300 text-lg font-semibold">WINNER</p>
            <h3 className="text-4xl font-black text-white my-1 truncate">{winner1.participant}</h3>
            <p className="text-yellow-300 text-lg font-semibold truncate">{winner1.school}</p>
          </div>
        )}
      </main>
      
      <footer className="relative">
        <div className="flex justify-between items-center text-center">
          {winner2 && (
            <div>
              <p className="text-gray-300 font-semibold">2nd Place</p>
              <h4 className="text-xl font-bold truncate">{winner2.participant}</h4>
            </div>
          )}
          {winner3 && (
            <div>
              <p className="text-gray-300 font-semibold">3rd Place</p>
              <h4 className="text-xl font-bold truncate">{winner3.participant}</h4>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Poster3;
