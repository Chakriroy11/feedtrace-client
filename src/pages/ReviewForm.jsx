import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, UploadCloud, ShieldCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive'; // 🌟 Import the hook

const ReviewForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); // 📱 Listen for screen size
  
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const userName = localStorage.getItem('feedtrace_user_name') || 'Anonymous User';
  const savedEmail = localStorage.getItem('feedtrace_user_email') || '';

  const [formData, setFormData] = useState({
    email: savedEmail,
    comment: '',
    orderId: '',
    purchaseDate: '',
    bill: '', 
    usageContext: {
      reason: '',
      feature: '',
      issue: ''
    }
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContextChange = (e) => {
    setFormData({
      ...formData,
      usageContext: { ...formData.usageContext, [e.target.name]: e.target.value }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, bill: reader.result });
        toast.success("Bill attached successfully!"); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating!");
      return;
    }
    if (formData.comment.trim().split(/\s+/).length < 10) {
      toast.error("Review must be at least 10 words long.");
      return;
    }

    setLoading(true);

    const reviewPayload = {
      productId,
      productName: "Verified Product",
      user: userName,
      email: formData.email,
      rating,
      comment: formData.comment,
      purchaseDate: formData.purchaseDate,
      platform: "FeedTrace Direct",
      orderId: formData.orderId,
      bill: formData.bill,
      usageContext: formData.usageContext
    };

    try {
      const res = await fetch('${import.meta.env.VITE_API_URL}/api/reviews/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted! 🚀");
        navigate(`/product/${productId}`);
      } else {
        toast.error(data.error || "Failed to submit.");
      }
    } catch (err) {
      toast.error("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: '"Inter", sans-serif', 
      padding: isMobile ? '10px 10px 100px 10px' : '20px 20px 60px 20px' 
    }}>
      
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontWeight: 'bold', marginBottom: '20px' }}
      >
        <ArrowLeft size={18} /> {isMobile ? '' : 'Cancel'}
      </button>

      <div style={{ textAlign: 'center', marginBottom: isMobile ? '25px' : '40px' }}>
        <ShieldCheck size={isMobile ? 40 : 50} color="#10b981" style={{ marginBottom: '10px' }} />
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', margin: '0 0 10px 0', color: '#0f172a', fontWeight: '800' }}>Submit Review</h1>
        <p style={{ color: '#64748b', fontSize: isMobile ? '0.9rem' : '1.1rem' }}>Your feedback helps thousands of shoppers.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '30px' }}>
        
        {/* SECTION 1 */}
        <div style={{ ...cardStyle, padding: isMobile ? '20px' : '30px' }}>
          <h3 style={sectionHeader}>1. Rate Your Experience</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Your Email</label>
            <input 
              type="email" name="email" required value={formData.email} onChange={handleInputChange} 
              style={inputStyle} placeholder="you@example.com"
            />
          </div>
          
          <div style={{ display: 'flex', gap: isMobile ? '5px' : '10px', marginBottom: '25px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={isMobile ? 32 : 40} 
                fill={(hoverRating || rating) >= star ? "#f59e0b" : "transparent"} 
                color={(hoverRating || rating) >= star ? "#f59e0b" : "#cbd5e1"}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => !isMobile && setHoverRating(star)}
                onMouseLeave={() => !isMobile && setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <label style={labelStyle}>Write your review</label>
          <textarea 
            name="comment" rows="5" required placeholder="What did you love?"
            value={formData.comment} onChange={handleInputChange} style={inputStyle} 
          />
        </div>

        {/* SECTION 2: AI VERIFICATION */}
        <div style={{ ...cardStyle, padding: isMobile ? '20px' : '30px', border: '2px solid #eff6ff', background: '#f8fafc' }}>
          <h3 style={{ ...sectionHeader, color: '#3b82f6', fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
            2. Verify Purchase
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', // 🌟 Stack on mobile
            gap: '15px', 
            marginBottom: '20px' 
          }}>
            <div>
              <label style={labelStyle}>Order ID</label>
              <input type="text" name="orderId" required value={formData.orderId} onChange={handleInputChange} style={inputStyle} placeholder="OD123456" />
            </div>
            <div>
              <label style={labelStyle}>Purchase Date</label>
              <input type="date" name="purchaseDate" required value={formData.purchaseDate} onChange={handleInputChange} style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>Upload Bill Image</label>
          <div 
            onClick={() => document.getElementById('billUpload').click()} 
            style={{ 
              height: isMobile ? '120px' : '150px', 
              border: '2px dashed #94a3b8', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: formData.bill ? `url(${formData.bill}) center/cover no-repeat` : 'white' 
            }}
          >
            {!formData.bill ? (
              <>
                <UploadCloud size={30} color="#3b82f6" />
                <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Tap to upload bill</span>
              </>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.9)', padding: '8px 15px', borderRadius: '30px', fontWeight: 'bold', color: '#10b981', fontSize: '0.8rem' }}>
                <CheckCircle size={16} /> Attached
              </div>
            )}
          </div>
          <input id="billUpload" type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </div>

        {/* SECTION 3: CONTEXT */}
        <div style={{ ...cardStyle, padding: isMobile ? '20px' : '30px' }}>
          <h3 style={sectionHeader}>3. Provide Context</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Why buy this?</label>
              <input type="text" name="reason" value={formData.usageContext.reason} onChange={handleContextChange} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Favorite feature?</label>
              <input type="text" name="feature" value={formData.usageContext.feature} onChange={handleContextChange} style={inputStyle} />
            </div>
          </div>
        </div>

        <button 
          type="submit" disabled={loading} 
          style={{ width: '100%', padding: '18px', background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold' }}
        >
          {loading ? 'Verifying...' : 'Submit Verified Review'}
        </button>

      </form>
    </div>
  );
};

const cardStyle = { background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const sectionHeader = { marginTop: 0, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px', fontWeight: '800' };
const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '5px', color: '#475569' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' };

export default ReviewForm;