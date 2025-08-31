import React from 'react';
import { Result } from '../../types';
import { Trophy } from 'lucide-react';

interface PosterProps {
  program: { event: string; category: string };
  winners: Result[];
}

const Poster5: React.FC<PosterProps> = ({ program, winners }) => {
  const winner1 = winners.find(w => w.position === 1);
  const otherWinners = winners.filter(w => w.position > 1).sort((a,b) => a.position - b.position);

  return (
    <div className="w-full h-full bg-red-800 text-white font-sans p-8 flex flex-col">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">RESULTS</h1>
        <div className="text-right">
          <p className="font-bold text-yellow-300">MUHIMMATH</p>
          <p className="text-xs">SSF DAAWA SECTOR</p>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col justify-center items-center text-center -mt-8">
        <h2 className="text-2xl font-bold uppercase">{program.event}</h2>
        <p className="text-lg text-red-200 mb-4">{program.category}</p>
        
        {winner1 && (
          <div className="bg-yellow-400 text-black p-4 rounded-lg w-full mb-4">
            <Trophy className="mx-auto w-8 h-8 mb-2" />
            <p className="font-bold text-2xl truncate">{winner1.participant}</p>
            <p className="text-sm font-medium truncate">{winner1.school}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 w-full">
          {otherWinners.map(winner => (
            <div key={winner.id} className="bg-white/10 p-3 rounded-lg">
              <p className="font-semibold text-sm truncate">{winner.participant}</p>
              <p className="text-xs text-red-200 truncate">{winner.school}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Poster5;
