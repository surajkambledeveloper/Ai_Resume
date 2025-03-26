import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import './App.css'
import WithoutAi from './components/templatePage';
import ResumeEditor from './components/resumeEditor';
import Temp2 from './components/Temp2';
import Temp4 from './components/Temp4';
import Temp3 from './components/Temp3';
import Temp5 from './components/Temp5';
import Temp6 from './components/Temp6';
import Login from './components/Login';
import Signup from './components/Signup';
import Resumes from './components/Resumes';
import PrintableResume from "./components/PrintableResume";
import PasswordReset from './components/PasswordReset';
function App() {
 

  return (
    <>
    <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/templatepage' element={<WithoutAi />} />
          <Route exact path='/temp1' element={<ResumeEditor/>} />
          <Route exact path='/temp2' element={<Temp2/>} />
          <Route exact path='/temp4' element={<Temp4/>} />
          <Route exact path='/temp3' element={<Temp3/>} />
          <Route exact path='/temp5' element={<Temp5/>} />
          <Route exact path='/temp6' element={<Temp6/>} />
          <Route exact path='/Login' element={<Login/>} />
          <Route exact path='/Signup' element={<Signup/>} />
          <Route exact path='/PasswordReset' element={<PasswordReset/>} />
          <Route exact path="/printable-resume" element={<PrintableResume />} />
        </Routes>
      
      </Router>

    </>
  )
}

export default App
