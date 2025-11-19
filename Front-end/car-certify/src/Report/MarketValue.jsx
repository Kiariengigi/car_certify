import React from "react";
import { Card } from "react-bootstrap";

const MarketValue = () => {
  return (
    <section id="market-value">
      <h3 className="h5">Market Value</h3>
      <p className="text-muted">Market Value</p>

      <Card className="mb-4">
        <Card.Body>
          <h4 className="h6">Vehicle Specifications</h4>
          <dl className="row mb-0">
            <dt className="col-sm-4">Engine</dt><dd className="col-sm-8">1.5L Petrol</dd>
            <dt className="col-sm-4">Transmission</dt><dd className="col-sm-8">Automatic</dd>
            <dt className="col-sm-4">Color</dt><dd className="col-sm-8">Silver</dd>
            <dt className="col-sm-4">Seats</dt><dd className="col-sm-8">5</dd>
          </dl>
        </Card.Body>
      </Card>

      {/* Gauge */}
      <div id="valueGauge">
        <div className="vefs-milestone-wrapper">
          <div className="milestone-container">
            <div className="chart-container1">
              <div className="line-container">
                <div className="line"></div>
                <div className="line left" style={{ width: "67%" }}></div>
              </div>

              <div className="dot-container">
                {[10, 25, 50].map((_, i) => (
                  <div key={i} className="milestones">
                    <div className="dot completed colored"></div>
                  </div>
                ))}
                <div className="milestones"><div className="dot"></div></div>
                <div className="milestones"><div className="dot"></div></div>
              </div>
            </div>

            <div className="label-container">
              <div className="milestones"><div className="label colored">10%</div></div>
              <div className="milestones"><div className="label colored">25%</div></div>
              <div className="milestones"><div className="label colored">50%</div></div>
              <div className="milestones"><div className="label">80%</div></div>
              <div className="milestones"><div className="label">100%</div></div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketValue;
