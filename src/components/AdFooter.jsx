import React, { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive'; 

const AdFooter = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useResponsive(); 

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // 🚀 FIXED: Changed single quotes to backticks (`)
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ads/active`);
        
        // Safety check for JSON content
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          // Ensure we only set ads if data is an array
          setAds(Array.isArray(data) ? data : []);
        } else {
          console.warn("Ad API did not return JSON. Check backend route.");
        }
      } catch (err) { 
        console.error("🚨 Network error fetching ads.", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Auto-rotate ads every 8 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  const handleCopy = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (loading || ads.length === 0) return null; 

  const displayAd = ads[currentIndex];

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: isMobile ? '70px' : 0, 
      left: isMobile ? 0 : '80px', 
      right: 0, 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid #e2e8f0', 
      boxShadow: '0 -4px 15px rgba(0,0,0,0.08)', 
      zIndex: 999, 
      padding: isMobile ? '10px 15px' : '12px 30px',
      display: 'flex',
      justifyContent: 'center',
      fontFamily: '"Inter", sans-serif',
      transition: 'all 0.3s ease'
    }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: isMobile ? '8px' : '20px'
      }}>
        
        {/* Left: Sponsor Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
          <div style={{ 
            width: isMobile ? '40px' : '50px', 
            height: isMobile ? '40px' : '50px', 
            background: '#fff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '10px', 
            border: '1px solid #f1f5f9', 
            overflow: 'hidden' 
          }}>
             {displayAd.bannerImage ? (
               <img src={displayAd.bannerImage} alt="Sponsor" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
             ) : (
               <Gift size={isMobile ? 18 : 24} color="#3b82f6" />
             )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sponsored Offer</span>
            <span style={{ fontSize: isMobile ? '0.9rem' : '1rem', color: '#1e293b', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {displayAd.sponsorName}
            </span>
          </div>
          {isMobile && (
            <div style={{ marginLeft: 'auto', fontSize: '0.9rem', fontWeight: '900', color: '#3b82f6' }}>
              {displayAd.discountText}
            </div>
          )}
        </div>

        {/* Middle: Promo Text */}
        {!isMobile && (
          <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#3b82f6', textAlign: 'center', flex: 1, letterSpacing: '-0.5px' }}>
            {displayAd.discountText}
          </div>
        )}

        {/* Right: Coupon Button */}
        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <button 
            onClick={() => handleCopy(displayAd.couponCode)}
            style={{ 
              background: copiedCode === displayAd.couponCode ? '#10b981' : '#0f172a', 
              color: 'white', 
              border: 'none', 
              padding: isMobile ? '12px 15px' : '12px 25px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              fontWeight: '800', 
              fontSize: '0.9rem',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? 'none' : '180px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}
          >
            {copiedCode === displayAd.couponCode ? <CheckCircle size={18} /> : <Copy size={18} />}
            <span style={{ letterSpacing: '1px' }}>{displayAd.couponCode}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdFooter;