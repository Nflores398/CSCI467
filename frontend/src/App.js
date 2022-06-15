import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Admin from './Components/Admin';
import PlaceOrder from './Components/PlaceOrder';
import Packing from './Components/Packing';
import Checkout from './Components/Checkout';
import React from 'react';
import Receiving from './Components/Receiving';
import PrimaryNavBar from './Components/Nav';

function App() {
  return (
    <div className="App">
      <PrimaryNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Place%20Order" element={<PlaceOrder />} />
        <Route path="Packing" element={<Packing />} />
        <Route path="Receiving" element={<Receiving />} />
        <Route path="Admin" element={<Admin />} />
        <Route path="Checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
}

export default App;
