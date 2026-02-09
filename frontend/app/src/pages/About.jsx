import React from 'react'
import Faq from '../component/Faq'
import HowItWorks from '../component/HowItWorks'
import ContactUs from '../component/ContactUs'
import { Route,Routes } from 'react-router-dom'

const About = () => {
  return (
   <>
   
    <Routes>
      <Route path="Faq" element={ <Faq/>}></Route>
      <Route path="Hiw" element={  <HowItWorks/>}></Route>
      <Route path="ContactUs" element={  <ContactUs/>}></Route>
     
    </Routes>  
      
   </>
  )
}

export default About