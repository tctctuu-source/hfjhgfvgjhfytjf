import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Search, Download, Loader2, Trophy, Medal, Award, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Result } from '../../types';

const AdminResults: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<{ event: string; category: string; year: string } | null>(null);

  const initialWinnersData = {
    program: '',
    category: '',
    year: '2025',
    winners: [
      { participant: '', school: '', position: 1 },
      { participant: '', school: '', position: 2 },
      { participant: '', school: '', position: 3 },
    ]
  };

  const [winnersData, setWinnersData] = useState(initialWinnersData);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError("Could not fetch results. Please check your Supabase connection.");
      console.error('Error fetching results:', error);
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleWinnerChange = (index: number, field: 'participant' | 'school', value: string) => {
    const updatedWinners = [...winnersData.winners];
    updatedWinners[index] = { ...updatedWinners[index], [field]: value };
    setWinnersData({ ...winnersData, winners: updatedWinners });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCompetition) {
        const { error: deleteError } = await supabase
          .from('results')
          .delete()
          .match(editingCompetition);
        
        if (deleteError) throw deleteError;
      }

      const resultsToInsert = winnersData.winners
        .filter(winner => winner.participant.trim() !== '')
        .map(winner => ({
          event: winnersData.program,
          category: winnersData.category,
          year: winnersData.year,
          participant: winner.participant,
          school: winner.school,
          position: winner.position,
        }));

      if (resultsToInsert.length > 0) {
        const { error: insertError } = await supabase.from('results').insert(resultsToInsert);
        if (insertError) throw insertError;
      }
      
      await fetchResults();
      resetForm();

    } catch (err: any) {
      alert(`Error saving results. Please check your connection. Details: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setWinnersData(initialWinnersData);
    setEditingCompetition(null);
    setShowForm(false);
  };

  const handleEdit = (competition: { event: string; category: string; year: string; winners: Result[] }) => {
    const winnersFromDb = competition.winners;
    const winnersForForm = [
      { participant: '', school: '', position: 1 },
      { participant: '', school: '', position: 2 },
      { participant: '', school: '', position: 3 },
    ];

    winnersFromDb.forEach(winner => {
      if (winner.position >= 1 && winner.position <= 3) {
        winnersForForm[winner.position - 1].participant = winner.participant;
        winnersForForm[winner.position - 1].school = winner.school;
      }
    });

    setWinnersData({
      program: competition.event,
      category: competition.category,
      year: competition.year,
      winners: winnersForForm,
    });

    setEditingCompetition({
      event: competition.event,
      category: competition.category,
      year: competition.year,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      const { error } = await supabase.from('results').delete().eq('id', id);
      if (error) {
        alert(`Error deleting result. Please check your connection. Details: ${error.message}`);
      } else {
        await fetchResults();
      }
    }
  };

  const groupedResults = useMemo(() => {
    if (!results) return [];
    const groups: { [key: string]: { event: string; category: string; year: string; winners: Result[] } } = {};

    results.forEach(result => {
        const key = `${result.event}-${result.category}-${result.year}`;
        if (!groups[key]) {
            groups[key] = {
                event: result.event,
                category: result.category,
                year: result.year,
                winners: [],
            };
        }
        groups[key].winners.push(result);
    });

    Object.values(groups).forEach(group => {
        group.winners.sort((a, b) => a.position - b.position);
    });

    return Object.values(groups).sort((a, b) => a.event.localeCompare(b.event));
  }, [results]);

  const filteredGroupedResults = useMemo(() => {
    return groupedResults.filter(group =>
        group.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groupedResults, searchTerm]);

  const handleDeleteCompetition = async (event: string, category: string, year: string) => {
    if (window.confirm(`Are you sure you want to delete all results for "${event} - ${category} (${year})"? This action cannot be undone.`)) {
      const { error } = await supabase
        .from('results')
        .delete()
        .match({ event, category, year });

      if (error) {
        alert(`Error deleting competition results. Please check your connection. Details: ${error.message}`);
      } else {
        await fetchResults();
      }
    }
  };

  const handleDownload = () => {
    const resultsToExport = searchTerm 
      ? results.filter(result => 
          filteredGroupedResults.some(group => 
            group.event === result.event && group.category === result.category && group.year === result.year
          )
        )
      : results;

    const headers = ['ID', 'Event', 'Category', 'Year', 'Participant', 'School', 'Position', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...resultsToExport.map(result => [
        `"${result.id}"`,
        `"${result.event.replace(/"/g, '""')}"`,
        `"${result.category.replace(/"/g, '""')}"`,
        `"${result.year}"`,
        `"${result.participant.replace(/"/g, '""')}"`,
        `"${result.school.replace(/"/g, '""')}"`,
        result.position,
        `"${result.created_at}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'muhimmath-results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const winnerCards = [
    { place: '1st Place', icon: Trophy, color: 'yellow', required: true },
    { place: '2nd Place', icon: Medal, color: 'gray', required: false },
    { place: '3rd Place', icon: Award, color: 'amber', required: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Results</h2>
          <p className="text-gray-600">Add, edit, and manage competition results</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Winners
        </button>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search results by program or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Results View */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-12 text-red-600"><h3 className="text-xl font-semibold">Error loading results</h3><p>{error}</p></div>
        ) : filteredGroupedResults.length > 0 ? (
          filteredGroupedResults.map((group) => (
            <div key={`${group.event}-${group.category}-${group.year}`} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4 border-b pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{group.event}</h3>
                  <p className="text-sm text-gray-500">{group.category} - {group.year}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
                    title="Edit this competition's winners"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompetition(group.event, group.category, group.year)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete all results for this competition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {group.winners.map((winner) => (
                  <div key={winner.id} className={`p-4 rounded-lg flex justify-between items-start ${
                    winner.position === 1 ? 'bg-yellow-50 border border-yellow-200' :
                    winner.position === 2 ? 'bg-gray-100 border border-gray-200' :
                    'bg-orange-50 border border-orange-200'
                  }`}>
                    <div>
                      <div className="font-bold text-lg">{winner.position === 1 ? '1st' : winner.position === 2 ? '2nd' : '3rd'} Place</div>
                      <div className="font-semibold text-gray-900">{winner.participant}</div>
                      <div className="text-sm text-gray-600">{winner.school || 'Individual'}</div>
                    </div>
                    <button
                      onClick={() => handleDelete(winner.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0 ml-2"
                      title="Delete this winner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold">No Results Found</h3>
            <p>Try clearing your search or adding new results.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Winners Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCompetition ? 'Edit Winners' : 'Add Winners'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Program and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={winnersData.program}
                    onChange={(e) => setWinnersData({...winnersData, program: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter program name"
                    required
                    disabled={!!editingCompetition}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={winnersData.category}
                    onChange={(e) => setWinnersData({...winnersData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={!!editingCompetition}
                  >
                    <option value="">Select Category</option>
                    <option value="General">General</option>
                    <option value="High Zone">High Zone</option>
                    <option value="Mid Zone">Mid Zone</option>
                    <option value="Low Zone">Low Zone</option>
                  </select>
                </div>
              </div>

              {/* Winner Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Winner Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {winnerCards.map((card, index) => (
                    <div key={card.place} className={`rounded-lg border-2 p-6
                      ${card.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' : ''}
                      ${card.color === 'gray' ? 'bg-gray-100 border-gray-200' : ''}
                      ${card.color === 'amber' ? 'bg-amber-50 border-amber-200' : ''}
                    `}>
                      <div className="flex items-center gap-3 mb-4">
                        <card.icon className={`w-6 h-6 
                          ${card.color === 'yellow' ? 'text-yellow-500' : ''}
                          ${card.color === 'gray' ? 'text-gray-500' : ''}
                          ${card.color === 'amber' ? 'text-amber-600' : ''}
                        `} />
                        <h5 className="font-bold text-lg text-gray-800">{card.place}</h5>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Participant Name {card.required && <span className="text-red-500">*</span>}
                          </label>
                          <input
                            type="text"
                            value={winnersData.winners[index].participant}
                            onChange={(e) => handleWinnerChange(index, 'participant', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            placeholder="Enter participant name"
                            required={card.required}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Team Name
                          </label>
                          <input
                            type="text"
                            value={winnersData.winners[index].school}
                            onChange={(e) => handleWinnerChange(index, 'school', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            placeholder="Enter team name"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white text-gray-700 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-800 text-white py-2 px-6 rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingCompetition ? 'Update Winners' : 'Add Winners')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
