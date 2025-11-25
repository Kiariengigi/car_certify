import Sidebar from './sidebar';
import MainContent from './mainContent';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import { useEffect, useState } from 'react';

function Vehicle_Entry() {
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("vehicleStep");
    return savedStep ? Number(savedStep) : 1;
  });

  const [vehicleData, setVehicleData] = useState(() => {
    const saved = localStorage.getItem("vehicleData");
    return saved ? JSON.parse(saved) : {
      numPlate: "",
      make: "",
      model: "",
      year: "",
      engine: "",
      engineCC: "",
      transmission: "",
      fuel: "",
      image: [],
      mileageReports: [],
      accidentReports: [],
    };
  });

  const totalSteps = 4;
  const API_URL = "http://localhost:3542";
  const token = localStorage.getItem('token');

  const handleNext = () => {
    if (!validateStep()) {
      alert("Please enter all required fields correctly.");
      return;
    }
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    else if (currentStep === totalSteps) handleSubmit();
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <MainContent data={vehicleData} setData={setVehicleData} />;
      case 2: return <StepTwo data={vehicleData} setData={setVehicleData} />;
      case 3: return <StepThree data={vehicleData} setData={setVehicleData} />;
      case 4: return <StepFour data={vehicleData} setData={setVehicleData} />;
      default: return null;
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      return vehicleData.numPlate.match(/^K[A-Z]{2}\s\d{3}[A-Z]$/)
        && vehicleData.make.trim()
        && vehicleData.model.trim()
        && vehicleData.year
        && vehicleData.engine.trim()
        && vehicleData.fuel
        && vehicleData.transmission;
    }
    return true;
  };

  const handleSubmit = async () => {
    const form = new FormData();
    Object.entries(vehicleData).forEach(([key, value]) => {
      if (key === "image") value.forEach(file => form.append("image", file));
      else if (Array.isArray(value)) form.append(key, JSON.stringify(value));
      else form.append(key, value);
    });

    try {
      const response = await fetch(`${API_URL}/vehicleInfo/new`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert("Server Error: " + errorText);
        return;
      }

      const data = await response.json();
      console.log("Vehicle saved:", data);
      localStorage.removeItem("vehicleData");
      localStorage.removeItem("vehicleStep");
      alert("Vehicle saved successfully!");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("vehicleData", JSON.stringify(vehicleData));
  }, [vehicleData]);

  useEffect(() => {
    localStorage.setItem("vehicleStep", currentStep);
  }, [currentStep]);

  return (
    <div className='d-flex p-4 gap-4' style={{ height: '100vh' }}>
      <Sidebar currentStep={currentStep} />
      <div className='flex-grow-1 w-100 overflow-auto'>
        {/* Progress */}
        <div className="mb-4">
          <div className="d-flex align-items-center text-dark mb-2">Step {currentStep}/{totalSteps}</div>
          <div className="progress mb-2" style={{ height: '8px' }}>
            <div
              className="progress-bar bg-dark"
              role="progressbar"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {renderStep()}

        <div className="d-flex justify-content-between align-items-center border-top p-3 bg-white">
          <button className="btn btn-dark d-flex align-items-center" onClick={handlePrevious}>
            <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous
          </button>
          <button className={`btn d-flex align-items-center ${currentStep === totalSteps ? 'btn-success' : 'btn-dark'}`} onClick={handleNext}>
            Next
            <svg className="ms-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Vehicle_Entry;
