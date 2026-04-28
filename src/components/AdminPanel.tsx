import React, { useState, useEffect } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PortfolioItem, SiteConfig } from '../types';
import { X, Plus, Save, Trash2, LayoutDashboard, FileText, Video, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'config'>('portfolio');
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    tagline: 'Interpreting the Scene, Reading the Flow.',
    subTagline: 'Freelance Journalist • Foreign News Analyst • Political Commentator',
    heroImageUrl: '',
    aboutText: 'yonzaci is a name synonymous with accuracy and depth. With over a decade of field experience, I provide real-time interpretations of global shifts.',
    stat1Value: '15+', stat1Label: 'Years of Experience',
    stat2Value: '2k+', stat2Label: 'Broadcast Appearances',
    stat3Value: '500+', stat3Label: 'Published Articles',
    servicesHeadline: 'SERVICES & COLLABORATION',
    servicesSubline: 'Available for regular panels, spot analysis, and content advisory across diverse media formats.',
    phone: '+82 10 0000 0000',
    email: 'contact@yonzaci.com',
    instagram: '',
    youtube: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchingYoutube, setFetchingYoutube] = useState(false);
  
  // Form States
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    type: 'video',
    category: 'Politics',
    title: '',
    description: '',
    mediaName: '',
    url: '',
    images: [],
    isFeatured: false
  });

  const fetchYouTubeInfo = async () => {
    // ... (rest of the function omitted for brevity as per instructions, but I'll include it to be safe or just use smaller chunks)

    if (!newItem.url) return;
    
    setFetchingYoutube(true);
    try {
      // Extract Video ID
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = newItem.url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;

      if (!videoId) {
        alert("Invalid YouTube URL");
        return;
      }

      // Fetch OEmbed Data
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      const data = await response.json();

      const thumbnailUrl = data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      setNewItem(prev => ({
        ...prev,
        title: data.title || prev.title,
        mediaName: data.author_name || prev.mediaName,
        images: [thumbnailUrl, ...(prev.images || [])]
      }));
    } catch (err) {
      console.error("Failed to fetch YouTube info", err);
      alert("Could not fetch video info automatically.");
    } finally {
      setFetchingYoutube(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1111') {
      setIsAuthenticated(true);
      fetchData();
      fetchConfig();
    } else {
      alert('ACCESS DENIED: SECURE CREDENTIAL MISMATCH');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'config'));
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setSiteConfig({ id: doc.id, ...doc.data() } as SiteConfig);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (siteConfig.id) {
        await updateDoc(doc(db, 'config', siteConfig.id), { ...siteConfig as any });
      } else {
        const res = await addDoc(collection(db, 'config'), siteConfig);
        setSiteConfig(prev => ({ ...prev, id: res.id }));
      }
      alert("Settings updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `site/hero_${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setSiteConfig(prev => ({ ...prev, heroImageUrl: url }));
    } catch (err) {
      console.error("Hero upload failed", err);
      alert("Error uploading hero image");
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }
      setNewItem(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Error uploading images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'portfolio'), {
        ...newItem,
        createdAt: new Date().toISOString().split('T')[0]
      });
      setNewItem({
        type: 'video',
        category: 'Politics',
        title: '',
        description: '',
        mediaName: '',
        url: '',
        images: [],
        isFeatured: false
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'portfolio', id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
        <div className="bg-zinc-900 border border-zinc-800 p-10 w-full max-w-md" id="admin-login-modal">
          <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
            <X size={32} />
          </button>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand mx-auto mb-6 flex items-center justify-center font-display text-2xl font-bold italic">A</div>
            <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase">yonzaci admin</h2>
            <p className="text-zinc-500 mt-2 text-sm uppercase tracking-tighter italic">Enter secure credential</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Access Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-brand px-4 py-4 text-white outline-none transition-colors font-mono"
                placeholder="••••"
                required
              />
            </div>
            <button className="w-full bg-brand text-white font-bold py-4 uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_#bef264]">
              Initialize Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0f0a1a] text-white overflow-hidden" id="admin-panel">
      {/* Header */}
      <div className="bg-[#1a1428] border-b border-brand/20 px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand flex items-center justify-center font-display font-bold text-xs italic shadow-[2px_2px_0px_#bef264]">Y</div>
            <span className="font-display font-bold uppercase tracking-widest text-sm text-acid-green">yonzaci Dashboard</span>
          </div>
          <nav className="flex gap-4">
            <button 
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'portfolio' ? 'text-acid-green border-b-2 border-acid-green' : 'text-zinc-500 hover:text-white'}`}
            >
              Portfolio
            </button>
            <button 
              onClick={() => setActiveTab('config')}
              className={`px-4 py-1 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'config' ? 'text-acid-green border-b-2 border-acid-green' : 'text-zinc-500 hover:text-white'}`}
            >
              Site Config
            </button>
          </nav>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-acid-green">
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
       <div className="flex-1 overflow-y-auto p-8 news-grid bg-fixed">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'portfolio' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add Form */}
              <div className="lg:col-span-1 space-y-6 shrink-0">
            <div className="bg-[#1a1428] border border-brand/30 p-6">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-acid-green">
                <Plus size={20} />
                NEW RECORD
              </h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Type</label>
                    <select 
                      value={newItem.type}
                      onChange={e => setNewItem({...newItem, type: e.target.value as any})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none text-acid-green"
                    >
                      <option value="video">Video Clip</option>
                      <option value="article">Article</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Category</label>
                    <select 
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none text-acid-green"
                    >
                      <option value="Politics">Politics</option>
                      <option value="International">International</option>
                      <option value="Economy">Economy</option>
                      <option value="Issues">Issues Analysis</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Entry Title</label>
                  <input 
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none focus:border-brand"
                    placeholder="Headline"
                    required
                  />
                </div>

                {/* Local Image Upload */}
                <div>
                   <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Attach Images (Multi)</label>
                   <div className="border border-dashed border-brand/30 p-4 bg-black/20 text-center relative">
                      {uploading ? (
                        <div className="flex items-center justify-center gap-2 text-acid-green text-xs animate-pulse">
                           <Loader2 className="animate-spin" size={16} />
                           Uploading to Storage...
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                           <Upload size={24} className="text-acid-green" />
                           <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Select Files</span>
                           <input 
                             type="file" 
                             multiple 
                             onChange={handleFileUpload} 
                             className="hidden" 
                             accept="image/*"
                           />
                        </label>
                      )}
                   </div>
                   
                   {/* Image Preview Grid */}
                   <div className="grid grid-cols-4 gap-2 mt-4">
                      {newItem.images?.map((url, i) => (
                        <div key={i} className="aspect-square relative group bg-zinc-800">
                           <img src={url} className="w-full h-full object-cover" />
                           <button 
                             type="button"
                             onClick={() => removeImage(i)}
                             className="absolute top-0 right-0 bg-brand text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <X size={12} />
                           </button>
                        </div>
                      ))}
                   </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Media Outlet</label>
                  <input 
                    value={newItem.mediaName}
                    onChange={e => setNewItem({...newItem, mediaName: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none focus:border-brand"
                    placeholder="e.g. BBC News"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Target URL</label>
                  <div className="flex gap-2">
                    <input 
                      value={newItem.url}
                      onChange={e => setNewItem({...newItem, url: e.target.value})}
                      className="flex-1 bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none font-mono focus:border-brand text-acid-green text-xs"
                      placeholder="https://..."
                      required
                    />
                    {newItem.type === 'video' && (
                      <button 
                        type="button"
                        onClick={fetchYouTubeInfo}
                        disabled={fetchingYoutube}
                        className="bg-brand text-white px-3 text-[10px] font-bold uppercase tracking-tighter hover:bg-white hover:text-black transition-all disabled:opacity-50"
                      >
                        {fetchingYoutube ? '...' : 'AUTO-FETCH'}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Brief Summary</label>
                  <textarea 
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none min-h-[80px] focus:border-brand"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={newItem.isFeatured}
                    onChange={e => setNewItem({...newItem, isFeatured: e.target.checked})}
                    className="accent-acid-green"
                  />
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Featured on Main</label>
                </div>

                <button 
                  disabled={uploading}
                  className="w-full bg-brand py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_#bef264] disabled:opacity-50"
                >
                  <Save size={16} />
                  PUBLISH RECORD
                </button>
              </form>
            </div>
          </div>

          {/* List View */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1428] border border-brand/30 overflow-hidden">
              <div className="bg-black/20 p-4 border-b border-brand/20 flex justify-between items-center">
                <span className="text-xs font-bold text-acid-green uppercase tracking-[0.3em] font-display">
                  Live Records ({items.length})
                </span>
                <button onClick={fetchData} className="text-[10px] text-zinc-500 font-bold uppercase p-1">Refresh</button>
              </div>
              <div className="divide-y divide-brand/10">
                {items.length === 0 ? (
                  <div className="p-20 text-center text-zinc-600">No records found.</div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                      <div className="w-12 h-12 bg-[#0f0a1a] shrink-0 border border-brand/20 flex items-center justify-center overflow-hidden">
                        {item.images && item.images.length > 0 ? (
                          <img src={item.images[0]} className="w-full h-full object-cover opacity-50" />
                        ) : (
                          item.type === 'video' ? <Video size={20} className="text-brand" /> : <FileText size={20} className="text-brand" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-2 mb-1">
                          <span className="text-[9px] text-acid-green px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter italic border border-acid-green/20">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold truncate">{item.title}</h4>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">{item.mediaName}</span>
                      </div>
                      <button 
                        onClick={() => item.id && handleDeleteItem(item.id)}
                        className="p-2 text-zinc-500 hover:text-brand"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1428] border border-brand/30 p-8 max-w-4xl mx-auto backdrop-blur-sm">
            <h3 className="text-2xl font-display font-bold mb-8 text-acid-green uppercase italic flex items-center gap-2">
              <Save size={24} />
              Global Site Configuration
            </h3>
            <form onSubmit={handleSaveConfig} className="space-y-8">
              {/* Hero Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] border-b border-zinc-800 pb-2">Hero Section</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Headline (Tagline)</label>
                    <input 
                      value={siteConfig.tagline}
                      onChange={e => setSiteConfig({...siteConfig, tagline: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Sub-Headline</label>
                    <input 
                      value={siteConfig.subTagline}
                      onChange={e => setSiteConfig({...siteConfig, subTagline: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Hero Image</label>
                  <div className="flex items-center gap-4">
                    {siteConfig.heroImageUrl && (
                      <div className="w-20 h-20 border border-brand/20 overflow-hidden shrink-0">
                        <img src={siteConfig.heroImageUrl} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 border border-dashed border-brand/30 p-4 bg-black/20 text-center cursor-pointer hover:bg-black/40 transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                        {uploading ? 'Uploading...' : 'Click to upload main photo'}
                      </span>
                      <input 
                        type="file" 
                        onChange={handleHeroImageUpload} 
                        className="hidden" 
                        accept="image/*"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] border-b border-zinc-800 pb-2">About Section</h4>
                <div>
                  <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">About Text</label>
                  <textarea 
                    value={siteConfig.aboutText}
                    onChange={e => setSiteConfig({...siteConfig, aboutText: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none min-h-[100px] focus:border-brand"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Stat 1 (Value/Label)</label>
                    <input 
                      value={siteConfig.stat1Value}
                      onChange={e => setSiteConfig({...siteConfig, stat1Value: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none mb-2"
                      placeholder="15+"
                    />
                    <input 
                      value={siteConfig.stat1Label}
                      onChange={e => setSiteConfig({...siteConfig, stat1Label: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs outline-none font-bold text-zinc-400"
                      placeholder="Years Exp"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Stat 2 (Value/Label)</label>
                    <input 
                      value={siteConfig.stat2Value}
                      onChange={e => setSiteConfig({...siteConfig, stat2Value: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none mb-2"
                      placeholder="2k+"
                    />
                    <input 
                      value={siteConfig.stat2Label}
                      onChange={e => setSiteConfig({...siteConfig, stat2Label: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs outline-none font-bold text-zinc-400"
                      placeholder="Appearances"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Stat 3 (Value/Label)</label>
                    <input 
                      value={siteConfig.stat3Value}
                      onChange={e => setSiteConfig({...siteConfig, stat3Value: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-sm outline-none mb-2"
                      placeholder="500+"
                    />
                    <input 
                      value={siteConfig.stat3Label}
                      onChange={e => setSiteConfig({...siteConfig, stat3Label: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-2 text-xs outline-none font-bold text-zinc-400"
                      placeholder="Articles"
                    />
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] border-b border-zinc-800 pb-2">Services Section</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Headline</label>
                    <input 
                      value={siteConfig.servicesHeadline}
                      onChange={e => setSiteConfig({...siteConfig, servicesHeadline: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Subline</label>
                    <input 
                      value={siteConfig.servicesSubline}
                      onChange={e => setSiteConfig({...siteConfig, servicesSubline: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] border-b border-zinc-800 pb-2">Contact & Socials</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Phone</label>
                    <input 
                      value={siteConfig.phone}
                      onChange={e => setSiteConfig({...siteConfig, phone: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Email</label>
                    <input 
                      value={siteConfig.email}
                      onChange={e => setSiteConfig({...siteConfig, email: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">Instagram URL</label>
                    <input 
                      value={siteConfig.instagram}
                      onChange={e => setSiteConfig({...siteConfig, instagram: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-500 font-bold mb-1">YouTube URL</label>
                    <input 
                      value={siteConfig.youtube}
                      onChange={e => setSiteConfig({...siteConfig, youtube: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 p-3 text-sm outline-none focus:border-brand"
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-acid-green text-black py-4 font-bold uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[6px_6px_0px_#a855f7] disabled:opacity-50"
              >
                {loading ? 'SAVING...' : 'UPDATE SITE CONFIGURATION'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminPanel;
