import React from 'react';
import { Result } from '../../types';

interface PosterProps {
  program: { event: string; category: string };
  winners: Result[];
}

const Poster4: React.FC<PosterProps> = ({ program, winners }) => {
  return (
    <div className="w-full h-full bg-[#F3EADF] text-[#4A3F35] font-serif p-8 flex flex-col items-center text-center border-8 border-double border-[#D6C6B3]">
      <header className="w-full">
        <p className="text-sm tracking-[0.2em] uppercase">SSF DAAWA SECTOR</p>
        <h1 className="text-5xl font-bold my-4">MUHIMMATH</h1>
        <div className="w-24 h-px bg-[#D6C6B3] mx-auto"></div>
      </header>
      
      <main className="flex-grow flex flex-col justify-center items-center w-full">
        <h2 className="text-2xl font-semibold mb-2">{program.event}</h2>
        <p className="text-lg mb-6">{program.category}</p>
        
        <div className="space-y-4 w-full">
          {winners.sort((a,b) => a.position - b.position).map(winner => (
            <div key={winner.id}>
              <p className="text-xl font-medium">{winner.participant}</p>
              <p className="text-sm text-gray-600">{winner.position === 1 ? 'First Place' : winner.position === 2 ? 'Second Place' : 'Third Place'}</p>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="w-full">
        <div className="w-24 h-px bg-[#D6C6B3] mx-auto"></div>
        <p className="text-sm mt-4">Results of 2025</p>
      </footer>
    </div>
  );
};

export default Poster4;
