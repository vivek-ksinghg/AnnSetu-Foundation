import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import AppContextProvider from './context/Appcontext.jsx'
import AppContextProviderNgo from './context/AppcontextNgo.jsx'



createRoot(document.getElementById('root')).render(

<BrowserRouter>
<AppContextProviderNgo>
  <AppContextProvider>
  <App />
  
</AppContextProvider>
</AppContextProviderNgo>
</BrowserRouter>
  
 
)
