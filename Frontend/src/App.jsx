// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from './pages/Home';
// import Chart from './pages/Chart';


// function App(){
//   return(
//     <>
//     <Router>
//  <Routes><Route path="/" element={<Home />} />
//     <Route path="/chart" element={<Chart />} />
//  </Routes>
//  </Router> 
//     </>
//   )
// }


// export default App;

import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
