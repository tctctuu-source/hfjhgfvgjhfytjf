import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Trash2, Reply, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ContactMessage } from '../../types';

const AdminContact: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError("Could not fetch messages. Please check your Supabase connection.");
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) alert(`Error deleting message. Details: ${error.message}`);
      else await fetchMessages();
    }
  };

  const updateStatus = async (id: string, status: 'read' | 'replied') => {
    const { error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id);
    if (error) alert(`Error updating status. Details: ${error.message}`);
    else await fetchMessages();
  };

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      updateStatus(message.id, 'read');
    }
  };

  const sendReply = () => {
    if (selectedMessage && replyText.trim()) {
      // In a real app, this would send an email. Here we just update the status.
      updateStatus(selectedMessage.id, 'replied');
      setSelectedMessage(null);
      setReplyText('');
      alert('Reply marked as sent!');
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
          <p className="text-gray-600">Manage and respond to contact form submissions</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">{messages.filter(m => m.status === 'unread').length} Unread</span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{messages.filter(m => m.status === 'read').length} Read</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{messages.filter(m => m.status === 'replied').length} Replied</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Search messages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8"><Loader2 className="w-6 h-6 text-red-600 animate-spin mx-auto" /></td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="text-center py-8 text-red-600">{error}</td></tr>
              ) : (
                filteredMessages.map((message) => (
                  <tr key={message.id} className={`hover:bg-gray-50 ${message.status === 'unread' ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{message.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" />{message.email}</div>
                        {message.phone && <div className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{message.phone}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{message.subject}</span></td>
                    <td className="px-6 py-4"><p className="text-gray-900 truncate max-w-xs">{message.message}</p></td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(message.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>{message.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleReply(message)} className="text-blue-600 hover:text-blue-900" title="Reply"><Reply className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(message.id)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reply to {selectedMessage.name}</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Original Message:</h4>
              <p className="text-gray-700 text-sm">{selectedMessage.message}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Reply</label>
                <textarea rows={6} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Type your reply here..." />
              </div>
              <div className="flex space-x-3">
                <button onClick={sendReply} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg" disabled={!replyText.trim()}>Send Reply</button>
                <button onClick={() => { setSelectedMessage(null); setReplyText(''); }} className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContact;
