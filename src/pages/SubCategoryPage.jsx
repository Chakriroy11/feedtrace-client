import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Filter, Star, ArrowLeft, PackageX, CheckCircle } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import your hook

const brandMasterList = {
  'Mobiles': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Vivo', 'Oppo', 'Nothing', 'Motorola', 'Other'],
  'Laptops': ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'MSI', 'Samsung', 'Other'],
  'Televisions': ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Xiaomi', 'Vu', 'Other'],
  'Accessories': ['Boat', 'JBL', 'Sony', 'Noise', 'Apple', 'Samsung', 'Other'],
};

const SubCategoryPage = () => {
  const { catId, subId } = useParams(); 
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); // 📱 Listen for mobile screen

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('All');

  const availableBrands = brandMasterList[subId] || [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/products/all');
        if (res.ok) {
          const data = await res.json();
          // Filter products with case-insensitive and trimmed values
          const filtered = data.filter(p => 
            p.category?.toLowerCase().trim() === catId?.toLowerCase().trim() && 
            p.subCategory?.toLowerCase().trim() === subId?.toLowerCase().trim()
          );
          setProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [catId, subId]);

  // Apply the selected brand filter (Case-insensitive)
  const displayProducts = selectedBrand === 'All' 
    ? products 
    : products.filter(p => p.brand?.toLowerCase().trim() === selectedBrand.toLowerCase().trim());

  if (loading) return <div style={{ padding: '50px', textAlign: 'center', color: '#64748b', fontFamily: '"Inter", sans-serif' }}>Loading {subId}...</div>;

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      fontFamily: '"Inter", sans-serif', 
      padding: isMobile ? '10px 10px 100px 10px' : '20px 20px 60px 20px' 
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
            Found {displayProducts.length} verified products in {catId}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: isMobile ? '15px' : '20px' }}>
            <Filter size={18} color="#2563eb" strokeWidth={2.5} />
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: '800' }}>Filters</h3>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'column', 
            gap: '8px',
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? '5px' : '0',
            scrollbarWidth: 'none',
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
                    padding: isMobile ? '8px 16px' : '10px 16px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: isSelected ? '#2563eb' : '#e2e8f0',
                    backgroundColor: isSelected ? '#2563eb' : 'white',
                    color: isSelected ? 'white' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 10px rgba(37, 99, 235, 0.2)' : 'none'
                  }}
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
            <div style={{ background: 'white', padding: '60px 20px', borderRadius: '24px', border: '2px dashed #e2e8f0', textAlign: 'center' }}>
              <PackageX size={isMobile ? 50 : 80} color="#cbd5e1" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>No products found</h3>
              <button onClick={() => setSelectedBrand('All')} style={{ marginTop: '15px', padding: '10px 20px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>Clear Filter</button>
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
                    borderRadius: isMobile ? '12px' : '20px', 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <div style={{ height: isMobile ? '160px' : '220px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '10px' : '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <CheckCircle size={12}/> AI Verified
                    </div>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: isMobile ? '12px' : '20px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#8b5cf6', textTransform: 'uppercase' }}>{product.brand}</span>
                    <h3 style={{ margin: '4px 0 10px 0', fontSize: isMobile ? '0.9rem' : '1.1rem', color: '#0f172a', fontWeight: '700', height: isMobile ? '2.4em' : 'auto', overflow: 'hidden' }}>{product.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: '900', color: '#1e293b' }}>₹{product.price?.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#d97706', fontSize: '0.8rem', fontWeight: 'bold' }}>
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
    </div>
  );
};

export default SubCategoryPage;