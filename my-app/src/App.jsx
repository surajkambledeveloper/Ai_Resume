import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './App.css'
import WithoutAi from './components/templatePage';
import ResumeEditor from './components/resumeEditor';
import Temp2 from './components/Temp2';

function App() {
 

  return (
    <>
    <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
         <Route exact path='/templatepage' element={<WithoutAi />} />
          <Route exact path='/temp1' element={<ResumeEditor/>} />
          <Route exact path='/temp2' element={<Temp2/>} />
          
        </Routes>
       {/* <Temp2/> */}
       {/* <Temp1/> */}
      </Router>

    </>
  )
}

export default App
