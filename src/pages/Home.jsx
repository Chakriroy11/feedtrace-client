import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Laptop, Watch, ShieldCheck, Star, Loader2, ArrowRight } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; 

const Home = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userName = localStorage.getItem('feedtrace_user_name') || 'User';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 🚀 URL SAFETY: Added a fallback in case env var is missing
        const baseUrl = import.meta.env.VITE_API_URL || 'https://feedtrace-api.onrender.com';
        const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/products/all`);
        
        if (res.ok) {
          const data = await res.json();
          // 🛡️ DATA GUARD: Ensure data is an array before slicing
          const safeData = Array.isArray(data) ? data : [];
          setProducts(safeData.slice(-4).reverse()); 
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/All?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { id: 'Electronics', label: 'Electronics', icon: <Laptop size={isMobile ? 24 : 32} color="#3b82f6" />, color: '#eff6ff' },
    { id: 'Accessories', label: 'Accessories', icon: <Watch size={isMobile ? 24 : 32} color="#10b981" />, color: '#ecfdf5' },
    { id: 'All', label: 'Browse All', icon: <Search size={isMobile ? 24 : 32} color="#f59e0b" />, color: '#fffbeb' }
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: '"Inter", sans-serif',
      paddingBottom: isMobile ? '100px' : '40px' 
    }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        padding: isMobile ? '40px 20px' : '60px 50px', 
        borderRadius: '32px', 
        color: 'white', 
        marginBottom: '40px', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        textAlign: isMobile ? 'center' : 'left',
        alignItems: 'center', 
        justifyContent: 'space-between', 
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ flex: 1, width: '100%', zIndex: 2 }}>
          <h1 style={{ fontSize: isMobile ? '2rem' : '3.2rem', margin: '0 0 15px 0', fontWeight: '900', letterSpacing: '-1px' }}>
            Welcome, <span style={{ color: '#3b82f6' }}>{userName}</span>! 👋
          </h1>
          <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', color: '#94a3b8', margin: '0 0 30px 0', maxWidth: '550px', lineHeight: '1.6' }}>
            Discover AI-verified reviews and trusted technical specs for your next big purchase.
          </p>
          
          <form onSubmit={handleSearch} style={{ 
            display: 'flex', 
            background: 'white', 
            padding: '6px', 
            borderRadius: '16px', 
            width: '100%', 
            maxWidth: isMobile ? '100%' : '450px',
            margin: isMobile ? '0 auto' : '0',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ padding: '12px', display: 'flex', alignItems: 'center', color: '#94a3b8' }}><Search size={20}/></div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', background: 'transparent', color: '#0f172a' }} 
            />
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}>
              Search
            </button>
          </form>
        </div>
        
        {!isMobile && (
          <div style={{ marginLeft: '40px', opacity: 0.2 }}>
            <ShieldCheck size={180} color="#3b82f6" strokeWidth={1} />
          </div>
        )}
      </div>

      {/* --- CATEGORY BROWSER --- */}
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '25px', fontWeight: '800' }}>Explore Collections</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: isMobile ? '15px' : '25px' 
        }}>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigate(`/category/${cat.id}`)}
              style={{ 
                background: 'white', 
                border: '1px solid #f1f5f9', 
                borderRadius: '24px', 
                padding: isMobile ? '20px' : '30px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '15px', 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' 
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#3b82f6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
            >
              <div style={{ background: cat.color, padding: '20px', borderRadius: '20px' }}>
                {cat.icon}
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- RECENT PRODUCTS --- */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#0f172a', fontWeight: '800' }}>Newest Arrivals</h2>
          <button 
            onClick={() => navigate('/category/All')} 
            style={{ fontSize: '0.9rem', color: '#3b82f6', background: '#eff6ff', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            View Gallery <ArrowRight size={16} />
          </button>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" size={32} color="#3b82f6" style={{ margin: '0 auto' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', border: '2px dashed #f1f5f9', borderRadius: '20px' }}>
            No products found.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: isMobile ? '15px' : '30px' 
          }}>
            {products.map((product) => (
              <div 
                key={product._id} 
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ 
                  background: 'white', 
                  border: '1px solid #f1f5f9', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ height: isMobile ? '160px' : '220px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '20px', borderTop: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: '900', textTransform: 'uppercase' }}>{product.brand}</span>
                  <h3 style={{ margin: '6px 0 12px 0', fontSize: '1rem', fontWeight: '700', color: '#0f172a', height: '2.6em', overflow: 'hidden', lineHeight: '1.3' }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '900', fontSize: '1.2rem', color: '#1e293b' }}>₹{Number(product.price || 0).toLocaleString()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#d97706', fontSize: '0.85rem', fontWeight: '800' }}>
                      <Star size={14} fill="#d97706" /> 4.8
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;