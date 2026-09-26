import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Database, 
  Globe, 
  ExternalLink,
  Sun,
  MapPin,
  Clock,
  Phone,
  Mail,
  Share2
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
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

  const navigateTo = (view) => {
    let path = '/';
    if (view === 'privacy') path = '/privacy-policy';
    if (view === 'terms') path = '/terms-of-service';

    window.history.pushState({}, '', path);
    setCurrentView(view);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', display: 'flex', flexDirection: 'column', fontFamily: '"Inter", sans-serif' }}>
      <style>{`
        body { margin: 0; padding: 0; background-color: #f9fafb; }
        .announcement-bar { background: #00e65b; color: #000; text-align: center; padding: 10px 16px; font-size: 13px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; padding: 24px 48px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); position: sticky; top: 0; z-index: 50; border-bottom: 1px solid rgba(0, 230, 91, 0.2); }
        .logo-group { display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 900; color: #111827; letter-spacing: -0.5px; }
        .nav-links { display: flex; gap: 36px; }
        .nav-link-item { color: #4b5563; font-weight: 600; font-size: 15px; text-decoration: none; cursor: pointer; background: none; border: none; padding: 0; transition: color 0.2s; }
        .nav-link-item:hover { color: #00cc52; }
        .btn-purchase { background: #00e65b; color: #ffffff; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: all 0.3s ease; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 14px rgba(0, 230, 91, 0.3); text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .btn-purchase:hover { background: #00cc52; box-shadow: 0 6px 20px rgba(0, 230, 91, 0.4); transform: translateY(-2px); }
        
        .main-container { flex: 1; max-width: 1300px; width: 90%; margin: 0 auto 80px auto; display: flex; flex-direction: column; gap: 80px; }
        
        .hero-section { display: grid; grid-template-columns: 1fr; gap: 60px; padding: 100px 0 60px 0; align-items: center; }
        @media(min-width: 1024px) { .hero-section { grid-template-columns: 1fr 1fr; } }
        .hero-left { display: flex; flex-direction: column; align-items: flex-start; }
        .hero-tag { font-size: 13px; font-weight: 800; color: #00b347; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 24px; display: inline-block; padding: 6px 12px; background: rgba(0, 230, 91, 0.1); border-radius: 4px; border: 1px solid rgba(0, 230, 91, 0.2); }
        .hero-title { font-size: 64px; font-weight: 900; color: #111827; line-height: 1.05; margin: 0 0 24px 0; letter-spacing: -2px; }
        .hero-title span { color: #00cc52; }
        .hero-desc { font-size: 18px; color: #4b5563; line-height: 1.6; margin: 0 0 40px 0; max-width: 500px; }
        .hero-actions { display: flex; gap: 20px; align-items: center; }
        .btn-glow { background: transparent; border: 2px solid #00cc52; color: #00b347; padding: 12px 28px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 14px; transition: all 0.3s; display: flex; align-items: center; gap: 8px; text-transform: uppercase; }
        .btn-glow:hover { background: rgba(0, 204, 82, 0.05); box-shadow: 0 4px 14px rgba(0, 204, 82, 0.15); }
        
        .hero-right { position: relative; display: flex; justify-content: center; width: 100%; }
        .image-stack { position: relative; width: 100%; max-width: 600px; height: 450px; }
        .img-main { position: absolute; top: 0; right: 0; width: 85%; border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 40px rgba(0,230,91,0.1); z-index: 2; transition: transform 0.3s ease; object-fit: cover; }
        .img-main:hover { transform: translateY(-10px); }
        .img-sub { position: absolute; bottom: 20px; left: 0; width: 70%; border-radius: 12px; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.15); z-index: 3; transition: transform 0.3s ease; object-fit: cover; }
        .img-sub:hover { transform: translateY(-10px) scale(1.02); }

        .feature-grid { display: grid; grid-template-columns: 1fr; gap: 32px; padding: 40px 0; }
        @media(min-width: 768px) { .feature-grid { grid-template-columns: 1fr 1fr; } }
        .feature-card { background: #ffffff; border: 1px solid rgba(0,0,0,0.05); border-radius: 16px; padding: 40px; transition: all 0.3s ease; position: relative; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .feature-card:hover { border-color: rgba(0,230,91,0.3); transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,230,91,0.1); }
        .feature-icon-wrapper { height: 60px; width: 60px; background: rgba(0,230,91,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: #00b347; border: 1px solid rgba(0,230,91,0.2); }
        .feature-title { font-size: 24px; font-weight: 800; color: #111827; margin-bottom: 16px; }
        .feature-desc { font-size: 15px; color: #4b5563; line-height: 1.7; margin-bottom: 24px; }
        .feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
        .feature-list li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #374151; font-weight: 600; }
        .feature-list li svg { color: #00cc52; width: 16px; height: 16px; }

        .footer { margin-top: auto; border-top: 1px solid rgba(0,0,0,0.05); padding: 40px 48px; display: flex; justify-content: space-between; font-size: 14px; color: #6b7280; background: #ffffff; }
      `}</style>

      <div className="announcement-bar">
        Welcome to the next generation of web scraping
      </div>

      <div className="header-bar">
        <div className="logo-group">
          <img src="/logo.png" alt="Leeda Gen Pro Logo" style={{ height: '40px', width: 'auto', borderRadius: '8px' }} />
          <span>LEEDA GEN <span style={{ color: '#00cc52' }}>PRO</span></span>
        </div>
        <div className="nav-links">
          <button className="nav-link-item" onClick={() => navigateTo('dashboard')}>Home</button>
          <button className="nav-link-item" onClick={() => navigateTo('privacy')}>Privacy</button>
          <button className="nav-link-item" onClick={() => navigateTo('terms')}>Terms</button>
        </div>
        <button className="btn-purchase" onClick={() => navigateTo('dashboard')}>Start Scraping</button>
      </div>

      {currentView === 'dashboard' && (
        <div className="main-container">
          <div className="hero-section">
            <div className="hero-left">
              <span className="hero-tag">Hyper-Scale Prospecting</span>
              <h1 className="hero-title">
                Uncover Leads with <span>Surgical Precision</span>.
              </h1>
              <p className="hero-desc">
                Extract high-value business data directly from Google Maps and execute deep-dives into individual company websites to capture comprehensive contact and intelligence data.
              </p>
              <div className="hero-actions">
                <button className="btn-purchase" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Install Extension</span>
                  <ExternalLink size={18} />
                </button>
                <button className="btn-glow">
                  <span>View Documentation</span>
                </button>
              </div>
            </div>

            <div className="hero-right">
              <div className="image-stack">
                <img 
                  className="img-main" 
                  src="/assets/Screenshot 2026-09-27 at 2.45.08 AM.png" 
                  alt="Dashboard Interface"
                  onError={(e) => { e.target.src = '/logo.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '40px'; e.target.style.background = '#f9fafb'; }}
                />
                <img 
                  className="img-sub" 
                  src="/assets/Screenshot 2026-09-27 at 2.39.55 AM.png" 
                  alt="Scraping Details"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '-20px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', letterSpacing: '-1px' }}>Dual-Engine <span style={{ color: '#00cc52' }}>Scraping Power</span></h2>
            <p style={{ color: '#4b5563', fontSize: '16px', maxWidth: '600px', margin: '16px auto 0' }}>Our platform combines broad Google Maps extraction with deep-level website parsing to build the ultimate lead profile.</p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <MapPin size={28} />
              </div>
              <h3 className="feature-title">Google Maps Extraction</h3>
              <p className="feature-desc">
                Instantly pull thousands of business listings directly from Google Maps. Build your initial database with highly accurate, location-based business intelligence.
              </p>
              <ul className="feature-list">
                <li><FileText /> Business Name & Category</li>
                <li><Phone /> Direct Phone Numbers</li>
                <li><Mail /> Publicly Listed Emails</li>
                <li><Clock /> Accurate Open & Close Dates</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Globe size={28} />
              </div>
              <h3 className="feature-title">Deep Website Parsing</h3>
              <p className="feature-desc">
                Once initial leads are found, our secondary scraper navigates each business's website and contact pages to uncover hidden data points and social profiles.
              </p>
              <ul className="feature-list">
                <li><Share2 /> Social Media Profiles (FB, IG, LinkedIn)</li>
                <li><Search /> Contact Info Present on Website</li>
                <li><Sun /> Local Weather & Contextual Details</li>
                <li><Database /> Structured Contact Page Data</li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', letterSpacing: '-1px' }}>Our <span style={{ color: '#00cc52' }}>Clients</span></h2>
            <p style={{ color: '#4b5563', fontSize: '16px', maxWidth: '600px', margin: '16px auto 0' }}>Join thousands of satisfied users from top agencies and sales teams.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '32px', flexWrap: 'wrap', opacity: 0.8 }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#374151' }}>TechCorp</span>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#374151' }}>GlobalSales</span>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#374151' }}>MarketLeads</span>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#374151' }}>GrowthInc</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '80px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', letterSpacing: '-1px' }}>Major <span style={{ color: '#00cc52' }}>Uses</span></h2>
            <div className="feature-grid" style={{ marginTop: '20px' }}>
              <div className="feature-card" style={{ padding: '30px', textAlign: 'left' }}>
                <h3 className="feature-title" style={{ fontSize: '20px' }}>Cold Calling & Outreach</h3>
                <p className="feature-desc" style={{ marginBottom: 0 }}>Easily get leads, phone numbers, and emails to streamline your cold calling efforts and maximize connection rates.</p>
              </div>
              <div className="feature-card" style={{ padding: '30px', textAlign: 'left' }}>
                <h3 className="feature-title" style={{ fontSize: '20px' }}>Lead Generation Businesses</h3>
                <p className="feature-desc" style={{ marginBottom: 0 }}>A powerful tool for lead generation businesses to get leads easily and free, helping you rapidly build lists and deliver high-quality prospects.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'privacy' && (
        <div className="main-container" style={{ marginTop: '80px', maxWidth: '800px' }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#00b347', marginBottom: '24px' }}>Privacy Policy</h1>
            <div style={{ color: '#4b5563', lineHeight: '1.8' }}>
              <p style={{ fontWeight: '600' }}>Last updated: September 2026</p>
              
              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>1. Information We Collect</h3>
              <p>When you use Leeda Gen Pro, we collect absolutely no data regarding your searches, targets, or scraped data. All data operations are securely handled locally within your client browser environment. We respect user privacy by maintaining zero server-side storage of your leads.</p>
              
              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>2. How We Use Information</h3>
              <p>Any non-identifying telemetry data collected is used strictly to improve the functionality of our Chrome Extension and web interface. We do not sell, rent, or distribute any user metrics to third parties.</p>

              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>3. Data Storage & Security</h3>
              <p>Your data (including leads, emails, phone numbers, and SMTP credentials) is saved securely to your local machine (localStorage). It never touches our servers. It is your responsibility to secure your device.</p>
              
              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>4. Opt-Out Rights</h3>
              <p>Because all scraping data remains local to your device, you have full control over your data footprint. Simply clear your browser cache or use our "Clear All" features to permanently destroy the lead databases you've accrued.</p>
            </div>
            <button className="btn-glow" style={{ marginTop: '40px' }} onClick={() => navigateTo('dashboard')}>Return to Dashboard</button>
          </div>
        </div>
      )}

      {currentView === 'terms' && (
        <div className="main-container" style={{ marginTop: '80px', maxWidth: '800px' }}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '48px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#00b347', marginBottom: '24px' }}>Terms of Service</h1>
            <div style={{ color: '#4b5563', lineHeight: '1.8' }}>
              <p style={{ fontWeight: '600' }}>Last updated: September 2026</p>
              
              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>1. Acceptance of Terms</h3>
              <p>By accessing or using Leeda Gen Pro, you agree to be bound by these Terms. If you do not agree, you must cease use of our tools immediately.</p>
              
              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>2. Acceptable Use Policy</h3>
              <p>You agree to use this software in compliance with all relevant local, federal, and international laws, including spam regulations and data protection acts (such as GDPR, CAN-SPAM, and CCPA). You agree not to request automated scrapers that could trigger IP blockades or overload target commercial website hosting resources.</p>
              
              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>3. Service Disclaimer</h3>
              <p>This software is provided "as is" and without warranty. We are not liable for any SMTP server blocks, domain suspensions, or target complaints resulting from your cold marketing outreach or data scraping practices.</p>

              <h3 style={{ color: '#111827', marginTop: '32px', marginBottom: '16px', fontSize: '20px' }}>4. Indemnification</h3>
              <p>You agree to indemnify and hold harmless Leeda Gen Pro and its affiliates against any claims, damages, or legal actions arising from your misuse of the platform or violation of third-party terms of service.</p>
            </div>
            <button className="btn-glow" style={{ marginTop: '40px' }} onClick={() => navigateTo('dashboard')}>Return to Dashboard</button>
          </div>
        </div>
      )}

      <footer className="footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '20px', borderRadius: '4px' }} />
          <span style={{ fontWeight: '700', color: '#111827' }}>LEEDA GEN <span style={{ color: '#00cc52' }}>PRO</span></span>
          <span style={{ marginLeft: '12px' }}>&copy; 2026. All rights reserved.</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigateTo('privacy')}>Privacy Policy</button>
          <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontWeight: '500' }} onClick={() => navigateTo('terms')}>Terms of Service</button>
        </div>
      </footer>
    </div>
  );
}
