import { useState } from "react";

function MainContent({ data, setData }) {
  const [errors, setErrors] = useState({});

  // Regex from your schema
  const numPlateRegex = /^K[A-Z]{2}\s\d{3}[A-Z]$/;

  const validateField = (name, value) => {
    let err = "";

    switch (name) {
      case "numPlate":
        if (!value) err = "Number plate is required.";
        else if (!numPlateRegex.test(value))
          err = "Format must be K** **3** (e.g. KCP 123P)";
        break;

      case "make":
        if (!value.trim()) err = "Make is required.";
        break;

      case "model":
        if (!value.trim()) err = "Model is required.";
        break;

      case "year":
        if (!value) err = "Year is required.";
        else if (value < 1900 || value > new Date().getFullYear())
          err = "Invalid year.";
        break;

      case "engine":
        if (!value.trim()) err = "Engine is required.";
        break;

      case "engineCC":
        if (value && value < 0) err = "Engine CC cannot be negative.";
        break;

      case "fuel":
        if (!value) err = "Fuel type is required.";
        break;

      case "transmission":
        if (!value) err = "Transmission is required.";
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleChange = (name, value) => {
    setData({ ...data, [name]: value });
    validateField(name, value);
  };

  const errorClass = field =>
    errors[field] ? "form-control is-invalid" : "form-control";

  return (
    <div className="container py-4">
      <div className="row g-3">

        {/* Number Plate */}
        <div className="col-md-6">
          <label className="form-label">Number Plate</label>
          <input
            type="text"
            placeholder="KCP 123P"
            className={errorClass("numPlate")}
            value={data.numPlate}
            onChange={(e) => handleChange("numPlate", e.target.value)}
          />
          {errors.numPlate && (
            <div className="invalid-feedback">{errors.numPlate}</div>
          )}
        </div>

        {/* Make */}
        <div className="col-md-6">
          <label className="form-label">Make</label>
          <input
            type="text"
            placeholder="Toyota"
            className={errorClass("make")}
            value={data.make}
            onChange={(e) => handleChange("make", e.target.value)}
          />
          {errors.make && (
            <div className="invalid-feedback">{errors.make}</div>
          )}
        </div>

        {/* Model */}
        <div className="col-md-6">
          <label className="form-label">Model</label>
          <input
            type="text"
            placeholder="Prado"
            className={errorClass("model")}
            value={data.model}
            onChange={(e) => handleChange("model", e.target.value)}
          />
          {errors.model && (
            <div className="invalid-feedback">{errors.model}</div>
          )}
        </div>

        {/* Year */}
        <div className="col-md-6">
          <label className="form-label">Year of Manufacture</label>
          <select
            className={errorClass("year")}
            value={data.year}
            onChange={(e) => handleChange("year", Number(e.target.value))}
          >
            <option value="">Select year</option>
            {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => {
              const year = 2000 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          {errors.year && (
            <div className="invalid-feedback">{errors.year}</div>
          )}
        </div>

        {/* Engine */}
        <div className="col-md-6">
          <label className="form-label">Engine</label>
          <input
            type="text"
            placeholder="V6, 1.5L"
            className={errorClass("engine")}
            value={data.engine}
            onChange={(e) => handleChange("engine", e.target.value)}
          />
          {errors.engine && (
            <div className="invalid-feedback">{errors.engine}</div>
          )}
        </div>

        {/* Engine CC */}
        <div className="col-md-6">
          <label className="form-label">Engine CC</label>
          <input
            type="text"
            placeholder="1500"
            className={errorClass("engineCC")}
            value={data.engineCC}
            onChange={(e) => handleChange("engineCC", Number(e.target.value))}
          />
          {errors.engineCC && (
            <div className="invalid-feedback">{errors.engineCC}</div>
          )}
        </div>

        {/* Fuel */}
        <div className="col-md-6">
          <label className="form-label">Fuel Type</label>
          <div className="form-check">
            <input
              className={`form-check-input ${errors.fuel ? "is-invalid" : ""}`}
              type="radio"
              name="fuel"
              value="Petrol"
              checked={data.fuel === "Petrol"}
              onChange={(e) => handleChange("fuel", e.target.value)}
            />
            <label className="form-check-label">Petrol</label>
          </div>

          <div className="form-check">
            <input
              className={`form-check-input ${errors.fuel ? "is-invalid" : ""}`}
              type="radio"
              name="fuel"
              value="Diesel"
              checked={data.fuel === "Diesel"}
              onChange={(e) => handleChange("fuel", e.target.value)}
            />
            <label className="form-check-label">Diesel</label>
          </div>
          {errors.fuel && (
            <div className="text-danger small">{errors.fuel}</div>
          )}
        </div>

        {/* Transmission */}
        <div className="col-md-6">
          <label className="form-label">Transmission</label>
          <div className="form-check">
            <input
              className={`form-check-input ${errors.transmission ? "is-invalid" : ""}`}
              type="radio"
              name="transmission"
              value="Automatic"
              checked={data.transmission === "Automatic"}
              onChange={(e) => handleChange("transmission", e.target.value)}
            />
            <label className="form-check-label">Automatic</label>
          </div>

          <div className="form-check">
            <input
              className={`form-check-input ${errors.transmission ? "is-invalid" : ""}`}
              type="radio"
              name="transmission"
              value="Manual"
              checked={data.transmission === "Manual"}
              onChange={(e) => handleChange("transmission", e.target.value)}
            />
            <label className="form-check-label">Manual</label>
          </div>

          {errors.transmission && (
            <div className="text-danger small">{errors.transmission}</div>
          )}
        </div>

      </div>
    </div>
  );
}

export default MainContent;
