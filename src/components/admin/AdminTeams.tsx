import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, Users, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Team } from '../../types';

const AdminTeams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', points: 0 });

  const fetchTeams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('points', { ascending: false });

    if (error) {
      setError("Could not fetch teams. Please check your Supabase connection.");
      console.error('Error fetching teams:', error);
    } else {
      setTeams(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const mutation = editingTeam
      ? supabase.from('teams').update({ ...formData }).eq('id', editingTeam.id)
      : supabase.from('teams').insert([{ ...formData }]);
      
    const { error } = await mutation;
    
    if (error) {
      alert(`Error saving team. Please check your connection. Details: ${error.message}`);
    } else {
      await fetchTeams();
      resetForm();
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({ name: '', points: 0 });
    setEditingTeam(null);
    setShowForm(false);
  };

  const handleEdit = (team: Team) => {
    setFormData({ name: team.name, points: team.points });
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) {
        alert(`Error deleting team. Please check your connection. Details: ${error.message}`);
      } else {
        await fetchTeams();
      }
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Teams</h2>
          <p className="text-gray-600">Add, edit, and manage team points</p>
        </div>
        <button
          onClick={() => { setEditingTeam(null); setShowForm(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Team
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8"><Loader2 className="w-6 h-6 text-red-600 animate-spin mx-auto" /></td></tr>
              ) : error ? (
                 <tr><td colSpan={4} className="text-center py-8 text-red-600">{error}</td></tr>
              ) : (
                filteredTeams.map((team, index) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-bold">{index + 1}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium text-gray-900">{team.name}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">{team.points}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(team)} className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(team.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingTeam ? 'Edit Team' : 'Add New Team'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Users size={16} /> Team Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><Award size={16} /> Points</label>
                <input type="number" value={formData.points} onChange={(e) => setFormData({...formData, points: parseInt(e.target.value, 10) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingTeam ? 'Update Team' : 'Add Team')}
                </button>
                <button type="button" onClick={resetForm} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeams;
