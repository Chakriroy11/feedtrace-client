import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Laptop, Watch, ShieldCheck, Star } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import the hook

const Home = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); // 📱 Listen for mobile screen
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const userName = localStorage.getItem('feedtrace_user_name') || 'User';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/products/all');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.slice(0, 4)); 
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
      paddingBottom: isMobile ? '80px' : '0' // Space for bottom sidebar
    }}>
      
      {/* --- HERO SECTION --- */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
        padding: isMobile ? '30px 20px' : '50px 40px', 
        borderRadius: '24px', 
        color: 'white', 
        marginBottom: '40px', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', // Stack on mobile
        textAlign: isMobile ? 'center' : 'left',
        alignItems: 'center', 
        justifyContent: 'space-between', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ flex: 1, width: '100%' }}>
          <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', margin: '0 0 10px 0', fontWeight: '800' }}>
            Welcome, <span style={{ color: '#3b82f6' }}>{userName}</span>! 👋
          </h1>
          <p style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', color: '#94a3b8', margin: '0 0 25px 0', maxWidth: '500px', lineHeight: '1.5' }}>
            Discover verified reviews and make smarter decisions with our AI trust engine.
          </p>
          
          {/* --- SEARCH BAR --- */}
          <form onSubmit={handleSearch} style={{ 
            display: 'flex', 
            background: 'white', 
            padding: '5px', 
            borderRadius: '12px', 
            width: '100%', 
            maxWidth: isMobile ? '100%' : '400px',
            margin: isMobile ? '0 auto' : '0'
          }}>
            <div style={{ padding: '10px', display: 'flex', alignItems: 'center', color: '#94a3b8' }}><Search size={18}/></div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', background: 'transparent', color: '#0f172a' }} 
            />
            <button type="submit" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
              Search
            </button>
          </form>
        </div>
        
        {/* Hide Shield on small mobile screens */}
        {!isMobile && (
          <div style={{ marginLeft: '20px' }}>
            <ShieldCheck size={120} color="rgba(59, 130, 246, 0.2)" />
          </div>
        )}
      </div>

      {/* --- CATEGORY BROWSER --- */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '20px', fontWeight: '700' }}>Browse Categories</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: isMobile ? '12px' : '20px' 
        }}>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => navigate(`/category/${cat.id}`)}
              style={{ 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px', 
                padding: isMobile ? '15px' : '25px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
              }}
            >
              <div style={{ background: cat.color, padding: isMobile ? '15px' : '20px', borderRadius: '50%' }}>
                {cat.icon}
              </div>
              <span style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: '600', color: '#334155' }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- RECENT PRODUCTS --- */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '20px', fontWeight: '700', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Recently Added
          <span onClick={() => navigate('/category/All')} style={{ fontSize: '0.85rem', color: '#3b82f6', cursor: 'pointer' }}>View All &rarr;</span>
        </h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: isMobile ? '12px' : '25px' 
          }}>
            {products.map((product) => (
              <div 
                key={product._id} 
                onClick={() => navigate(`/product/${product._id}`)}
                style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ height: isMobile ? '140px' : '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={product.image} alt={product.name} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: isMobile ? '12px' : '20px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 'bold' }}>{product.brand}</span>
                  <h3 style={{ margin: '5px 0', fontSize: isMobile ? '0.85rem' : '1rem', color: '#0f172a', height: '2.4em', overflow: 'hidden' }}>{product.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontWeight: '800', fontSize: isMobile ? '1rem' : '1.2rem' }}>₹{product.price?.toLocaleString()}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#d97706', fontSize: '0.8rem' }}><Star size={12} fill="#d97706" /> 4.8</div>
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