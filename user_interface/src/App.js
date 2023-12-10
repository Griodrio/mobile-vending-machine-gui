import React,{useEffect} from 'react';
import MainSection from './MainSection';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './AppStyle.css'
import Menu from './Menu';

function App() {
  useEffect(() => {
	  //change this to the script source you want to load, for example this is snap.js sandbox env
	  const midtransScriptUrl = 'https://app.midtrans.com/snap/snap.js'; 
	  //change this according to your client-key
	  const myMidtransClientKey = 'SB-Mid-client-QBPwAY5JasIS2N8s'; 
	 
	  let scriptTag = document.createElement('script');
	  scriptTag.src = midtransScriptUrl;
	  // optional if you want to set script attribute
	  // for example snap.js have data-client-key attribute
	  scriptTag.setAttribute('data-client-key', myMidtransClientKey);
	 
	  document.body.appendChild(scriptTag);
	  return () => {
	    document.body.removeChild(scriptTag);
	  }
	}, []);

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<MainSection/>}/>
        <Route path="/Menu" element={<Menu/>}/>
      </Routes>
    </Router>
    
    </>
  )
}

export default App;
