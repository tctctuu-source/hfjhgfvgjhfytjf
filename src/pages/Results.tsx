import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Trophy, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Result, Team } from '../types';
import PosterModal from '../components/PosterModal';

const Results: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [activeTab, setActiveTab] = useState<'program' | 'team'>('program');
  const [posterModalData, setPosterModalData] = useState<{ program: { event: string; category: string }; winners: Result[] } | null>(null);

  const years = ['2025', '2024', '2023'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const fetchPromises = [
        supabase.from('results').select('*').eq('year', selectedYear).order('created_at', { ascending: false }),
        supabase.from('teams').select('*').order('points', { ascending: false })
      ];
      
      const [resultsResponse, teamsResponse] = await Promise.all(fetchPromises);

      if (resultsResponse.error) {
        setError(resultsResponse.error.message);
        console.error("Error fetching results:", resultsResponse.error);
      } else {
        setResults(resultsResponse.data || []);
      }

      if (teamsResponse.error) {
        setError(teamsResponse.error.message);
        console.error("Error fetching teams:", teamsResponse.error);
      } else {
        setTeams(teamsResponse.data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedYear]);

  const uniquePrograms = useMemo(() => {
    if (!results) return [];
    const programMap = new Map<string, { event: string; category: string }>();
    results.forEach(result => {
      const key = `${result.event}-${result.category}`;
      if (!programMap.has(key)) {
        programMap.set(key, {
          event: result.event,
          category: result.category,
        });
      }
    });
    return Array.from(programMap.values()).sort((a, b) => a.event.localeCompare(b.event));
  }, [results]);

  const filteredPrograms = useMemo(() => {
    return uniquePrograms.filter(p =>
      p.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniquePrograms, searchTerm]);

  const filteredTeams = useMemo(() => {
    return teams.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [teams, searchTerm]);

  const rankColors = [
    { bg: 'bg-cyan-500', gradient: 'from-cyan-400 to-cyan-600' },
    { bg: 'bg-lime-500', gradient: 'from-lime-400 to-lime-600' },
    { bg: 'bg-amber-500', gradient: 'from-amber-400 to-amber-600' },
    { bg: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600' },
    { bg: 'bg-red-500', gradient: 'from-red-400 to-red-600' },
  ];
  
  const handleProgramClick = (program: { event: string; category: string }) => {
    const programWinners = results.filter(r => r.event === program.event && r.category === program.category);
    setPosterModalData({ program, winners: programWinners });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Results {selectedYear}</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `Published ${activeTab === 'program' ? filteredPrograms.length : filteredTeams.length} results`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('program')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'program' ? 'bg-yellow-400 text-black shadow' : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Trophy size={16} /> Program
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`px-6 py-2 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === 'team' ? 'bg-yellow-400 text-black shadow' : 'text-gray-600 hover:bg-gray-300'
                }`}
              >
                <Users size={16} /> Team
              </button>
            </div>
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search by ${activeTab === 'program' ? 'program or category' : 'team name'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-12 text-red-600"><h3 className="text-xl font-semibold">Error loading results</h3><p>{error}</p></div>
        ) : (
          <>
            {activeTab === 'program' && (
              <motion.div key="program-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                {filteredPrograms.length === 0 ? (
                  <div className="text-center py-12"><div className="text-gray-400 text-6xl mb-4">🔍</div><h3 className="text-xl font-semibold text-gray-600 mb-2">No Programs Found</h3><p className="text-gray-500">Try adjusting your search criteria.</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrograms.map((program, index) => (
                      <motion.div
                        key={`${program.event}-${program.category}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: (index % 12) * 0.05 }}
                        onClick={() => handleProgramClick(program)}
                        className="bg-gray-100 rounded-lg border border-gray-300 p-4 flex items-center space-x-4 hover:shadow-md hover:border-black transition-all cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">{index + 1}</div>
                        <div><h3 className="font-semibold text-gray-900 uppercase tracking-wide">{program.event}</h3><p className="text-sm text-gray-600 uppercase">{program.category}</p></div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div key="team-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                {filteredTeams.length === 0 ? (
                  <div className="text-center py-12"><div className="text-gray-400 text-6xl mb-4">👥</div><h3 className="text-xl font-semibold text-gray-600 mb-2">No Teams Found</h3><p className="text-gray-500">Try adjusting your search criteria.</p></div>
                ) : (
                  <div className="space-y-5">
                    {filteredTeams.map((team, index) => {
                      const color = rankColors[index % rankColors.length];
                      return (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, x: -50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.08 }}
                          className="bg-gray-200 rounded-full p-1.5 shadow-inner"
                        >
                          <div className={`relative flex items-center h-16 rounded-full shadow-md ${color.bg}`}>
                            <div className={`z-10 flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center border-4 border-white/50 shadow-lg bg-gradient-to-b ${color.gradient}`}>
                              <span className="text-white font-bold text-3xl" style={{ textShadow: '0 2px 3px rgba(0,0,0,0.4)' }}>
                                {String(index + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="flex-grow h-full bg-white rounded-r-full flex justify-between items-center ml-[-45px] pl-[60px] pr-6">
                              <span className="text-lg md:text-xl font-bold text-gray-800 truncate">{team.name}</span>
                              <div className="text-right">
                                <span className="text-xl md:text-2xl font-bold text-gray-900">{team.points}</span>
                                <span className="text-xs font-medium text-gray-500 block">Points</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
      <PosterModal 
        isOpen={!!posterModalData}
        onClose={() => setPosterModalData(null)}
        data={posterModalData}
      />
    </div>
  );
};

export default Results;
