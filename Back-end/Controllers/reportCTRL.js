const Vehicle = require("../Models/vehicle");
const Report = require("../Models/report");
const axios = require("axios");

exports.retrieveReport = async (req, res) => {
  try {
    const { numberPlate } = req.params;
    const vehicle = await Report.findOne({ numPlate: numberPlate }).lean();

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error retrieving full report:", error);
    return res.status(500).json({ error: "Failed to retrieve report" });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const { make, model, year, fuel } = req.query;
    let query = {};
    if (make) query.make = make;
    if (model) query.model = model;
    if (year) query.year = year;
    if (fuel) query.fuel_Type = fuel;

    const reports = await Report.find(query).sort({ _id: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNewReport = async (req, res) => {
  
  // --- RESTORED HELPER FUNCTIONS ---

// 1. Calculate Rating (0 - 10)
const calculateVehicleRating = (vehicle, accidents, mileageReports) => {
  let score = 10;
  const currentYear = new Date().getFullYear();
  const age = currentYear - (vehicle.year || currentYear);

  // A. Penalty for Age (Max -2 points)
  // Lose 0.1 point per year, capped at 2 points lost
  const agePenalty = Math.min(age * 0.1, 2);
  score -= agePenalty;

  // B. Penalty for Accidents
  // Minor: -1 | Functional: -3 | Disabling: -5 | Write-off: -10 (Automatic 1.0 rating)
  if (accidents && accidents.length > 0) {
    accidents.forEach(acc => {
      const severity = acc.severity ? acc.severity.toLowerCase() : "";
      if (severity.includes("write")) score -= 10;
      else if (severity.includes("disabling")) score -= 5;
      else if (severity.includes("functional")) score -= 3;
      else if (severity.includes("minor")) score -= 1;
    });
  }

  // C. Penalty for Mileage (Approximate)
  // Standard assumption: ~15,000 km/year is normal. 
  // If reports exist, check the last one.
  if (mileageReports && mileageReports.length > 0) {
    const lastReport = mileageReports[mileageReports.length - 1];
    const mileage = lastReport.mileage;
    
    // Expected mileage for age
    const expected = Math.max(age, 1) * 15000; 
    
    // If mileage is significantly higher than expected (e.g., double), penalize
    if (mileage > expected * 1.5) score -= 1;
    if (mileage > expected * 2.0) score -= 2;
  }

  // Ensure score stays between 1 and 10
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
};
  
  const Miles_to_Km = 1.60934;

  try {
    const { numPlate } = req.body;
    if (!numPlate) return res.status(400).json({ error: "numPlate is required" });

    const vehicle = await Vehicle.findOne({ numPlate });
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    // Try to find existing report or create new one
    let report = await Report.findOne({ vehicle: vehicle._id, user: req.user.id });
    if (!report) {
      report = new Report({
        vehicle: vehicle._id,
        user: req.user.id
      });
    }

    // 1. Prediction Logic (External API)
    let prediction = null;
    try {
      const payload = {
        make: vehicle.make?.toUpperCase(),
        model: vehicle.model?.toUpperCase(),
        year: Number(vehicle.year),
        engine_cc: Number(vehicle.engineCC),
        fuel_type: vehicle.fuel?.toUpperCase()
      };
      // Adjust URL if needed
      const resp = await axios.post("http://localhost:8000/predict", payload);
      prediction = Number(resp.data.predicted_mileage);
    } catch (err) {
      console.log("Prediction API skipped or failed"); // fail silently
      prediction = null;
    }

    // 2. Process Mileage Reports & Flags
    const updatedMileages = [];
    if (vehicle.mileageReports && vehicle.mileageReports.length > 0) {
      for (let r of vehicle.mileageReports) {
        const actualMileage = r.mileage;
        let predictedMileage = null;
        let flag = "Normal";

        if (prediction != null && actualMileage != null) {
          predictedMileage = prediction * Miles_to_Km; // Convert if API returns miles
          const diff = ((actualMileage - predictedMileage) / predictedMileage) * 100;
          
          if (Math.abs(diff) > 40) flag = "VERY HIGH DEVIATION";
          else if (Math.abs(diff) > 25) flag = "HIGH DEVIATION";
        }

        updatedMileages.push({
          date: r.date,
          mileage: actualMileage,
          predicted_mileage: predictedMileage,
          flag: flag
        });
      }
    }

    // 3. Compute Rating (RESTORED)
    const rating = calculateVehicleRating(vehicle, vehicle.accidentReports, vehicle.mileageReports);

    // 4. Fill Report Fields
    report.image = vehicle.image || [];
    report.make = vehicle.make;
    report.model = vehicle.model;
    report.year = vehicle.year;
    report.numPlate = vehicle.numPlate;
    report.engine = vehicle.engine;
    report.transmission = vehicle.transmission;
    report.engine_CC = vehicle.engineCC;
    report.fuel_Type = vehicle.fuel;
    report.accidents = vehicle.accidentReports;
    report.mileageReports = updatedMileages;
    report.rating = rating; // <--- Set the calculated rating
    
    report.current_mileage = vehicle.mileageReports.length
      ? vehicle.mileageReports[vehicle.mileageReports.length - 1].mileage
      : null;

    if (prediction != null) {
      report.predicted_mileage = prediction; 
    }

    await report.save();
    return res.status(201).json(report);

  } catch (err) {
    console.error("Error creating/retrieving report:", err);
    return res.status(500).json({ error: err.message });
  }
};