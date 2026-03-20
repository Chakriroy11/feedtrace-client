import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ShoppingBag, Info, Tag, Loader2 } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; 

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // States
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [activePrice, setActivePrice] = useState(0);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 🚀 FIXED: Changed single quotes to backticks (`) 
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/all`);
        
        const data = await res.json();
        
        // Ensure data is an array before trying to find the product
        const productList = Array.isArray(data) ? data : [];
        const foundProduct = productList.find(p => p._id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setActiveImage(foundProduct.image || null);
          setActivePrice(Number(foundProduct.price) || 0);

          if (foundProduct.variants && foundProduct.variants.length > 0) {
            const firstColor = foundProduct.variants.find(v => v.color)?.color || '';
            const firstStorage = foundProduct.variants.find(v => v.storage)?.storage || '';
            
            setSelectedColor(firstColor);
            setSelectedStorage(firstStorage);

            const initialVar = foundProduct.variants.find(v => v.color === firstColor && v.storage === firstStorage) || foundProduct.variants[0];
            setActivePrice(Number(initialVar.price) || Number(foundProduct.price) || 0);
          }
        }
      } catch (err) { 
        console.error("Error fetching product details:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProduct();
  }, [productId]);

  // --- VARIANT ENGINE ---
  const variants = product?.variants || [];
  const uniqueColors = Array.from(new Set(variants.map(v => v.color).filter(Boolean)));
  const variantsForCurrentColor = variants.filter(v => uniqueColors.length > 0 ? v.color === selectedColor : true);

  const storageOptions = [];
  const seenStorages = new Set();
  variantsForCurrentColor.forEach(v => {
    if (v.storage && !seenStorages.has(v.storage)) {
      seenStorages.add(v.storage);
      storageOptions.push(v);
    }
  });

  const allImages = [];
  if (product?.image) allImages.push(product.image);
  variants.forEach(v => { if (v.image && !allImages.includes(v.image)) allImages.push(v.image); });

  // --- HANDLERS ---
  const handleColorClick = (newColor) => {
    setSelectedColor(newColor);
    const newColorVariants = variants.filter(v => v.color === newColor);
    let bestVariant = newColorVariants.find(v => v.storage === selectedStorage) || newColorVariants[0];

    if (bestVariant) {
      if (bestVariant.storage) setSelectedStorage(bestVariant.storage);
      setActivePrice(Number(bestVariant.price) || Number(product.price));
      setActiveImage(bestVariant.image || product.image);
    }
  };

  const handleStorageClick = (variant) => {
    setSelectedStorage(variant.storage);
    setActivePrice(Number(variant.price) || Number(product.price));
    if (variant.image) setActiveImage(variant.image);
  };

  if (loading) return (
    <div style={{textAlign: 'center', padding: '100px 0', color: '#64748b'}}>
      <Loader2 className="animate-spin" style={{margin: '0 auto 10px'}} size={40} />
      <p>Loading Product Details...</p>
    </div>
  );
  
  if (!product) return (
    <div style={{textAlign: 'center', padding: '100px 0'}}>
      <ShoppingBag size={60} color="#cbd5e1" style={{margin: '0 auto 20px'}}/>
      <h2 style={{color: '#0f172a'}}>Product not found</h2>
      <button onClick={() => navigate('/home')} style={{marginTop: '15px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>Return Home</button>
    </div>
  );

  return (
    <div style={{
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: isMobile ? '10px 10px 120px 10px' : '0 20px 60px 20px', 
      fontFamily: '"Inter", sans-serif'
    }}>
      
      <button onClick={() => navigate(-1)} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: '600'}}>
        <ArrowLeft size={18}/> Back
      </button>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', 
        gap: isMobile ? '25px' : '50px', 
        background: 'white', 
        padding: isMobile ? '20px' : '40px', 
        borderRadius: '24px', 
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        
        {/* --- LEFT: MAIN IMAGE --- */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div style={{
            background: '#f8fafc', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '20px', 
            height: isMobile ? '300px' : '450px', 
            border: '1px solid #f1f5f9'
          }}>
            {activeImage ? (
              <img src={activeImage} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
            ) : (
              <ShoppingBag size={isMobile ? 50 : 80} color="#cbd5e1" />
            )}
          </div>

          {allImages.length > 1 && (
            <div style={{display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none'}}>
              {allImages.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    width: isMobile ? '60px' : '80px', 
                    height: isMobile ? '60px' : '80px', 
                    borderRadius: '12px', 
                    border: activeImage === imgUrl ? '2.5px solid #3b82f6' : '1.5px solid #e2e8f0', 
                    cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={imgUrl} alt="Thumbnail" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT: DETAILS --- */}
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{background: '#eff6ff', color: '#3b82f6', padding: '6px 14px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px', width: 'fit-content', letterSpacing: '0.5px'}}>
            {product.brand}
          </div>
          <h1 style={{fontSize: isMobile ? '1.7rem' : '2.4rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.1, letterSpacing: '-0.5px'}}>
            {product.name}
          </h1>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
             <span style={{fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '900', color: '#0f172a'}}>₹{activePrice.toLocaleString()}</span>
             <span style={{fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: '600'}}>₹{Math.round(activePrice * 1.05).toLocaleString()}</span>
          </div>

          <p style={{color: '#64748b', fontSize: '1rem', lineHeight: '1.7', marginBottom: '25px', fontWeight: '500'}}>{product.description}</p>

          {/* COLOR SELECTION */}
          {uniqueColors.length > 0 && (
            <div style={{marginBottom: '20px'}}>
              <h4 style={{fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px'}}>Select Color</h4>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {uniqueColors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => handleColorClick(color)}
                    style={{
                      padding: '10px 20px', borderRadius: '12px', border: selectedColor === color ? '2px solid #3b82f6' : '1.5px solid #e2e8f0',
                      background: selectedColor === color ? '#eff6ff' : 'white', color: selectedColor === color ? '#3b82f6' : '#475569',
                      fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s ease'
                    }}
                  >{color}</button>
                ))}
              </div>
            </div>
          )}

          {/* VARIANT/STORAGE SELECTION */}
          {storageOptions.length > 0 && (
            <div style={{marginBottom: '30px'}}>
              <h4 style={{fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 12px 0', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px'}}>Storage / Version</h4>
              <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
                {storageOptions.map(variant => (
                  <button 
                    key={variant.storage} 
                    onClick={() => handleStorageClick(variant)}
                    style={{
                      padding: '14px', borderRadius: '16px', cursor: 'pointer', flex: isMobile ? '1 1 45%' : 'none',
                      border: selectedStorage === variant.storage ? '2.5px solid #3b82f6' : '1.5px solid #e2e8f0',
                      background: selectedStorage === variant.storage ? '#eff6ff' : 'white', textAlign: 'center',
                      transition: 'all 0.2s ease', minWidth: '100px'
                    }}
                  >
                    <div style={{fontSize: '0.85rem', fontWeight: '800', color: selectedStorage === variant.storage ? '#3b82f6' : '#64748b', marginBottom: '4px'}}>{variant.storage}</div>
                    <div style={{fontSize: '1.1rem', fontWeight: '900', color: '#1e293b'}}>₹{Number(variant.price || product.price).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SPECIFICATIONS GRID */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div style={{marginBottom: '35px', background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9'}}>
              <h4 style={{fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', color: '#1e293b', marginBottom: '18px', letterSpacing: '0.5px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}>Technical Specs</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '12px'}}>
                {Object.entries(product.specifications).slice(0, 6).map(([key, value]) => (
                  <div key={key} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px'}}>
                    <span style={{color: '#64748b', fontWeight: '600'}}>{key}</span>
                    <span style={{fontWeight: '800', color: '#0f172a', textAlign: 'right'}}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => navigate(`/product/${productId}/review`)}
            style={{
              width: '100%', padding: '20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', 
              border: 'none', borderRadius: '16px', fontSize: '1.15rem', fontWeight: '900', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ShieldCheck size={24}/> Write Verified Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;