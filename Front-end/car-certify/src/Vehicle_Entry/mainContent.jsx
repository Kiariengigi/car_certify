function MainContent() {
  return (
    <div className="container py-4">

      {/* Form Fields */}
      <div className="row g-3">
        {/* Hotel Name */}
        <div className="col-md-6">
          <label htmlFor="hotelName" className="form-label">Number Plate</label>
          <input
            type="text"
            id="hotelName"
            name="hotelName"
            placeholder="e.g. KCP 999P"
            className="form-control"
          />
          <small className="text-muted">This is your vehicles official number plate</small>
        </div>
        <div className="col-md-6">
          <label htmlFor="hotelName" className="form-label">Make</label>
          <input
            type="text"
            id="hotelName"
            name="hotelName"
            placeholder="e.g. Toyota"
            className="form-control"
          />
          <small className="text-muted">Manufacturer or brand of the vehicle</small>
        </div>
        <div className="col-md-6">
          <label htmlFor="hotelName" className="form-label">Model</label>
          <input
            type="text"
            id="hotelName"
            name="hotelName"
            placeholder="e.g. Prado"
            className="form-control"
          />
          <small className="text-muted">Vehicle model</small>
        </div>
        {/* Year Rating */}
        <div className="col-md-6">
  <label htmlFor="year" className="form-label">Year of Manufacture</label>
  <select id="year" name="year" className="form-select">
    {Array.from({ length: 31 }, (_, i) => {
      const year = 2000 + i; 
      return (
        <option key={year} value={year}>
          {year}
        </option>
      );
    })}
  </select>
  <small className="text-muted">Select the year your vehicle was manufactured.</small>
</div>
<div className="col-md-6">
          <label htmlFor="hotelName" className="form-label">Engine</label>
          <input
            type="text"
            id="hotelName"
            name="hotelName"
            placeholder="e.g., V6, 1.5L"
            className="form-control"
          />
          <small className="text-muted">Engine type</small>
        </div>
<div className="col-md-6">
  <label htmlFor="engineCC" className="form-label">Engine CC</label>
  <input
    type="number"
    id="engineCC"
    name="engineCC"
    className="form-control"
    placeholder="e.g. 1500"
  />
  <small className="text-muted">Enter the engine capacity in cubic centimeters (e.g., 1500 for 1.5L engine).</small>
</div>
<div className="col-md-6">
  <label className="form-label">Fuel Type</label>
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="fuel"
      id="fuelPetrol"
      value="Petrol"
    />
    <label className="form-check-label" htmlFor="fuelPetrol">
      Petrol
    </label>
  </div>
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="fuel"
      id="fuelDiesel"
      value="Diesel"
    />
    <label className="form-check-label" htmlFor="fuelDiesel">
      Diesel
    </label>
  </div>
  <small className="text-muted">Select the type of fuel your vehicle uses.</small>
</div>
<div className="col-md-6">
  <label className="form-label">Transmission</label>
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="transmission"
      id="transmissionAuto"
      value="Automatic"
    />
    <label className="form-check-label" htmlFor="transmissionAuto">
      Automatic
    </label>
  </div>
  <div className="form-check">
    <input
      className="form-check-input"
      type="radio"
      name="transmission"
      id="transmissionManual"
      value="Manual"
    />
    <label className="form-check-label" htmlFor="transmissionManual">
      Manual
    </label>
  </div>
  <small className="text-muted">Select the type of transmission your vehicle has.</small>
</div>


        
      </div>
    </div>
  );
}

export default MainContent;
