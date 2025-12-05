import { Card } from "react-bootstrap";
import React, { useState } from 'react';
import Modal from 'react-modal';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Ensure Modal is bound to app
Modal.setAppElement('#root');

// ADD 'accidents' TO PROPS HERE vvv
const GeneralSummary = ({ images = [], make, model, year, rating, flag = [], numberplate, accidents = [] }) => {
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const mainImage = images && images.length > 0 ? images[0] : "nocar.jpg";
  const photos = [images[1], images[2], images[3], images[4]];

  const getBackgroundColor = (rating) => {
    switch (rating) {
      case 1: return "#ff4d4f"; 
      case 2: return "#ff7a45"; 
      case 3: return "#ffa940"; 
      case 4: return "#bae637"; 
      case 5: return "#52c41a"; 
      default: return "#d9d9d9"; 
    }
  };

  const style = {
    display: "inline-block",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    backgroundColor: getBackgroundColor(rating),
    color: "#fff",
    fontWeight: "bold",
  };

  // --- MILEAGE LOGIC ---
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
        return { css: "bg-danger text-white", icon: "fa-triangle-exclamation", title: "Critical", msg: "Major mileage discrepancy" };
      case "HIGH DEVIATION":
        return { css: "bg-warning text-dark", icon: "fa-exclamation-circle", title: "Attention", msg: "Mileage discrepancies detected" };
      case "Normal":
        return { css: "bg-success text-white", icon: "fa-check-circle", title: "Good", msg: "Mileage is consistent" };
      default:
        return { css: "bg-secondary text-white", icon: "fa-question-circle", title: "Unknown", msg: "Data unavailable" };
    }
  };

  // --- ACCIDENT LOGIC (NEW) ---
  const getAccidentStatus = (accidentList) => {
    // 1. If empty -> Green
    if (!accidentList || accidentList.length === 0) {
      return {
        css: "bg-success text-white",
        icon: "fa-shield-check",
        title: "Clean History",
        msg: "No accidents reported"
      };
    }

    // 2. Check for Severe keywords -> Red
    // Change 'severity' to match your database field (e.g. 'type' or 'damageLevel')
    const hasSevere = accidentList.some(acc => 
      acc.severity && ["Minor damage", "Functional damage", "Disabling damage", "Write-off"].includes(acc.severity)
    );

    if (hasSevere) {
      return {
        css: "bg-danger text-white",
        icon: "fa-car-burst",
        title: "Severe Damage",
        msg: "Structural damage reported"
      };
    }

    // 3. Default (Populated but not severe) -> Yellow
    return {
      css: "bg-warning text-dark",
      icon: "fa-triangle-exclamation",
      title: "Accident Found",
      msg: "Minor damage reported"
    };
  };

  // CALCULATION
  const worstFlagFound = determineOverallStatus(flag);
  const mileageStatus = getStyleFromFlag(worstFlagFound);
  const accidentStatus = getAccidentStatus(accidents);

  return (
    <section id="general-summary" className="mb-5">
      <div className="row g-4">
        {/* Images Section */}
        <div className="col-lg-5 d-flex gap-2">
          <Card className="mb-3 flex-shrink-0 w-50">
            <Card.Img src={mainImage} className="img-fluid" onClick={() => setFullscreenImg(mainImage)} style={{ cursor: "pointer" }} />
          </Card>
          <div className="d-flex flex-column gap-2">
            {photos[0] && <img src={photos[0]} className="img-thumbnail-2 mb-2" onClick={() => setFullscreenImg(photos[0])} style={{ cursor: "pointer" }} />}
            <div className="d-flex gap-2">
              {photos[1] && <img src={photos[1]} className="img-thumbnail flex-fill" onClick={() => setFullscreenImg(photos[1])} style={{ cursor: "pointer" }} />}
              {photos[2] && <img src={photos[2]} className="img-thumbnail flex-fill" onClick={() => setFullscreenImg(photos[2])} style={{ cursor: "pointer" }} />}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="col-lg-7">
          <div className="d-flex justify-content-between">
            <div>
              <h2 className="h2">{make} {model} {year}</h2>
              <p className="text-muted mb-1">{numberplate}</p>
              <div style={style}>
                <i className="fa-solid fa-star"></i> {rating} {rating === 1 ? "star" : "stars"}
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            
            {/* MILEAGE CARD */}
            <div className="mt-4 d-flex gap-2">
              <span className="indicator_card">
                <p className="h5">Mileage</p>
                <span className={`px-1 rounded-2 d-flex gap-1 ${mileageStatus.css}`}>
                  <i className={`fa-solid ${mileageStatus.icon} mt-1`} style={{ fontSize: "0.7em" }}></i>
                  <p style={{ fontSize: "0.7em", marginBottom: 0 }}>{mileageStatus.title}</p>
                </span>
                <p style={{ fontSize: "0.7em" }}>{mileageStatus.msg}</p>
              </span>
            </div>

            {/* ACCIDENT CARD (NEW) */}
            <div className="mt-4 d-flex gap-2">
              <span className="indicator_card">
                <p className="h5">Accidents</p>
                <span className={`px-1 rounded-2 d-flex gap-1 ${accidentStatus.css}`}>
                  <i className={`fa-solid ${accidentStatus.icon} mt-1`} style={{ fontSize: "0.7em" }}></i>
                  <p style={{ fontSize: "0.7em", marginBottom: 0 }}>{accidentStatus.title}</p>
                </span>
                <p style={{ fontSize: "0.7em" }}>{accidentStatus.msg}</p>
              </span>
            </div>

          </div>
        </div>
      </div>
      
      {/* Fullscreen Modal */}
      <Modal isOpen={!!fullscreenImg} onRequestClose={() => setFullscreenImg(null)} style={{ content: { top: "50%", left: "50%", right: "auto", bottom: "auto", transform: "translate(-50%, -50%)", background: "none", border: "none", padding: 0, overflow: "hidden", }, overlay: { backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1000, }, }}>
        <img src={fullscreenImg} alt="Fullscreen" style={{ maxHeight: "90vh", maxWidth: "90vw" }} onClick={() => setFullscreenImg(null)} />
      </Modal>
    </section>
  );
};

export default GeneralSummary;