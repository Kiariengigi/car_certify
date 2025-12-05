import React from "react";
import { Card } from "react-bootstrap";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts'

const Mileage = ({mileageHistory = [], currentMileage}) => {
  
  console.log(mileageHistory)
  
  const determineOverallStatus = (flagData) => {
    if (!Array.isArray(flagData) || flagData.length === 0) return "Not Available";
    const critical = flagData.find(item => item.flag === "VERY HIGH DEVIATION");
    if (critical) return "VERY HIGH DEVIATION";
    const warning = flagData.find(item => item.flag === "HIGH DEVIATION");
    if (warning) return "HIGH DEVIATION";
    return "Normal";
  };

  const getStyleFromFlag = (currentFlag) => {
    switch (currentFlag) {
      case "VERY HIGH DEVIATION":
        return "This vehicle has been flagged for 'Very High Deviation.' Our system calculates expected mileage based on previous service records and standard usage patterns. The current odometer reading differs from this projection by more than 40%.";
      case "HIGH DEVIATION":
        return "The recorded mileage deviates from the predicted usage by over 25%. We recommend verifying the service history to understand this inconsistency."
      case "Normal":
        return "The current odometer reading aligns with the vehicle's historical usage patterns and age. The mileage progression appears linear and consistent with previous service records, suggesting the vehicle has been used and maintained regularly without unexplained gaps.";
      default:
        return "Insufficient historical data to generate a mileage prediction. We cannot determine if the current mileage is consistent.";
    }
  };

    const worstFlagFound = determineOverallStatus(mileageHistory);
    const mileageStatus = getStyleFromFlag(worstFlagFound);

  return (
    <section id="mileage" className="mb-5 d-flex gap-4">
      <div className="col-4">
        <h3 className="h5 mb-1">Mileage</h3>
        <p className="text-muted">The distance a vehicle has covered</p>

        <Card className="mb-3">
          <Card.Body>
            <ul className="mb-0">
              <li>Current odometer: {currentMileage} km</li>
              <li>Insight: {mileageStatus}</li>
            </ul>
          </Card.Body>
        </Card>
      </div>

      <div id="mileageChart" className="chart-container border rounded container-fluid">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart width={500} height={400} data={mileageHistory}>
          <YAxis/>
          <XAxis dataKey="date"/>
          <CartesianGrid />
          <Tooltip/>
          <Legend/>
        <Area  fill="#3b82f6" stroke="#2563eb" type="monotone" dataKey="mileage"/>
        <Area  fill="#8b5cf6" stroke="#7c3aed" type="monotone" dataKey="predicted_mileage"/>
        </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Mileage;
