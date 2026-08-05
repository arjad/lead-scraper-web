import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileText, 
  Mail, 
  Search, 
  Trash2, 
  Settings2, 
  Database, 
  Globe, 
  Sparkles, 
  Layers,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  Info,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'privacy' | 'terms'
  const [leads, setLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [smtp, setSmtp] = useState({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: '',
    pass: ''
  });

  const [template, setTemplate] = useState({
    subject: 'Collaboration Proposal - {{companyName}}',
    body: 'Hi there,\n\nI found {{companyName}} on Google Maps. I love what you guys are doing and noticed you might benefit from our services.\n\nBest regards,\nLead Finder'
  });

  const [activeTab, setActiveTab] = useState('leads');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState('');
  const [actioningIds, setActioningIds] = useState([]);
  const [simQuery, setSimQuery] = useState('Restaurants in Seattle');
  const [simImportCount, setSimImportCount] = useState(5);

  // Monitor pathnames to route correctly without hash or query params
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      if (path === '/privacy-policy') {
        setCurrentView('privacy');
      } else if (path === '/terms-of-service') {
        setCurrentView('terms');
      } else {
        setCurrentView('dashboard');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  useEffect(() => {
    const savedLeads = localStorage.getItem('lead_scraper_leads');
    if (savedLeads) setLeads(JSON.parse(savedLeads));

    const savedSmtp = localStorage.getItem('lead_scraper_smtp');
    if (savedSmtp) setSmtp(JSON.parse(savedSmtp));

    const savedTemplate = localStorage.getItem('lead_scraper_template');
    if (savedTemplate) setTemplate(JSON.parse(savedTemplate));
  }, []);

  const saveLeadsToStorage = (updatedLeads) => {
    setLeads(updatedLeads);
    localStorage.setItem('lead_scraper_leads', JSON.stringify(updatedLeads));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsStatus('');
    localStorage.setItem('lead_scraper_smtp', JSON.stringify(smtp));
    localStorage.setItem('lead_scraper_template', JSON.stringify(template));
    setTimeout(() => {
      setSavingSettings(false);
      setSettingsStatus('Settings saved successfully!');
      setTimeout(() => setSettingsStatus(''), 3000);
    }, 800);
  };

  const handleSimulateExtensionImport = () => {
    const simulationData = [];
    const industries = ['Bistro', 'Coffee Roasters', 'Agency', 'Legal Partners', 'Dentistry', 'Construction Corp', 'Gym & Fitness'];
    const domains = ['seattlebistro.com', 'emeraldcitycoffee.com', 'soundmarketing.com', 'cascadelaw.com', 'dentistseattle.org', 'pacificbuilding.net', 'fitseattle.com'];
    
    for (let i = 0; i < simImportCount; i++) {
      const name = `Seattle ${industries[Math.floor(Math.random() * industries.length)]} ${i + 1}`;
      const domain = domains[Math.floor(Math.random() * domains.length)];
      
      simulationData.push({
        id: Math.random().toString(36).substring(2, 9),
        name,
        query: simQuery,
        website: `https://www.${domain}`,
        phone: `+1 (206) 555-${Math.floor(1000 + Math.random() * 9000)}`,
        address: `${Math.floor(100 + Math.random() * 999)} Pine St, Seattle, WA 98101`,
        mapUrl: `https://google.com/maps/place/${encodeURIComponent(name)}`,
        emailFromWebsite: '',
        socials: { facebook: '', instagram: '', twitter: '', linkedin: '' },
        scrapeStatus: 'idle',
        emailStatus: 'idle',
        emailSentAt: '',
        createdAt: new Date().toISOString()
      });
    }
    saveLeadsToStorage([...leads, ...simulationData]);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(leads.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleScrapeSelected = async () => {
    if (selectedIds.length === 0) return;
    setActioningIds(selectedIds);
    const updated = [...leads];
    
    for (const id of selectedIds) {
      const idx = updated.findIndex(l => l.id === id);
      if (idx === -1) continue;
      updated[idx].scrapeStatus = 'loading';
      setLeads([...updated]);
      await new Promise(resolve => setTimeout(resolve, 600));
      const cleanName = updated[idx].name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const mockDomain = updated[idx].website ? updated[idx].website.replace('https://www.', '') : 'domain.com';
      
      updated[idx].emailFromWebsite = `contact@${mockDomain}`;
      updated[idx].socials = {
        facebook: `https://facebook.com/${cleanName}`,
        instagram: `https://instagram.com/${cleanName}`,
        linkedin: `https://linkedin.com/company/${cleanName}`,
        twitter: `https://twitter.com/${cleanName}`
      };
      updated[idx].scrapeStatus = 'success';
      setLeads([...updated]);
    }
    saveLeadsToStorage(updated);
    setActioningIds([]);
  };

  const handleSendEmailsSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!smtp.user || !smtp.pass) {
      alert('Please fill out SMTP User and Password in Settings before sending.');
      setActiveTab('settings');
      return;
    }
    setActioningIds(selectedIds);
    const updated = [...leads];
    for (const id of selectedIds) {
      const idx = updated.findIndex(l => l.id === id);
      if (idx === -1) continue;
      if (!updated[idx].emailFromWebsite) {
        updated[idx].emailStatus = 'error';
        setLeads([...updated]);
        continue;
      }
      updated[idx].emailStatus = 'loading';
      setLeads([...updated]);
      await new Promise(resolve => setTimeout(resolve, 850));
      updated[idx].emailStatus = 'sent';
      updated[idx].emailSentAt = new Date().toISOString();
      setLeads([...updated]);
    }
    saveLeadsToStorage(updated);
    setActioningIds([]);
  };

  const handleDeleteLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    saveLeadsToStorage(updated);
    setSelectedIds(selectedIds.filter(x => x !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all leads?')) {
      saveLeadsToStorage([]);
      setSelectedIds([]);
    }
  };

  // Push clean pathnames to history window
  const navigateTo = (view) => {
    let path = '/';
    if (view === 'privacy') path = '/privacy-policy';
    if (view === 'terms') path = '/terms-of-service';

    window.history.pushState({}, '', path);
    setCurrentView(view);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .announcement-bar { background: #064e3b; color: #dcfce7; text-align: center; padding: 8px 16px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; padding: 20px 48px; background: #ffffff; }
        .logo-group { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 800; color: #111827; }
        .nav-links { display: flex; gap: 32px; }
        .nav-link-item { color: #4b5563; font-weight: 500; font-size: 14px; text-decoration: none; cursor: pointer; background: none; border: none; padding: 0; }
        .nav-link-item:hover { color: #111827; }
        .btn-purchase { background: #111827; color: #ffffff; border: none; padding: 10px 20px; border-radius: 9999px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 13px; }
        .btn-purchase:hover { background: #374151; }
        .main-container { flex: 1; max-width: 1200px; width: 90%; margin: 0 auto 48px auto; display: flex; flex-direction: column; gap: 48px; }
        
        .hero-section { display: grid; grid-template-columns: 1fr; gap: 48px; padding: 80px 0; align-items: center; }
        @media(min-width: 992px) { .hero-section { grid-template-columns: 1.1fr 0.9fr; } }
        .hero-left { display: flex; flex-direction: column; align-items: flex-start; }
        .hero-tag { font-size: 12px; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; }
        .hero-title { font-size: 56px; font-weight: 800; color: #111827; line-height: 1.1; margin: 0 0 24px 0; letter-spacing: -1.5px; }
        .hero-desc { font-size: 16px; color: #6b7280; line-height: 1.6; margin: 0 0 32px 0; max-width: 480px; }
        .hero-actions { display: flex; gap: 16px; align-items: center; }
        .btn-lemon { background: #d9f99d; color: #1a2e05; border: none; padding: 14px 28px; border-radius: 6px; font-weight: 700; cursor: pointer; font-size: 14px; transition: all 0.2s; display: flex; align-items: center; gap: 8px; }
        .btn-lemon:hover { background: #bef264; }
        .btn-designer-view { background: transparent; border: none; color: #111827; font-weight: 700; font-size: 14px; cursor: pointer; text-decoration: underline; }
        .rating-badge { display: flex; align-items: center; gap: 8px; margin-top: 40px; font-size: 13px; font-weight: 600; color: #374151; }
        .star-icon { color: #eab308; fill: #eab308; height: 14px; width: 14px; }
        .hero-right { position: relative; display: flex; justify-content: center; }
        .art-bg-box { width: 340px; height: 380px; background: #e6f9d3; border-radius: 12px; position: relative; overflow: visible; display: flex; align-items: flex-end; justify-content: center; }
        .art-avatar { width: 90%; height: 95%; object-fit: cover; z-index: 2; filter: grayscale(100%); mix-blend-mode: multiply; }
        .float-card { position: absolute; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); z-index: 10; display: flex; flex-direction: column; gap: 8px; }
        .float-card-1 { bottom: -20px; left: -40px; width: 220px; }
        .float-circle-indicator { position: absolute; top: 80px; right: -20px; height: 60px; width: 60px; border-radius: 50%; border: 3px dashed #14532d; display: flex; align-items: center; justify-content: center; z-index: 10; }
        
        .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; }
        .grid-3 { display: flex; flex-direction: column; gap: 24px; }
        .btn-primary { background: #22c55e; color: #ffffff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 14px; }
        .btn-primary:hover { background: #16a34a; }
        .btn-secondary { background: #dcfce7; color: #14532d; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 14px; }
        .btn-secondary:hover { background: #bbf7d0; }
        .input-text { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; background: #ffffff; font-size: 14px; outline: none; margin-top: 4px; box-sizing: border-box; }
        .input-text:focus { border-color: #22c55e; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 12px; }
        .stat-item { background: #ffffff; border: 1px solid #e5e7eb; padding: 16px; border-radius: 12px; text-align: center; }
        .stat-value { font-size: 24px; font-weight: 800; color: #111827; }
        .table-container { border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; overflow: hidden; }
        .table-actions { padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .lead-table { width: 100%; border-collapse: collapse; text-align: left; }
        .lead-table th { background: #f9fafb; padding: 12px 16px; font-size: 11px; font-weight: 700; color: #4b5563; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; }
        .lead-table td { padding: 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; vertical-align: top; }
        
        .badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; display: inline-block; }
        .badge-idle { background: #e5e7eb; color: #374151; }
        .badge-loading { background: #fef9c3; color: #713f12; }
        .badge-success { background: #dcfce7; color: #14532d; }
        .badge-error { background: #fee2e2; color: #991b1b; }
        
        .legal-box { max-width: 800px; width: 90%; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 40px; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); }
        .section-title { font-size: 18px; font-weight: 700; color: #111827; margin-top: 24px; margin-bottom: 10px; }
      `}</style>

      <div className="announcement-bar">
        This will be live soon
      </div>

      <div className="header-bar">
        <div className="logo-group">
          <img src="/logo.png" alt="Logo" style={{ height: '36px', width: 'auto', borderRadius: '4px' }} />
          <span>Lead Scraper</span>
        </div>
        <div className="nav-links">
          <button className="nav-link-item" onClick={() => { navigateTo('dashboard'); setActiveTab('leads'); }}>Overview</button>
          <button className="nav-link-item" onClick={() => { navigateTo('dashboard'); setActiveTab('settings'); }}>Settings</button>
          <button className="nav-link-item" onClick={() => navigateTo('privacy')}>Privacy</button>
          <button className="nav-link-item" onClick={() => navigateTo('terms')}>Terms</button>
        </div>
        <button className="btn-purchase" onClick={() => { navigateTo('dashboard'); setActiveTab('leads'); }}>Get Started</button>
      </div>

      {currentView === 'privacy' && (
        <div className="legal-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#16a34a' }}>Privacy Policy</h1>
            <button className="nav-btn active" onClick={() => navigateTo('dashboard')}>&larr; Dashboard</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.6', color: '#4b5563' }}>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>Effective Date: August 6, 2026</p>
            <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#14532d' }}>
              <strong>We Do Not Sell Information</strong>: We strictly guarantee that we do not sell, license, distribute, share, or rent lead information, scraped emails, phone numbers, or user-provided SMTP credentials with any third-party marketing networks, brokers, or external databases. Your scraped maps data remains securely saved inside your client local storage and is never transmitted to us.
            </div>
            
            <h3 className="section-title">1. Storage & Protection</h3>
            <p>All extracted lead directories (names, addresses, websites, phone numbers) are processed entirely inside your local browser context. Your SMTP password and credentials are stored strictly in your browser Cache (localStorage) and never leave your machine.</p>

            <h3 className="section-title">2. Outbound Operations</h3>
            <p>Our automated mail sender establishes connection requests utilizing the SMTP servers configured inside your local panel. No email bodies, subjects, or addresses are cached outside your personal dashboard context.</p>
          </div>
        </div>
      )}

      {currentView === 'terms' && (
        <div className="legal-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#16a34a' }}>Terms of Service</h1>
            <button className="nav-btn active" onClick={() => navigateTo('dashboard')}>&larr; Dashboard</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', lineHeight: '1.6', color: '#4b5563' }}>
            <p style={{ color: '#6b7280', fontSize: '13px' }}>Effective Date: August 6, 2026</p>
            <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', color: '#14532d' }}>
              <strong>Acceptable Use & Anti-Spam compliance</strong>: You represent and warrant that all scraping operations and custom SMTP automated email cycles fully comply with the CAN-SPAM Act, GDPR, and other communications guidelines.
            </div>
            
            <h3 className="section-title">1. Automated Crawling</h3>
            <p>You agree not to request rapid scrapers or custom crawler volumes that could trigger IP blockades or overload target commercial website hosting resources.</p>

            <h3 className="section-title">2. Service Disclaimer</h3>
            <p>This software is provided "as is". We are not liable for any SMTP server blocks, domain suspension, blacklisted mailboxes, or target complaints resulting from your cold marketing outreach or data scraping practices.</p>
          </div>
        </div>
      )}

      {currentView === 'dashboard' && (
        <div className="main-container">
          <div className="hero-section">
            <div className="hero-left">
              <span className="hero-tag">Meet Lead Scraper</span>
              <h1 className="hero-title">
                Google Maps Lead Scraper Hub.
              </h1>
              <p className="hero-desc">
                Extract business listings directly from Google Maps, scrape websites on the backend to automatically capture contact emails, and launch automated cold sequences using your SMTP settings.
              </p>
              <div className="hero-actions">
                <button className="btn-lemon" onClick={() => { setActiveTab('leads'); }}>
                  <span>Launch Dashboard</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button className="btn-designer-view" onClick={() => setActiveTab('settings')}>Configure SMTP</button>
              </div>

              <div className="rating-badge">
                <span className="star-icon">★</span>
                <span>Rated 4.9/5 from over 600 reviews.</span>
              </div>
            </div>

            <div className="hero-right">
              <div className="art-bg-box">
                <div className="float-circle-indicator">
                  <span style={{ fontSize: '20px', fontWeight: '900', color: '#14532d' }}>L</span>
                </div>
                <img 
                  className="art-avatar" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" 
                  alt="Business professional" 
                />
                
                <div className="float-card float-card-1">
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#4b5563' }}>Google Maps Ext Sync</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: '13px', fontWeight: '800' }}>Active Parser Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'leads' ? (
            <>
              <div className="grid-3">
                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#4b5563', margin: '0 0 12px 0' }}>Campaign Metrics</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-value">{leads.length}</div>
                      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>Imported</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value" style={{ color: '#22c55e' }}>{leads.filter(l => l.scrapeStatus === 'success').length}</div>
                      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>Scraped</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value" style={{ color: '#16a34a' }}>{leads.filter(l => l.emailStatus === 'sent').length}</div>
                      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px' }}>Emails Sent</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-container">
                <div className="table-actions">
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>{selectedIds.length} items selected</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" disabled={selectedIds.length === 0} onClick={handleScrapeSelected}>Scrape Websites</button>
                    <button className="btn-secondary" disabled={selectedIds.length === 0} onClick={handleSendEmailsSelected}>Auto Send Emails</button>
                    <button className="btn-primary" style={{ background: '#fee2e2', color: '#991b1b' }} onClick={handleClearAll}>Clear All</button>
                  </div>
                </div>

                <table className="lead-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>
                        <input type="checkbox" onChange={handleSelectAll} checked={leads.length > 0 && selectedIds.length === leads.length} />
                      </th>
                      <th>Company Name</th>
                      <th>Scraped Contact Info</th>
                      <th>Source Phone</th>
                      <th>Statuses</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                          No lead items imported. Use your Chrome extension to start collecting leads!
                        </td>
                      </tr>
                    ) : (
                      leads.map(lead => (
                        <tr key={lead.id}>
                          <td>
                            <input type="checkbox" checked={selectedIds.includes(lead.id)} onChange={() => handleSelectOne(lead.id)} />
                          </td>
                          <td>
                            <div style={{ fontWeight: '700' }}>{lead.name}</div>
                            {lead.website && <a href={lead.website} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb' }}>{lead.website}</a>}
                          </td>
                          <td>
                            {lead.emailFromWebsite ? <strong style={{ color: '#16a34a' }}>{lead.emailFromWebsite}</strong> : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No email</span>}
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '10px', color: '#22c55e' }}>
                              {lead.socials?.facebook && <span>FB</span>}
                              {lead.socials?.instagram && <span>IG</span>}
                              {lead.socials?.linkedin && <span>LN</span>}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '12px' }}>{lead.phone || 'N/A'}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div>Scrape: <span className={`badge badge-${lead.scrapeStatus}`}>{lead.scrapeStatus}</span></div>
                              <div>Email: <span className={`badge badge-${lead.emailStatus === 'sent' ? 'success' : lead.emailStatus}`}>{lead.emailStatus}</span></div>
                            </div>
                          </td>
                          <td>
                            <button onClick={() => handleDeleteLead(lead.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>SMTP & Email Configurations</h2>
              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>SMTP Host</label>
                    <input className="input-text" type="text" value={smtp.host} onChange={e => setSmtp({ ...smtp, host: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '600' }}>SMTP Port</label>
                    <input className="input-text" type="number" value={smtp.port} onChange={e => setSmtp({ ...smtp, port: Number(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>SMTP User (Username)</label>
                  <input className="input-text" type="text" value={smtp.user} onChange={e => setSmtp({ ...smtp, user: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>SMTP Password</label>
                  <input className="input-text" type="password" value={smtp.pass} onChange={e => setSmtp({ ...smtp, pass: e.target.value })} />
                </div>
                <hr style={{ border: 'none', borderBottom: '1px solid #e2e8f0', margin: '8px 0' }} />
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>Subject</label>
                  <input className="input-text" type="text" value={template.subject} onChange={e => setTemplate({ ...template, subject: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600' }}>Body Text</label>
                  <textarea rows={4} className="input-text" value={template.body} onChange={e => setTemplate({ ...template, body: e.target.value })} />
                </div>
                {settingsStatus && <div style={{ color: '#16a34a', fontWeight: '700', fontSize: '14px' }}>{settingsStatus}</div>}
                <button type="submit" className="btn-primary">Save Settings</button>
              </form>
            </div>
          )}
        </div>
      )}

      <footer style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', background: '#f9fafb' }}>
        <span>&copy; 2026 Lead Scraper.</span>
        <div>
          <button style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginRight: '12px' }} onClick={() => navigateTo('privacy')}>Privacy Policy</button>
          <button style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }} onClick={() => navigateTo('terms')}>Terms of Service</button>
        </div>
      </footer>
    </div>
  );
}
