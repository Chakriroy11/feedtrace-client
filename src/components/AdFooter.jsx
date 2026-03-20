import React, { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import your hook

const AdFooter = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isMobile } = useResponsive(); // 📱 Check for mobile

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/ads/active');
        if (res.ok) {
          const data = await res.json();
          setAds(data);
        }
      } catch (err) { 
        console.error("🚨 Network error fetching ads.", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // 🌟 THE FIX: Auto-rotate ads every 8 seconds
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  const handleCopy = (code) => {
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
      bottom: isMobile ? '70px' : 0, // 🌟 Stay above bottom nav on mobile
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
        flexDirection: isMobile ? 'column' : 'row', // 🌟 Stack on mobile
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: isMobile ? '8px' : '20px'
      }}>
        
        {/* Left: Sponsor Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: isMobile ? '100%' : 'auto' }}>
          <div style={{ 
            width: isMobile ? '40px' : '60px', 
            height: isMobile ? '30px' : '40px', 
            background: '#f8fafc', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            borderRadius: '6px', 
            border: '1px solid #e2e8f0', 
            overflow: 'hidden' 
          }}>
             {displayAd.bannerImage ? (
               <img src={displayAd.bannerImage} alt="Sponsor" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
             ) : (
               <Gift size={isMobile ? 16 : 20} color="#3b82f6" />
             )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Sponsored</span>
            <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {displayAd.sponsorName} {!isMobile && <ExternalLink size={10} />}
            </span>
          </div>
          {isMobile && (
            <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontWeight: '800', color: '#3b82f6' }}>
              {displayAd.discountText}
            </div>
          )}
        </div>

        {/* Middle: Promo Text (Hidden or minimized on mobile) */}
        {!isMobile && (
          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#3b82f6', textAlign: 'center', flex: 1 }}>
            {displayAd.discountText}
          </div>
        )}

        {/* Right: Coupon Button */}
        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <button 
            onClick={() => handleCopy(displayAd.couponCode)}
            style={{ 
              background: copiedCode === displayAd.couponCode ? '#ecfdf5' : '#0f172a', 
              color: copiedCode === displayAd.couponCode ? '#10b981' : 'white', 
              border: 'none', 
              padding: isMobile ? '8px 15px' : '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: '800', 
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px', 
              width: isMobile ? '100%' : 'auto',
              minWidth: isMobile ? 'none' : '150px'
            }}
          >
            {copiedCode === displayAd.couponCode ? <CheckCircle size={16} /> : <Copy size={16} />}
            {displayAd.couponCode}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdFooter;