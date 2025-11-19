import React from "react";
import { Card } from "react-bootstrap";

const Mileage = () => {
  return (
    <section id="mileage" className="mb-5 d-flex gap-4">
      <div>
        <h3 className="h5 mb-1">Mileage</h3>
        <p className="text-muted">The distance a vehicle has covered</p>

        <Card className="mb-3">
          <Card.Body>
            <ul className="mb-0">
              <li>Current odometer: 120,000 km</li>
              <li>Average yearly: 20,000 km</li>
              <li>Last service check: 5,000 km ago</li>
            </ul>
          </Card.Body>
        </Card>
      </div>

      <div id="mileageChart" className="chart-container border rounded container-fluid">
        <div className="pulse"></div>
        <div className="area-chart">
          <div className="grid"></div>
        </div>
      </div>
    </section>
  );
};

export default Mileage;
