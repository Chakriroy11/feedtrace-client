import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, ShoppingBag, Info, Tag } from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import your hook

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); // 📱 Listen for screen size

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
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/products/all');
        const data = await res.json();
        const foundProduct = data.find(p => p._id === productId);
        
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
      } catch (err) { console.error(err); } finally { setLoading(false); }
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

  if (loading) return <div style={{textAlign: 'center', padding: '100px 0'}}>Loading...</div>;
  if (!product) return <div style={{textAlign: 'center', padding: '100px 0'}}>Product not found</div>;

  return (
    <div style={{
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: isMobile ? '10px 10px 100px 10px' : '0 20px 60px 20px', 
      fontFamily: '"Inter", sans-serif'
    }}>
      
      <button onClick={() => navigate(-1)} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: '600'}}>
        <ArrowLeft size={18}/> Back
      </button>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', // 🌟 Stack on mobile
        gap: isMobile ? '25px' : '50px', 
        background: 'white', 
        padding: isMobile ? '20px' : '40px', 
        borderRadius: '24px', 
        border: '1px solid #e2e8f0'
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
            height: isMobile ? '300px' : '450px', // 🌟 Scale image height
            border: '1px solid #f1f5f9'
          }}>
            {activeImage ? (
              <img src={activeImage} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
            ) : (
              <ShoppingBag size={isMobile ? 50 : 80} color="#cbd5e1" />
            )}
          </div>

          {allImages.length > 1 && (
            <div style={{display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px'}}>
              {allImages.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActiveImage(imgUrl)}
                  style={{
                    width: isMobile ? '50px' : '65px', 
                    height: isMobile ? '50px' : '65px', 
                    borderRadius: '10px', 
                    border: activeImage === imgUrl ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
                    cursor: 'pointer', overflow: 'hidden', flexShrink: 0
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
          <div style={{background: '#eff6ff', color: '#3b82f6', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px', width: 'fit-content'}}>
            {product.brand}
          </div>
          <h1 style={{fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.2}}>
            {product.name}
          </h1>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
             <span style={{fontSize: isMobile ? '1.8rem' : '2.2rem', fontWeight: '900', color: '#0f172a'}}>₹{activePrice.toLocaleString()}</span>
             <span style={{fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through'}}>₹{Math.round(activePrice * 1.05).toLocaleString()}</span>
          </div>

          <p style={{color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '25px'}}>{product.description}</p>

          {/* COLOR */}
          {uniqueColors.length > 0 && (
            <div style={{marginBottom: '20px'}}>
              <h4 style={{fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 10px 0', textTransform: 'uppercase', fontWeight: '700'}}>Color</h4>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {uniqueColors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => handleColorClick(color)}
                    style={{
                      padding: '8px 16px', borderRadius: '10px', border: selectedColor === color ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      background: selectedColor === color ? '#eff6ff' : 'white', color: selectedColor === color ? '#3b82f6' : '#475569',
                      fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem'
                    }}
                  >{color}</button>
                ))}
              </div>
            </div>
          )}

          {/* STORAGE */}
          {storageOptions.length > 0 && (
            <div style={{marginBottom: '25px'}}>
              <h4 style={{fontSize: '0.9rem', color: '#94a3b8', margin: '0 0 10px 0', textTransform: 'uppercase', fontWeight: '700'}}>Variant</h4>
              <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {storageOptions.map(variant => (
                  <button 
                    key={variant.storage} 
                    onClick={() => handleStorageClick(variant)}
                    style={{
                      padding: '12px', borderRadius: '12px', cursor: 'pointer', flex: isMobile ? '1 1 40%' : 'none',
                      border: selectedStorage === variant.storage ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      background: selectedStorage === variant.storage ? '#eff6ff' : 'white', textAlign: 'center'
                    }}
                  >
                    <div style={{fontSize: '0.8rem', fontWeight: '700', color: selectedStorage === variant.storage ? '#3b82f6' : '#64748b'}}>{variant.storage}</div>
                    <div style={{fontSize: '1rem', fontWeight: '800', color: '#0f172a'}}>₹{Number(variant.price || product.price).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SPECS */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div style={{marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '16px'}}>
              <h4 style={{fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '15px'}}>Key Features</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                  <div key={key} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                    <span style={{color: '#64748b'}}>{key}</span>
                    <span style={{fontWeight: '700', color: '#1e293b'}}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => navigate(`/product/${productId}/review`)}
            style={{
              width: '100%', padding: '18px', background: '#0f172a', color: 'white', 
              border: 'none', borderRadius: '14px', fontSize: '1.1rem', fontWeight: '800', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}
          >
            <ShieldCheck size={22}/> Write Verified Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;