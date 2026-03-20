import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Search, FilterX, Star, Loader2,
  Smartphone, Monitor, Laptop, Fan, Headphones, 
  Shirt, User, Footprints, Baby, 
  Armchair, Lamp, Utensils, Palette, 
  Sparkles, Smile, Scissors, Droplet, 
  Dumbbell, Tent, Activity 
} from 'lucide-react';

const CategoryPage = () => {
  const { catId } = useParams(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryStructure = {
    'Electronics': [
      { name: 'Mobiles', icon: <Smartphone size={32}/>, desc: 'Phones & Accessories' },
      { name: 'Laptops', icon: <Laptop size={32}/>, desc: 'High Performance Laptops' },
      { name: 'Televisions', icon: <Monitor size={32}/>, desc: 'Smart TVs & Screens' },
      { name: 'ACs', icon: <Fan size={32}/>, desc: 'Cooling & Heating' },
      { name: 'Accessories', icon: <Headphones size={32}/>, desc: 'Headphones, Chargers' }
    ],
    'Clothing': [
      { name: 'Mens Wear', icon: <User size={32}/>, desc: 'Casual & Formal Fashion' },
      { name: 'Womens Wear', icon: <Shirt size={32}/>, desc: 'Trending Styles' },
      { name: 'Kids Wear', icon: <Baby size={32}/>, desc: 'Comfortable Clothing' },
      { name: 'Footwear', icon: <Footprints size={32}/>, desc: 'Shoes & Sandals' }
    ],
    'Home': [
      { name: 'Furniture', icon: <Armchair size={32}/>, desc: 'Sofas, Beds & Chairs' },
      { name: 'Decor', icon: <Palette size={32}/>, desc: 'Wall Art & Vases' },
      { name: 'Kitchenware', icon: <Utensils size={32}/>, desc: 'Cookware & Dining' },
      { name: 'Lighting', icon: <Lamp size={32}/>, desc: 'Lamps & Chandeliers' }
    ],
    'Beauty': [
      { name: 'Skincare', icon: <Smile size={32}/>, desc: 'Creams, Serums & More' },
      { name: 'Makeup', icon: <Sparkles size={32}/>, desc: 'Face, Eye & Lip' },
      { name: 'Haircare', icon: <Scissors size={32}/>, desc: 'Shampoo & Styling' },
      { name: 'Fragrance', icon: <Droplet size={32}/>, desc: 'Perfumes & Deodorants' }
    ],
    'Sports': [
      { name: 'Gym Equipment', icon: <Dumbbell size={32}/>, desc: 'Weights & Machines' },
      { name: 'Outdoor Gear', icon: <Tent size={32}/>, desc: 'Camping & Hiking' },
      { name: 'Sportswear', icon: <Activity size={32}/>, desc: 'Active Wear & Shoes' }
    ]
  };

  const subCats = categoryStructure[catId] || [];
  const isSearchOrAllMode = searchQuery !== '' || catId === 'All';

  useEffect(() => {
    if (!isSearchOrAllMode) return; 

    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        // 🚀 FIXED: Used backticks (`) for the URL
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/all`);
        if (res.ok) {
          const allProducts = await res.json();
          
          const filtered = allProducts.filter(product => {
            // 🌟 CASE-INSENSITIVE CHECK: Fixes "Electronics" vs "electronics" mismatch
            const matchesCategory = catId === 'All' || 
              product.category?.toLowerCase() === catId?.toLowerCase();

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery || 
              product.name?.toLowerCase().includes(searchLower) ||
              product.brand?.toLowerCase().includes(searchLower) ||
              product.subCategory?.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch;
          });

          setProducts(filtered);
        }
      } catch (err) { 
        console.error("Fetch failed:", err); 
      } finally { 
        setLoading(false); 
      }
    };

    fetchAndFilterProducts();
  }, [catId, searchQuery, isSearchOrAllMode]);

  // --- VIEW 1: PRODUCT GRID (SEARCH/ALL) ---
  if (isSearchOrAllMode) {
    const pageTitle = searchQuery ? `Results for "${searchQuery}"` : 'All Products';
    
    return (
      <div style={{minHeight: '100vh', background: '#f8fafc', padding: '40px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <button onClick={() => navigate('/home')} style={backBtnStyle}>
            <ArrowLeft size={18}/> Back to Home
          </button>

          <div style={{marginBottom: '40px'}}>
            <h1 style={{fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', margin: '0'}}>{pageTitle}</h1>
            <p style={{color: '#64748b'}}>Found {products.length} items</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="animate-spin" size={40} color="#3b82f6" /></div>
          ) : products.length === 0 ? (
            <div style={emptyStateStyle}>
              <FilterX size={60} color="#94a3b8" />
              <h3>No products found</h3>
              <button onClick={() => navigate('/home')} style={clearBtnStyle}>Browse Home</button>
            </div>
          ) : (
            <div style={productGridStyle}>
              {products.map((product) => (
                <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} style={productCardStyle}>
                  <div style={imgWrapperStyle}>
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={brandTagStyle}>{product.brand || product.category}</div>
                    <h3 style={productTitleStyle}>{product.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>₹{product.price?.toLocaleString()}</div>
                      <div style={ratingStyle}><Star size={14} fill="#d97706" /> 4.8</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW 2: SUB-CATEGORY MENU ---
  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', padding: '40px 20px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <button onClick={() => navigate('/home')} style={backBtnStyle}><ArrowLeft size={18}/> Back to Home</button>

        <div style={{marginBottom: '50px', textAlign: 'center'}}>
          <h1 style={{fontSize: '3rem', fontWeight: '800', color: '#1e293b', margin: '0'}}>{catId} <span style={{color: '#3b82f6'}}>Collection</span></h1>
          <p style={{color: '#64748b', fontSize: '1.2rem'}}>Explore specific categories in {catId}.</p>
        </div>

        <div style={subCatGridStyle}>
          {subCats.map((sub) => (
            <div key={sub.name} onClick={() => navigate(`/category/${catId}/${sub.name}`)} style={subCatCardStyle}>
              <div style={iconCircleStyle}>{sub.icon}</div>
              <h3 style={{fontSize: '1.3rem', fontWeight: '700', margin: '0 0 8px 0'}}>{sub.name}</h3>
              <p style={{color: '#94a3b8', fontSize: '0.95rem', margin: 0}}>{sub.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const backBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', color: '#64748b', fontWeight: '600' };
const productGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' };
const productCardStyle = { background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' };
const imgWrapperStyle = { height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' };
const brandTagStyle = { fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase', marginBottom: '5px' };
const productTitleStyle = { margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0f172a', height: '2.8rem', overflow: 'hidden' };
const ratingStyle = { display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', padding: '4px 8px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: '#d97706' };
const subCatGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' };
const subCatCardStyle = { background: 'white', padding: '40px 20px', borderRadius: '20px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const iconCircleStyle = { background: '#eff6ff', padding: '24px', borderRadius: '50%', color: '#3b82f6', marginBottom: '25px' };
const emptyStateStyle = { background: 'white', padding: '60px 20px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' };
const clearBtnStyle = { marginTop: '20px', padding: '10px 20px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default CategoryPage;