import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { GalleryItem } from '../../types';

const AdminGallery: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Competitions',
    image_url: '',
    photographer: '',
    description: ''
  });

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      console.error('Error fetching gallery:', error);
    } else {
      setGallery(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    let mutationError;

    if (editingItem) {
      const { error } = await supabase
        .from('gallery')
        .update({ ...formData })
        .eq('id', editingItem.id);
      mutationError = error;
    } else {
      const { error } = await supabase
        .from('gallery')
        .insert([{ ...formData, views: 0 }]);
      mutationError = error;
    }
    
    if (mutationError) {
      setFormError(mutationError.message);
    } else {
      await fetchGallery();
      resetForm();
    }
    setIsSubmitting(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Competitions',
      image_url: '',
      photographer: '',
      description: ''
    });
    setEditingItem(null);
    setShowForm(false);
    setFormError(null);
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      category: item.category,
      image_url: item.image_url,
      photographer: item.photographer,
      description: item.description
    });
    setEditingItem(item);
    setShowForm(true);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) {
        alert(`Error deleting photo: ${error.message}`);
      } else {
        await fetchGallery();
      }
    }
  };

  const filteredGallery = gallery.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Gallery</h2>
          <p className="text-gray-600">Upload and manage gallery photos</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); setFormError(null); }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Photo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8"><Loader2 className="w-6 h-6 text-red-600 animate-spin mx-auto" /></div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-600">Error: {error}</div>
        ) : (
          filteredGallery.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative group">
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(item)} className="bg-blue-600 text-white p-2 rounded-full"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white p-2 rounded-full"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{item.category}</span>
                  <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2 truncate">{item.description}</p>
                <p className="text-xs text-gray-500">📸 {item.photographer}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingItem ? 'Edit Photo' : 'Add New Photo'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{formError}</span>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                  <option value="Competitions">Competitions</option>
                  <option value="Cultural Events">Cultural Events</option>
                  <option value="Ceremonies">Ceremonies</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Exhibitions">Exhibitions</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input type="url" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photographer</label>
                <input type="text" value={formData.photographer} onChange={(e) => setFormData({...formData, photographer: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingItem ? 'Update Photo' : 'Add Photo')}
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

export default AdminGallery;
