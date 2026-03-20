import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update state on resize
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowWidth,
    isMobile: windowWidth < 768,      // Phones
    isTablet: windowWidth >= 768 && windowWidth < 1024, // iPads/Tablets
    isDesktop: windowWidth >= 1024,   // Laptops/Monitors
    isSmallPhone: windowWidth < 400   // Extra small devices (iPhone SE)
  };
};