import React from "react";
import { Card } from "react-bootstrap";

const MarketValue = ({engine, make, model, numberplate, transmission, year, enginecc, fuel, accidentreport = []}) => {
  return (
    <section id="market-value">
      <h3 className="h5">Accident Reports</h3>
      <p className="text-muted">Detailed report of the vehicles accident history</p>

      <Card className="mb-4">
        <Card.Body>
          <h4 className="h6">Vehicle Specifications</h4>
          <dl className="row mb-0">
            <dt className="col-sm-4">Engine</dt><dd className="col-sm-8">{engine}</dd>
            <dt className="col-sm-4">Make</dt><dd className="col-sm-8">{make}</dd>
            <dt className="col-sm-4">Model</dt><dd className="col-sm-8">{model}</dd>
            <dt className="col-sm-4">Number Plate</dt><dd className="col-sm-8">{numberplate}</dd>
            <dt className="col-sm-4">Transmission</dt><dd className="col-sm-8">{transmission}</dd>
            <dt className="col-sm-4">Year</dt><dd className="col-sm-8">{year}</dd>
            <dt className="col-sm-4">Engine CC</dt><dd className="col-sm-8">{enginecc}</dd>
            <dt className="col-sm-4">Fuel</dt><dd className="col-sm-8">{fuel}</dd>
          </dl>
        </Card.Body>
      </Card>
    </section>
  );
};

export default MarketValue;
