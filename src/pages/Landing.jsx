import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="content-box">
        <h1 className="title">Stop Fake Reviews.<br/><span>Start FeedTrace.</span></h1>
        <p className="sub-text">
          Join the community-driven platform that verifies authentic product experiences. 
          Upload proof, share truth, earn rewards.
        </p>
        <Link to="/login" className="landing-btn">
          Enter FeedTrace
        </Link>
      </div>
    </div>
  );
};
export default Landing;