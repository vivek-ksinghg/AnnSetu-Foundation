import React from 'react'
import ImageSection from '../component/ImageSection'
import Idea from '../component/Idea'
import ProblemStatement from '../component/ProblemStatement'
import Culture from '../component/Culture'
import HowToAdd from '../component/HowToAdd'
import CertificateGenerator from '../component/Certificategenerate'
import HowItWorks from '../component/HowItWorks'
import ContactUs from '../component/ContactUs'
import Faq from '../component/Faq'
import  AvailableFoods  from "./AvailableFoods"
import Chatbot from '../component/Chatbot'


const Home = () => {
  return (
    <div>
      <ImageSection></ImageSection>
      
      <ProblemStatement/>
     
      <Idea/>
      <Culture/>
      <HowToAdd/>

     
     
  
    </div>
  )
}

export default Home