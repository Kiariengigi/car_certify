import React from "react";
import { Card } from "react-bootstrap";
// REPLACE THIS WITH YOUR ACTUAL IMAGE PATH
import carWireframe from '../assets/accident_Car.png'; 

const MarketValue = ({ engine, make, model, numberplate, transmission, year, enginecc, fuel, accidentreport = [] }) => {

  // 1. Helper: Define colors for severity
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minor damage': return '#08CB00';       // Green
      case 'functional damage': return '#CFFF04';  // Neon Yellow
      case 'disabling damage': return '#FFA239';   // Orange
      case 'write off': return '#F93827';          // Red
      case 'write-off': return '#F93827';
      default: return null;
    }
  };

  // 2. Logic: Process reports to find active damage zones
  const locationStatus = {
    Front: null,
    Rear: null,
    Left: null,
    Right: null
  };

  if (Array.isArray(accidentreport)) {
    accidentreport.forEach(report => {
      if (report.location) {
        const locs = Array.isArray(report.location) ? report.location : [report.location];
        locs.forEach(loc => {
          // Normalize string to Title Case (Front, Left, etc.)
          const key = loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase();
          if (locationStatus[key] !== undefined) {
            // Assign color based on severity
            locationStatus[key] = getSeverityColor(report.severity);
          }
        });
      }
    });
  }

  // 3. Helper Component for the Red/Green/Yellow Dot
  const DamageMarker = ({ top, left, color, label }) => {
    if (!color) return null; // Don't show if no accident here
    return (
      <div
        style={{
          position: 'absolute',
          top: top,
          left: left,
          transform: 'translate(-50%, -50%)', // Center the dot on the coordinates
          width: '40px',
          height: '40px',
          backgroundColor: color,
          borderRadius: '50%',
          boxShadow: `0 0 15px ${color}`, // Glow effect
          opacity: 0.7,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '10px',
          color: 'white',
          textShadow: '0 0 2px black',
          border: '2px solid white'
        }}
        title={`${label}: Damage Reported`}
      >
        !
      </div>
    );
  };

  return (
    <section id="market-value">
      <h3 className="h5">Accident Reports</h3>
      <p className="text-muted">Detailed report of the vehicle's accident history</p>

      {/* --- CAR VISUALIZATION SECTION --- */}
      <Card className="mb-4">
        <Card.Body className="text-center">
          <h5 className="mb-3 text-start h6">Damage Visualization</h5>
          
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', overflow: 'hidden' }}>
            {/* THE CAR IMAGE */}
            <img 
              src={carWireframe} 
              alt="Vehicle Map" 
              style={{ width: '100%', maxWidth: '500px', display: 'block' }} 
            />

            {/* MARKERS (Adjust percentages if your image is oriented differently) 
               Assuming Left of Image = Rear, Right of Image = Front
            */}
            
            {/* Front (Right side of image) */}
            <DamageMarker top="50%" left="88%" color={locationStatus.Front} label="Front" />

            {/* Rear (Left side of image) */}
            <DamageMarker top="50%" left="12%" color={locationStatus.Rear} label="Rear" />

            {/* Left Side (Top of image) */}
            <DamageMarker top="15%" left="50%" color={locationStatus.Left} label="Left Side" />

            {/* Right Side (Bottom of image) */}
            <DamageMarker top="85%" left="50%" color={locationStatus.Right} label="Right Side" />

          </div>
          
          {/* Legend */}
          <div className="d-flex justify-content-center gap-3 mt-3 text-muted small">
             <div className="d-flex align-items-center"><span style={{width: 10, height: 10, background: '#08CB00', borderRadius: '50%', display: 'inline-block', marginRight: 5}}></span> Minor</div>
             <div className="d-flex align-items-center"><span style={{width: 10, height: 10, background: '#CFFF04', borderRadius: '50%', display: 'inline-block', marginRight: 5}}></span> Functional</div>
             <div className="d-flex align-items-center"><span style={{width: 10, height: 10, background: '#FFA239', borderRadius: '50%', display: 'inline-block', marginRight: 5}}></span> Disabling</div>
             <div className="d-flex align-items-center"><span style={{width: 10, height: 10, background: '#F93827', borderRadius: '50%', display: 'inline-block', marginRight: 5}}></span> Write-off</div>
          </div>

        </Card.Body>
      </Card>

      {/* --- SPECS SECTION --- */}
      <Card className="mb-4">
        <Card.Body>
          <h4 className="h6">Vehicle Specifications</h4>
          <div className="row">
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-4">Engine</dt><dd className="col-sm-8">{engine}</dd>
                <dt className="col-sm-4">Make</dt><dd className="col-sm-8">{make}</dd>
                <dt className="col-sm-4">Model</dt><dd className="col-sm-8">{model}</dd>
                <dt className="col-sm-4">Number Plate</dt><dd className="col-sm-8">{numberplate}</dd>
              </dl>
            </div>
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-4">Transmission</dt><dd className="col-sm-8">{transmission}</dd>
                <dt className="col-sm-4">Year</dt><dd className="col-sm-8">{year}</dd>
                <dt className="col-sm-4">Engine CC</dt><dd className="col-sm-8">{enginecc}</dd>
                <dt className="col-sm-4">Fuel</dt><dd className="col-sm-8">{fuel}</dd>
              </dl>
            </div>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};

export default MarketValue;