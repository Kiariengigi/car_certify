import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from 'react-bootstrap';
import Header from "../Landing/header"; // Double check your path
import GeneralSummary from "./GeneralSummary";
import Mileage from "./Mileage";
import Modal from 'react-modal';
import Ownership from "./Ownership";
import MarketValue from "./MarketValue";
import noVehicle from "../assets/No_vehicle_found.png"
import { useNavigate } from 'react-router-dom';

import "../Styles/report_styles.css";

const VehicleReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noVehichleopen, setnoVehicleopen] = useState(false)
  
  const opennoVehicle = () => setnoVehicleopen(true)
  const closenoVehicle = () => setnoVehicleopen(false)

  // 1. USE EFFECT: Runs once when component loads
  useEffect(() => {
    const fetchReport = async () => {

      function formatNumberPlate(input){
        if (!input) return ""
        let cleaned = input.replace(/\s+/g, "").toUpperCase()

        const match = cleaned.match(/^([A-Z]{3})(\d{3})([A-Z])$/);

        if (!match) return cleaned;

        const [, letters, numbers, lastLetter] = match;
        return `${letters} ${numbers}${lastLetter}`;
      }
      
      const numPlate = formatNumberPlate(localStorage.getItem("numPlate"))


      try {
        // Making the POST request to generate/fetch the report
        const response = await axios.get(`http://localhost:3542/report/retrieve/${numPlate}`);
        
        console.log("Server Response:", response.data);
        
        // 2. SAVE DATA: Store the response in state
        setReportData(response.data);
        
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        // Stop loading whether success or failure
        setLoading(false);
      }
    };

    fetchReport();
  }, []); // Empty dependency array [] means "run only once on load"

    const firstStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      height: '80vh',
      width: '60vw',
      borderRadius: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      display: 'flex',
      gap: '2rem',
      overflowY: 'hidden',
    },
    overlay: { backgroundColor: 'rgba(0,0,0,0.4)' },
  };
  
  // 3. LOADING STATE: Show a loading screen while waiting
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 4. ERROR STATE: If loading finished but no data came back
  if (!reportData) {
    return (
  <section 
    className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center"
  >
      <img className="w-25 mb-3" src={noVehicle} />

      <h1 className="mb-3">
        Sorry, No vehicles found with that number plate
      </h1>

      <Button onClick={() => navigate('/new')} className="w-25 btn-dark border-white mb-2">
        Enter new Vehicle
      </Button>

      <Button onClick={() => navigate('/')} className="w-25 btn-dark border-white">
        Return to home
      </Button>
  </section>
);
  }

  return (
    <div 
      id="report-scroll-container" 
      data-bs-spy="scroll" 
      data-bs-target="#mainNav" 
      data-bs-smooth-scroll="true"
      style={{ height: "100vh", overflowY: 'auto', overflowX: 'hidden' }}
    >
      {/* Pass Make/Model to Header if needed */}
      <Header />

      <main className="container mb-5" style={{ marginTop: "2rem" }}>
        
        {/* 5. PASS DATA TO CHILDREN: Send the specific parts of reportData to components */}
        <GeneralSummary 
          images={reportData.image}
          make={reportData.make}
          model={reportData.model}
          year={reportData.year}
          engine={reportData.engine}
          numberplate={reportData.numPlate}
          rating={reportData.rating}
        />
        
        <Mileage 
          mileageHistory={reportData.mileageReports}
          currentMileage={reportData.current_mileage}
        />
        
        <MarketValue 
          engine={reportData.engine}
          make={reportData.make}
          model={reportData.model}
          numberplate={reportData.numPlate}
          transmission={reportData.transmission}
          year={reportData.year}
          enginecc={reportData.engine_CC}
          fuel={reportData.fuel_Type}
        />

      </main>
    </div>
  );
};

export default VehicleReport;