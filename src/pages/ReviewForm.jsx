import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, UploadCloud, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResponsive } from '../hooks/useResponsive'; 

const ReviewForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isMobile } = useResponsive(); 
  
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = storedUser.username || storedUser.name || localStorage.getItem('feedtrace_user_name') || 'Anonymous User';
  const savedEmail = storedUser.email || localStorage.getItem('feedtrace_user_email') || '';

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
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Bill image must be under 2MB");
      }
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
    
    const wordCount = formData.comment.trim().split(/\s+/).length;

    if (rating === 0) {
      toast.error("Please select a star rating!");
      return;
    }
    if (wordCount < 10) {
      toast.error(`Review is too short (${wordCount}/10 words). Please add more detail.`);
      return;
    }
    if (!formData.bill) {
      toast.error("Please upload your purchase bill for AI verification.");
      return;
    }

    setLoading(true);

    const reviewPayload = {
      productId,
      productName: "Verified Product", // This usually gets updated by backend
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
      // 🚀 FIXED: Changed single quotes to backticks (`)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Review submitted for AI Verification! 🚀");
        navigate(`/product/${productId}`);
      } else {
        toast.error(data.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Review Submit Error:", err);
      toast.error("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      fontFamily: '"Inter", sans-serif', 
      padding: isMobile ? '10px 10px 120px 10px' : '20px 20px 60px 20px' 
    }}>
      
      <button 
        onClick={() => navigate(-1)} 
        style={backBtnStyle}
      >
        <ArrowLeft size={18} /> {isMobile ? '' : 'Cancel & Go Back'}
      </button>

      <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '45px' }}>
        <div style={{ display: 'inline-flex', padding: '15px', background: '#ecfdf5', borderRadius: '20px', marginBottom: '15px' }}>
          <ShieldCheck size={isMobile ? 35 : 45} color="#10b981" />
        </div>
        <h1 style={{ fontSize: isMobile ? '1.8rem' : '2.6rem', margin: '0 0 10px 0', color: '#0f172a', fontWeight: '900', letterSpacing: '-1px' }}>Verified Review</h1>
        <p style={{ color: '#64748b', fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: '500' }}>AI-Powered verification ensures your feedback is trusted.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        
        {/* SECTION 1: RATING */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>1. Rate Your Experience</h3>

          <div style={{ marginBottom: '25px' }}>
            <label style={labelStyle}>Confirm Your Email</label>
            <input 
              type="email" name="email" required value={formData.email} onChange={handleInputChange} 
              style={inputStyle} placeholder="you@example.com"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={isMobile ? 36 : 48} 
                fill={(hoverRating || rating) >= star ? "#f59e0b" : "transparent"} 
                color={(hoverRating || rating) >= star ? "#f59e0b" : "#e2e8f0"}
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={() => !isMobile && setHoverRating(star)}
                onMouseLeave={() => !isMobile && setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <label style={labelStyle}>Detailed Feedback (Min. 10 words)</label>
          <textarea 
            name="comment" rows="6" required placeholder="What was your experience with the product? Mention pros and cons..."
            value={formData.comment} onChange={handleInputChange} style={{...inputStyle, resize: 'none'}} 
          />
          <div style={{textAlign: 'right', fontSize: '0.75rem', marginTop: '5px', color: '#94a3b8', fontWeight: '700'}}>
             Word Count: {formData.comment.trim() === '' ? 0 : formData.comment.trim().split(/\s+/).length}
          </div>
        </div>

        {/* SECTION 2: BILL VERIFICATION */}
        <div style={{ ...cardStyle, border: '2.5px solid #dbeafe', background: '#f8fafc' }}>
          <h3 style={{ ...sectionHeader, color: '#2563eb' }}>
            2. Purchase Verification
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '20px', 
            marginBottom: '25px' 
          }}>
            <div>
              <label style={labelStyle}>Order ID / Invoice No.</label>
              <input type="text" name="orderId" required value={formData.orderId} onChange={handleInputChange} style={inputStyle} placeholder="e.g. OD882711" />
            </div>
            <div>
              <label style={labelStyle}>Purchase Date</label>
              <input type="date" name="purchaseDate" required value={formData.purchaseDate} onChange={handleInputChange} style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>Upload Invoice/Bill Image</label>
          <div 
            onClick={() => document.getElementById('billUpload').click()} 
            style={{ 
              height: '180px', 
              border: '2px dashed #3b82f6', 
              borderRadius: '16px', 
              cursor: 'pointer', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: formData.bill ? `url(${formData.bill}) center/contain no-repeat white` : 'white',
              transition: 'all 0.2s ease'
            }}
          >
            {!formData.bill ? (
              <>
                <UploadCloud size={36} color="#3b82f6" style={{ marginBottom: '10px' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>Select Image (JPG/PNG)</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AI will analyze this to verify you.</span>
              </>
            ) : (
              <div style={{ background: 'rgba(255,255,255,0.95)', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <CheckCircle size={20} /> Bill Attached
              </div>
            )}
          </div>
          <input id="billUpload" type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </div>

        {/* SECTION 3: USAGE CONTEXT */}
        <div style={cardStyle}>
          <h3 style={sectionHeader}>3. Usage Context</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Primary reason for purchase?</label>
              <input type="text" name="reason" value={formData.usageContext.reason} onChange={handleContextChange} style={inputStyle} placeholder="Personal use, Gift, Work, etc." />
            </div>
            <div>
              <label style={labelStyle}>Which feature did you like most?</label>
              <input type="text" name="feature" value={formData.usageContext.feature} onChange={handleContextChange} style={inputStyle} placeholder="Performance, Battery, Style..." />
            </div>
          </div>
        </div>

        <button 
          type="submit" disabled={loading} 
          style={submitBtnStyle(loading)}
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={22} /> Analyzing with AI...</>
          ) : 'Submit Verified Review'}
        </button>

      </form>
    </div>
  );
};

// --- STYLES ---
const cardStyle = { background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' };
const sectionHeader = { marginTop: 0, color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '25px', fontWeight: '900', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '8px', color: '#64748b', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', boxSizing: 'border-box', background: '#f8fafc', color: '#1e293b', fontWeight: '500' };
const backBtnStyle = { background: 'white', border: '1.5px solid #e2e8f0', padding: '12px 24px', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', fontWeight: '800', marginBottom: '25px', fontSize: '0.9rem' };
const submitBtnStyle = (loading) => ({ 
  width: '100%', padding: '20px', 
  background: loading ? '#64748b' : '#0f172a', 
  color: 'white', border: 'none', borderRadius: '18px', 
  fontSize: '1.2rem', fontWeight: '900', cursor: loading ? 'not-allowed' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease'
});

export default ReviewForm;