 
import { Route,Routes  } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './component/Navbar'

import Footer1 from './component/Footer1'
import ImpactOverview from './pages/ImpactOverview'
import About from './pages/About'

import MyProfile from './pages/MyProfile'
import MyDonations from './pages/MyDonations'
import BlogPage from './pages/Blog'
import Role from './pages/Role'

import DonorRegister from './pages/DonorRegister'
import NgoRegister from './pages/NgoRegister'
import AdminDonation from './pages/AdminDonation'
import VolunteerRegister from './pages/VolunteerRegister'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminApplications from './pages/AdminApplications'
import DonationPage from './pages/Donate'
import CertificateGenerator from './component/Certificategenerate'
import AvailableFoods from './pages/AvailableFoods'
import RequestPage from './pages/RequestPage'
import NgoProfile from './pages/NgoProfile'
import NgoDonations from './pages/NgoDonations'
import Chatbot from './component/Chatbot'

import { ToastContainer } from 'react-toastify'
import AdminAllNgo from './pages/AdminAllNgo'
import AdminAllVolunteer from './pages/AdminAllVolunteer'
import AdminAllDonor from './pages/AdminAllDonor'
import VolunteerRequests from './pages/VolunteerRequests'
import VolunteerHistory from './pages/VolunteerHistory'
import VolunteerProfile from './pages/VolunteerProfile'
import VolunteerDashboard from './pages/VolunteerDashboard'

import VolunteerPickedUpTasks from './pages/VolunteerPickedUpTasks'
import AllVolunteers from './pages/AllVolunteers'


function App() {

  return (
    <>
     <ToastContainer/>
      <Navbar/>

      <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/Impact' element={<ImpactOverview/>}/>
      <Route path="/role" element={<Role />} />
      <Route path="/donor/register" element={<DonorRegister />} />
      <Route path="/register/ngo" element={<NgoRegister />} />
      <Route path="/register/volunteer" element={<VolunteerRegister />} />
      <Route path="/admin/login" element={<AdminLogin/>} />
      <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      <Route path="/admin/applications" element={<AdminApplications/>} />
      <Route path="/admin/donations" element={<AdminDonation/>} />
      <Route path="/admin/AllNgo" element={<AdminAllNgo/>}></Route>
      <Route path="/admin/AllVolunteer" element={<AdminAllVolunteer/>}></Route>
      <Route path="/admin/AllDonor" element={<AdminAllDonor/>}></Route>
      
      <Route path="/my-profile" element={<MyProfile/>}/>
      <Route path="/my-donations" element={<MyDonations/>}/>
      <Route path="/my-certifications" element={<CertificateGenerator/>}/>
      <Route path="/allFoods" element={<AvailableFoods/>}/>
      <Route path="/allfoods" element={<AvailableFoods/>}/>
      <Route path="/volunteer/requests" element={<VolunteerRequests/>}/>
      <Route path="/volunteer/history" element={<VolunteerHistory/>}/>
      <Route path="/volunteer/profile" element={<VolunteerProfile/>}/>
      <Route path="/volunteer/dashboard" element={<VolunteerDashboard />}/>
      <Route path="/volunteer/active-tasks" element={<VolunteerPickedUpTasks/>}/>
      <Route path="/volunteers" element={<AllVolunteers/>}/>
      

      
      <Route path='/blog' element={<BlogPage/>}></Route>
      <Route path='/about/*' element={<About/>}></Route>
      <Route path="/addDonation" element={<DonationPage />} />

      {/* ngo route */}

      <Route path='/requests' element={<RequestPage/>}></Route>
      <Route path='/ngo/profile' element={<NgoProfile/>}></Route>
      <Route path='/donations' element={<NgoDonations/>}></Route>
    </Routes>
    <Chatbot/>

     <Footer1></Footer1>
  
    </>
  )
}

export default App
