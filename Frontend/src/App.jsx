import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Chart from './pages/Chart';
import axios from 'axios';
import { useEffect } from 'react';

function App(){
  const [alpha,setalpha]=useState();
  useEffect(()=>{
       axios.get('http://localhost:4000/data').then((response)=>{
             setalpha(JSON.stringify(response.data))
       }).catch((error)=>{
           console.log(error)
       })
  },[])
  return(
    <>
    <Router>
    <h1>{alpha}</h1>
 <Routes><Route path="/" element={<Home />} />
    <Route path="/chart" element={<Chart />} />
 </Routes>
 </Router> 
    </>
  )
}


// const App = () => (
//   <Router>
//   <Routes>
//     <Route path="/" element={<Home />} />
//     <Route path="/chart" element={<Chart />} />
//   </Routes>
// </Router>
// );

export default App;