import React from "react";
import Header from "./Header";
import GeneralSummary from "./GeneralSummary";
import Mileage from "./Mileage";
import Ownership from "./Ownership";
import MarketValue from "./MarketValue";

import "../Styles/report_styles.css";

const VehicleReport = () => {
  return (
    <div data-bs-spy="scroll" data-bs-target="#mainNav" data-bs-smooth-scroll="true" style={{height: "100vh", overflow: 'auto'}}>
      <Header />

      <main className="container mb-5" style={{ marginTop: "8rem" }}>
        <GeneralSummary />
        <Mileage />
        <MarketValue />
      </main>
    </div>
  );
};

export default VehicleReport;
