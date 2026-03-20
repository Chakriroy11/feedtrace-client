import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Star, ArrowLeft, PackageX, CheckCircle } from 'lucide-react';

const brandMasterList = {
  'Mobiles': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Vivo', 'Oppo', 'Nothing', 'Motorola', 'Other'],
  'Laptops': ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'MSI', 'Samsung', 'Other'],
  'Televisions': ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Xiaomi', 'Vu', 'Other'],
  'Accessories': ['Boat', 'JBL', 'Sony', 'Noise', 'Apple', 'Samsung', 'Other'],
};

const ProductList = () => {
  const { catId, subId } = useParams(); 
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('All');
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchProducts = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/products/all');
        if (res.ok) {
          const data = await res.json();
          const filtered = data.filter(p => 
            p.category?.toLowerCase().trim() === catId?.toLowerCase().trim() && 
            p.subCategory?.toLowerCase().trim() === subId?.toLowerCase().trim()
          );
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    return () => window.removeEventListener('resize', handleResize);
  }, [catId, subId]);

  const displayProducts = selectedBrand === 'All' 
    ? products 
    : products.filter(p => p.brand?.toLowerCase().trim() === selectedBrand.toLowerCase().trim());

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#64748b', fontFamily: '"Inter", sans-serif' }}>Loading {subId}...</div>;

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: '"Inter", sans-serif', 
      padding: isMobile ? '10px 10px 80px 10px' : '20px 20px 60px 20px' 
    }}>
      
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: isMobile ? '20px' : '30px' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
        >
          <ArrowLeft size={20} color="#0f172a" />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2.2rem', color: '#0f172a', fontWeight: '800' }}>{subId}</h1>
          <p style={{ margin: '2px 0 0 0', color: '#64748b', fontWeight: '500', fontSize: '0.9rem' }}>
            Found {displayProducts.length} verified products
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '30px', alignItems: 'start' }}>
        
        {/* --- MODERN PILL FILTERS (CLEAN DESIGN) --- */}
        <div style={{ 
          background: 'white', 
          padding: isMobile ? '16px' : '24px', 
          borderRadius: '20px', 
          border: '1px solid #e2e8f0', 
          position: isMobile ? 'sticky' : 'sticky', 
          top: isMobile ? '0px' : '24px', 
          zIndex: 10,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.06)',
          width: isMobile ? '100%' : '280px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: isMobile ? '10px' : '20px', borderBottom: isMobile ? 'none' : '2px solid #f8fafc', paddingBottom: isMobile ? '0' : '15px' }}>
            <Filter size={18} color="#2563eb" strokeWidth={2.5} />
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: '800' }}>Filters</h3>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'column', 
            gap: isMobile ? '8px' : '8px',
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? '8px' : '0',
            scrollbarWidth: 'none', // For Firefox
            flexWrap: isMobile ? 'nowrap' : 'wrap'
          }}>
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {['All', ...availableBrands].map(brand => {
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  style={{
                    padding: isMobile ? '8px 18px' : '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                    backgroundColor: isSelected ? '#2563eb' : 'white',
                    color: isSelected ? 'white' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                    textAlign: isMobile ? 'center' : 'left'
                  }}
                  onMouseEnter={(e) => !isSelected && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => !isSelected && (e.currentTarget.style.backgroundColor = 'white')}
                >
                  {brand === 'All' ? 'All Brands' : brand}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div style={{ flex: 1, width: '100%' }}>
          {displayProducts.length === 0 ? (
            <div style={{ background: 'white', padding: '80px 20px', borderRadius: '24px', border: '2px dashed #e2e8f0', textAlign: 'center' }}>
              <PackageX size={isMobile ? 50 : 80} color="#cbd5e1" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e293b' }}>No items found</h3>
              <button onClick={() => setSelectedBrand('All')} style={{ marginTop: '15px', padding: '10px 20px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Reset Filters</button>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(150px, 1fr))' : 'repeat(auto-fill, minmax(260px, 1fr))', 
              gap: isMobile ? '12px' : '25px' 
            }}>
              {displayProducts.map((product) => (
                <div 
                  key={product._id} 
                  onClick={() => navigate(`/product/${product._id}`)} 
                  style={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: isMobile ? '16px' : '20px', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(-8px)', e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(0,0,0,0.1)')}
                  onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}
                >
                  <div style={{ height: isMobile ? '170px' : '230px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '10px' : '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#ecfdf5', color: '#10b981', padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #d1fae5' }}>
                       <CheckCircle size={12}/> AI Verified
                    </div>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: isMobile ? '14px' : '22px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brand}</span>
                    <h3 style={{ margin: '6px 0 12px 0', fontSize: isMobile ? '0.95rem' : '1.15rem', color: '#0f172a', fontWeight: '700', height: isMobile ? '2.5em' : 'auto', overflow: 'hidden', lineHeight: '1.4' }}>{product.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: isMobile ? '1.15rem' : '1.4rem', fontWeight: '900', color: '#1e293b' }}>₹{product.price?.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fffbeb', padding: '5px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', color: '#d97706', border: '1px solid #fef3c7' }}>
                        <Star size={15} fill="#d97706" /> 4.8
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;