import React from "react";
import { Card } from "react-bootstrap";

const GeneralSummary = () => {
  return (
    <section id="general-summary" className="mb-5">
      <div className="row g-4">

        {/* Images Section */}
        <div className="col-lg-5 d-flex gap-2">
          <Card className="mb-3">
            <Card.Img 
              src="Images/report_sample/52cbdcb5-bd4d-4616-916c-2d7ed230d11e.jpg"
              className="img-fluid"
            />
          </Card>

          <div>
            <div className="position-relative">
              <img
                src="Images/report_sample/04181ab7-03cb-44e7-828d-49996233acb6.jpg"
                className="img-thumbnail-2 mb-2"
                alt="Thumb 1"
              />
            </div>

            <div className="d-flex">
              <div className="position-relative">
                <img
                  src="Images/report_sample/4e5668d7-94ad-40ad-b465-69b1783ad1c3.jpg"
                  className="img-thumbnail"
                  alt="Thumb 2"
                />
              </div>

              <div className="position-relative">
                <img
                  src="Images/report_sample/1c1535d4-d192-4946-a393-28a3f59e1159.jpg"
                  className="img-thumbnail"
                  alt="Thumb 3"
                />
                <div className="overlay d-flex justify-content-center align-items-center">
                  <span className="text-white fw-bold">+10 Photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="col-lg-7">
          <div className="d-flex justify-content-between">
            <div>
              <h2 className="h4">Mazda Demio 2015</h2>
              <p className="text-muted mb-1">KDP 123K</p>
              <span className="p-1 px-2 rounded-2 bg-black text-white">
                <i className="fa-solid fa-star"></i> 3.5
              </span>
            </div>

            <div>
              <span className="text-success h2">Ksh 750,000 - 800,000</span>
              <br />
              <strong>Estimated Market Value</strong>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            {[1, 2, 3].map((i) => (
              <span key={i} className="indicator_card">
                <p className="h5">Mileage</p>
                <span className="px-1 rounded-2 bg-black text-white d-flex gap-1">
                  <i className="fa-solid fa-exclamation-triangle mt-1" style={{ fontSize: "0.7em" }}></i>
                  <p style={{ fontSize: "0.7em" }}>Attention</p>
                </span>
                <p style={{ fontSize: "0.7em" }}>Mileage discrepancies detected</p>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default GeneralSummary;
