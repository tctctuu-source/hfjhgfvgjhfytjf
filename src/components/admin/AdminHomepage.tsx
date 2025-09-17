import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Loader2, Image, Video, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HomepageBackground } from '../../types';

const AdminHomepage: React.FC = () => {
  const [backgrounds, setBackgrounds] = useState<HomepageBackground[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    url: ''
  });

  const fetchBackgrounds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('homepage_background')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError("Could not fetch backgrounds. Please check your Supabase connection.");
    } else {
      setBackgrounds(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('homepage_background').insert([formData]);
    if (error) {
      alert(`Error adding background. Please check your connection. Details: ${error.message}`);
    } else {
      await fetchBackgrounds();
      resetForm();
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({ type: 'image', url: '' });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this background?')) {
      const { error } = await supabase.from('homepage_background').delete().eq('id', id);
      if (error) {
        alert(`Error deleting background. Please check your connection. Details: ${error.message}`);
      } else {
        await fetchBackgrounds();
      }
    }
  };

  const handleSetActive = async (id: string) => {
    // This is a simplified transaction. For production, a db function (RPC) is safer.
    // 1. Deactivate all others
    const { error: deactivateError } = await supabase
      .from('homepage_background')
      .update({ is_active: false })
      .eq('is_active', true);
    
    if (deactivateError) {
      alert(`Error deactivating old background. Please check your connection. Details: ${deactivateError.message}`);
      return;
    }

    // 2. Activate the new one
    const { error: activateError } = await supabase
      .from('homepage_background')
      .update({ is_active: true })
      .eq('id', id);
      
    if (activateError) {
      alert(`Error activating new background. Please check your connection. Details: ${activateError.message}`);
    } else {
      await fetchBackgrounds();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Homepage Background</h2>
          <p className="text-gray-600">Manage the hero section's background image or video.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Background
        </button>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4" role="alert">
        <div className="flex">
          <div className="py-1"><AlertTriangle className="w-5 h-5 mr-3" /></div>
          <div>
            <p className="font-bold">Important Note</p>
            <p className="text-sm">Only one background can be active at a time. Setting a new background as active will automatically deactivate the current one.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8"><Loader2 className="w-6 h-6 text-red-600 animate-spin mx-auto" /></td></tr>
              ) : error ? (
                 <tr><td colSpan={5} className="text-center py-8 text-red-600">{error}</td></tr>
              ) : (
                backgrounds.map((bg) => (
                  <tr key={bg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {bg.type === 'image' ? (
                        <img src={bg.url} alt="background preview" className="w-24 h-16 object-cover rounded-md" />
                      ) : (
                        <div className="w-24 h-16 bg-gray-800 rounded-md flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${bg.type === 'image' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>{bg.type}</span></td>
                    <td className="px-6 py-4"><a href={bg.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs block">{bg.url}</a></td>
                    <td className="px-6 py-4">{bg.is_active ? <span className="text-green-600 font-bold flex items-center gap-1"><CheckCircle size={16}/> Active</span> : 'Inactive'}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {!bg.is_active && <button onClick={() => handleSetActive(bg.id)} className="text-green-600 hover:text-green-900">Set Active</button>}
                        <button onClick={() => handleDelete(bg.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Background</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value as 'image' | 'video'})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input type="url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required placeholder="https://example.com/image.jpg" />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add Background'}
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

export default AdminHomepage;
