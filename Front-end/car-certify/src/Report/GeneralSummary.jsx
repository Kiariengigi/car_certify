import React from "react";
import { Card } from "react-bootstrap";

const GeneralSummary = ({images = [], make, model, year, rating, flags, numberplate}) => {
  const mainImage = images && images.length > 0 ? images[0] : "nocar.jpg"
  const photos = [images[1],images[2],images[3],images[4]]
  return (
    <section id="general-summary" className="mb-5">
      <div className="row g-4">
        {/* Images Section */}
        <div className="col-lg-5 d-flex gap-2">
          <Card className="mb-3">
            <Card.Img 
              src={mainImage}
              className="img-fluid"
            />
          </Card>

          <div>
            <div className="position-relative">
              <img
                src={photos[0]}
                className="img-thumbnail-2 mb-2"
                alt="Thumb 1"
              />
            </div>

            <div className="d-flex">
              <div className="position-relative">
                <img
                  src={photos[1]}
                  className="img-thumbnail"
                  alt="Thumb 2"
                />
              </div>

              <div className="position-relative">
                <img
                  src={photos[2]}
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
              <h2 className="h4">{make} {model} {year}</h2>
              <p className="text-muted mb-1">{numberplate}</p>
              <span className="p-1 px-2 rounded-2 bg-black text-white">
                <i className="fa-solid fa-star"></i> {rating}
              </span>
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
