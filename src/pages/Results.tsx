import React, { useState, useEffect, useMemo } from 'react';
import { Search, Loader2, Trophy, Users, Award, Medal, Star } from 'lucide-react';
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
      
      try {
        const fetchPromises = [
          supabase.from('results').select('*').eq('year', selectedYear).order('created_at', { ascending: false }),
          supabase.from('teams').select('*').order('points', { ascending: false })
        ];
        
        const [resultsResponse, teamsResponse] = await Promise.all(fetchPromises);

        if (resultsResponse.error) throw resultsResponse.error;
        setResults(resultsResponse.data || []);

        if (teamsResponse.error) throw teamsResponse.error;
        setTeams(teamsResponse.data || []);

      } catch (err: any) {
        setError("Could not fetch results. Please ensure your Supabase project is connected and running.");
        console.error("Error fetching results data:", err);
      } finally {
        setLoading(false);
      }
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

  const programCardColors = [
    { topBg: 'bg-yellow-400', circleBg: 'bg-yellow-500', textColor: 'text-yellow-600', icon: Trophy },
    { topBg: 'bg-orange-400', circleBg: 'bg-orange-500', textColor: 'text-orange-600', icon: Award },
    { topBg: 'bg-sky-400', circleBg: 'bg-sky-500', textColor: 'text-sky-600', icon: Medal },
    { topBg: 'bg-teal-400', circleBg: 'bg-teal-500', textColor: 'text-teal-600', icon: Star },
    { topBg: 'bg-red-400', circleBg: 'bg-red-500', textColor: 'text-red-600', icon: Users },
    { topBg: 'bg-purple-400', circleBg: 'bg-purple-500', textColor: 'text-purple-600', icon: Award },
    { topBg: 'bg-pink-400', circleBg: 'bg-pink-500', textColor: 'text-pink-600', icon: Medal },
    { topBg: 'bg-green-400', circleBg: 'bg-green-500', textColor: 'text-green-600', icon: Star },
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">Results {selectedYear}</h1>
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
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
              <h3 className="font-bold">Connection Error</h3>
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'program' && (
              <motion.div key="program-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                {filteredPrograms.length === 0 ? (
                  <div className="text-center py-12"><div className="text-gray-400 text-6xl mb-4">🔍</div><h3 className="text-xl font-semibold text-gray-600 mb-2">No Programs Found</h3><p className="text-gray-500">Try adjusting your search criteria.</p></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                    {filteredPrograms.map((program, index) => {
                      const color = programCardColors[index % programCardColors.length];
                      const Icon = color.icon;
                      
                      return (
                        <motion.div
                          key={`${program.event}-${program.category}`}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: (index % 16) * 0.05 }}
                          className="h-full"
                          onClick={() => handleProgramClick(program)}
                        >
                          <div className="relative bg-white rounded-2xl shadow-lg pt-14 pb-8 px-6 text-center h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col">
                            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-14 ${color.topBg} rounded-full shadow-md`}>
                              <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg border-4 border-white ${color.circleBg}`}>
                                {String(index + 1).padStart(2, '0')}
                              </div>
                            </div>
                            
                            <div className="flex-grow flex flex-col justify-center items-center">
                                <Icon className={`w-12 h-12 mx-auto mb-4 ${color.textColor}`} />
                                <h3 className={`font-bold text-lg text-gray-800 uppercase`}>{program.event}</h3>
                                <p className="text-sm text-gray-500 mt-1">{program.category}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
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
