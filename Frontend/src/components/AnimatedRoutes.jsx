import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import Home from '../pages/Home';
import Chart from '../pages/Chart';
import Loading from './Loading';

const AnimatedRoutes = () => {
  const location = useLocation();
  const navType = useNavigationType(); // 'PUSH', 'POP', or 'REPLACE'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navType === 'PUSH') {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, navType]);

  if (loading) return <Loading />;

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chart" element={<Chart />} />
    </Routes>
  );
};

export default AnimatedRoutes;
