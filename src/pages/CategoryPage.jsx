import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Search, FilterX, Star, // Standard UI Icons
  Smartphone, Monitor, Laptop, Fan, Headphones, // Electronics
  Shirt, User, Footprints, Baby, // Clothing
  Armchair, Lamp, Utensils, Palette, // Home
  Sparkles, Smile, Scissors, Droplet, // Beauty
  Dumbbell, Tent, Activity // Sports
} from 'lucide-react';

const CategoryPage = () => {
  const { catId } = useParams(); 
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // State for Product Search Results
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- CONFIGURATION: Sub-Categories ---
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

  // --- FETCH PRODUCTS (Only if searching or viewing "All") ---
  useEffect(() => {
    if (!isSearchOrAllMode) return; // Skip fetching if we are just showing the sub-category menu

    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/products/all');
        if (res.ok) {
          const allProducts = await res.json();
          
          const filtered = allProducts.filter(product => {
            const matchesCategory = catId === 'All' || product.category === catId;
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery || 
              product.name?.toLowerCase().includes(searchLower) ||
              product.brand?.toLowerCase().includes(searchLower) ||
              product.subCategory?.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch;
          });

          setProducts(filtered);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    fetchAndFilterProducts();
  }, [catId, searchQuery, isSearchOrAllMode]);


  // ==========================================
  // VIEW 1: SEARCH RESULTS / ALL PRODUCTS GRID
  // ==========================================
  if (isSearchOrAllMode) {
    const pageTitle = searchQuery ? `Search Results for "${searchQuery}"` : 'All Products';
    
    return (
      <div style={{minHeight: '100vh', background: '#f8fafc', padding: '40px 20px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          
          <button onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', color: '#64748b', fontWeight: '600', transition: 'all 0.2s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <ArrowLeft size={18}/> Back to Home
          </button>

          <div style={{marginBottom: '40px'}}>
            <h1 style={{fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0'}}>{pageTitle}</h1>
            <p style={{color: '#64748b', fontSize: '1.1rem'}}>Found {products.length} {products.length === 1 ? 'item' : 'items'}</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={{ background: 'white', padding: '60px 20px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FilterX size={60} color="#94a3b8" style={{ marginBottom: '15px' }} />
              <h3 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.2rem' }}>No products found</h3>
              <p style={{ color: '#64748b', margin: 0 }}>Try adjusting your search or browsing a category.</p>
              <button onClick={() => navigate('/home')} style={{ marginTop: '20px', padding: '10px 20px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
              {products.map((product) => (
                <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}>
                  <div style={{ height: '200px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
                    {product.image ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <Laptop size={50} color="#cbd5e1" />}
                  </div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>{product.brand || product.category}</div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0f172a', lineHeight: '1.4' }}>{product.name}</h3>
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>₹{product.price?.toLocaleString()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', padding: '4px 8px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: '#d97706' }}><Star size={14} fill="#d97706" /> 4.8</div>
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

  // ==========================================
  // VIEW 2: YOUR BEAUTIFUL SUB-CATEGORY MENU
  // ==========================================
  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', padding: '40px 20px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        
        <button onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px', background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', color: '#64748b', fontWeight: '600', transition: 'all 0.2s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
          <ArrowLeft size={18}/> Back to Home
        </button>

        <div style={{marginBottom: '50px', textAlign: 'center'}}>
          <h1 style={{fontSize: '3rem', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0', letterSpacing: '-1px'}}>
            {catId} <span style={{color: '#3b82f6'}}>Collection</span>
          </h1>
          <p style={{color: '#64748b', fontSize: '1.2rem'}}>Refine your search by category.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
          {subCats.length > 0 ? subCats.map((sub) => (
            <div 
              key={sub.name}
              onClick={() => navigate(`/category/${catId}/${sub.name}`)}
              style={{ background: 'white', padding: '40px 20px', borderRadius: '20px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
            >
              <div style={{ background: '#eff6ff', padding: '24px', borderRadius: '50%', color: '#3b82f6', marginBottom: '25px', transition: 'transform 0.3s ease' }}>
                {sub.icon}
              </div>
              <h3 style={{fontSize: '1.3rem', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0'}}>{sub.name}</h3>
              <p style={{color: '#94a3b8', fontSize: '0.95rem', margin: 0}}>{sub.desc}</p>
            </div>
          )) : (
            <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: '#94a3b8', background: 'white', borderRadius: '16px'}}>
              <p>No sub-categories defined for this section yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoryPage;