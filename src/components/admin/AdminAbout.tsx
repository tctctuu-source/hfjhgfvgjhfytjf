import React, { useState, useEffect } from 'react';
import { Save, Edit, Users, Target, Award, Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AboutContent, TeamMember } from '../../types';

const AdminAbout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [content, setContent] = useState<Record<string, string>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [teamFormData, setTeamFormData] = useState({ name: '', position: '', bio: '', image_url: '' });

  const fetchData = async () => {
    setLoading(true);
    const { data: contentData } = await supabase.from('about_content').select('*');
    const contentMap = (contentData || []).reduce((acc, item) => ({ ...acc, [item.section]: item.content }), {});
    setContent(contentMap);

    const { data: teamData } = await supabase.from('team_members').select('*').order('created_at');
    setTeamMembers(teamData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveContent = async (section: string) => {
    const { error } = await supabase
      .from('about_content')
      .upsert({ section: section, content: content[section] }, { onConflict: 'section' });

    if (error) {
      alert(`Error saving content: ${error.message}`);
    } else {
      setIsEditing(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      await supabase.from('team_members').update(teamFormData).eq('id', editingMember.id);
    } else {
      await supabase.from('team_members').insert([teamFormData]);
    }
    await fetchData();
    resetTeamForm();
  };

  const resetTeamForm = () => {
    setTeamFormData({ name: '', position: '', bio: '', image_url: '' });
    setEditingMember(null);
    setShowTeamForm(false);
  };

  const handleEditMember = (member: TeamMember) => {
    setTeamFormData({ name: member.name, position: member.position, bio: member.bio, image_url: member.image_url });
    setEditingMember(member);
    setShowTeamForm(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from('team_members').delete().eq('id', id);
      await fetchData();
    }
  };

  const sections = [
    { key: 'mission', title: 'Mission Statement', icon: Target, color: 'text-red-600' },
    { key: 'vision', title: 'Vision Statement', icon: Award, color: 'text-yellow-600' },
    { key: 'history', title: 'Our History', icon: Users, color: 'text-blue-600' }
  ];

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Manage About Page</h2>
        <p className="text-gray-600">Edit content for the About Us page</p>
      </div>

      {sections.map((section) => (
        <div key={section.key} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3"><section.icon className={`w-6 h-6 ${section.color}`} /><h3 className="text-lg font-semibold text-gray-900">{section.title}</h3></div>
            <button onClick={() => setIsEditing(prev => ({ ...prev, [section.key]: !prev[section.key] }))} className="text-blue-600 hover:text-blue-700 flex items-center gap-2"><Edit className="w-4 h-4" />{isEditing[section.key] ? 'Cancel' : 'Edit'}</button>
          </div>
          {isEditing[section.key] ? (
            <div className="space-y-4">
              <textarea rows={6} value={content[section.key] || ''} onChange={(e) => setContent(prev => ({ ...prev, [section.key]: e.target.value }))} className="w-full p-2 border rounded-lg" />
              <button onClick={() => handleSaveContent(section.key)} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Save className="w-4 h-4" />Save</button>
            </div>
          ) : <p className="text-gray-700 leading-relaxed">{content[section.key]}</p>}
        </div>
      ))}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3"><Users className="w-6 h-6 text-purple-600" /><h3 className="text-lg font-semibold text-gray-900">Team Members</h3></div>
          <button onClick={() => { setEditingMember(null); setShowTeamForm(true); }} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><Plus className="w-5 h-5" />Add Member</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="border rounded-lg p-4 text-center">
              <img src={member.image_url} alt={member.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-red-600 text-sm">{member.position}</p>
              <p className="text-gray-600 text-xs my-2">{member.bio}</p>
              <div className="flex space-x-2 justify-center">
                <button onClick={() => handleEditMember(member)} className="text-blue-600"><Edit size={16} /></button>
                <button onClick={() => handleDeleteMember(member.id)} className="text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showTeamForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{editingMember ? 'Edit' : 'Add'} Team Member</h3>
            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={teamFormData.name} onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})} className="w-full p-2 border rounded" required />
              <input type="text" placeholder="Position" value={teamFormData.position} onChange={(e) => setTeamFormData({...teamFormData, position: e.target.value})} className="w-full p-2 border rounded" required />
              <input type="url" placeholder="Image URL" value={teamFormData.image_url} onChange={(e) => setTeamFormData({...teamFormData, image_url: e.target.value})} className="w-full p-2 border rounded" required />
              <textarea placeholder="Bio" value={teamFormData.bio} onChange={(e) => setTeamFormData({...teamFormData, bio: e.target.value})} className="w-full p-2 border rounded" required />
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded">{editingMember ? 'Update' : 'Add'}</button>
                <button type="button" onClick={resetTeamForm} className="flex-1 bg-gray-300 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
