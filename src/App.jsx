import React from 'react'
import Map from './pages/Map'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import SignUpForm from './pages/SignUpForm'
import Navbar from './Navbar/Navbar'
import Login from './pages/Login'
import AddFarmer from './pages/AddFarmer'
import WeatherChart from './pages/WeatherChart'
import FarmerDetails from './pages/FarmerDetails'
const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/SignUpForm' element={<SignUpForm/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Map' element={<Map/>}/>
        <Route path="/add-farmer" element={<AddFarmer />} />
        <Route path='/weather' element={<WeatherChart/>}/>
        <Route path="/farmer-details" element={<FarmerDetails />} />
      </Routes>
    </Router>
  )
}

export default App
