import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom'
import { useState } from 'react'
import Landing from './Landing/landing.jsx'
import Home from './Dashboard/home.jsx'
import VehicleReport from './Report/VehicleReport.jsx'
import VehicleEntry from './Vehicle_Entry/Vehicle_Entry.jsx'

const App = () => {
  return (
    <div className='app'>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/report' element={<VehicleReport/>}></Route>
        <Route path='/new' element={<VehicleEntry/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
