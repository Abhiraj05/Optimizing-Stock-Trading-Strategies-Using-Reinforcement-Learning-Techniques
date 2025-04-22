import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Chart from './pages/Chart';


function App(){
  return(
    <>
    <Router>
 <Routes><Route path="/" element={<Home />} />
    <Route path="/chart" element={<Chart />} />
 </Routes>
 </Router> 
    </>
  )
}


export default App;