import {BrowserRouter as Router, Routes, Route, BrowserRouter} from 'react-router-dom'
import { useState } from 'react'
import Landing from './Landing/landing.jsx'
import Home from './Dashboard/home.jsx'

const App = () => {
  return (
    <div className='app'>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
