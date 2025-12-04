const Vehicle = require("../Models/vehicle");
const Report = require("../Models/report");
const axios = require("axios");

exports.retrieveReport = async (req, res) => {
  try {
    const { numberPlate } = req.params;

    // Find full vehicle report
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


exports.retrieveMyReports = async (req, res) => {
    res.send('report route works 2');
};

exports.createNewReport = async (req, res) => {
    const Miles_to_Km = 1.60934
    try {
        const { numPlate } = req.body;

        const vehicle = await Vehicle.findOne({ numPlate });
        if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

        let report = await Report.findOne({ vehicle: vehicle._id });
        if (!report) report = await Report.create({ vehicle: vehicle._id });

        // Latest prediction for the vehicle itself
        let prediction = null;
        try {
            const payload = {
                make: vehicle.make?.toUpperCase(),
                model: vehicle.model?.toUpperCase(),
                year: Number(vehicle.year),
                engine_cc: Number(vehicle.engineCC),
                fuel_type: vehicle.fuel?.toUpperCase()
            };
            const response = await axios.post("http://localhost:8000/predict", payload);
            prediction = Number(response.data.predicted_mileage) ;
            console.log(prediction)
        } catch (err) {
            console.error("Could not connect to mileage model:", err.message);
            prediction = "Not Available";
        }

        

        // Flag calculation
        function mileageFlag(predicted, recorded) {
            if (!predicted || !recorded) return "Not Available";
            const percentDiff = ((recorded - predicted) / predicted) * 100;
            if (Math.abs(percentDiff) > 40) return "VERY HIGH DEVIATION";
            if (Math.abs(percentDiff) > 25) return "HIGH DEVIATION";
            return "Normal";
        }

        //RATING SYSTEM
        function mileageScore(predicted, actual){
            if (!predicted || !actual) return 5
            const percentDiff = ((actual - predicted) / predicted) * 100
            if (percentDiff > 40) return 1 
            if (percentDiff > 25) return 2 
            if (percentDiff < -25) return 4
            return 3
        }
        function accidentScore(accidents){
            if (!accidents || accidents.length === 0) return 5
            let total = 0
            accidents.forEach(acc => {
                switch(acc.severity){
                    case "Write-off": total += 5; break
                    case "Functional damage": total += 3; break
                    case "Disabling damage": total += 1; break
                    case "Minor damage": total += 1; break
                    default: total += 2
                }
            })

            if (total >= 8) return 1
            if (total >= 5) return 2
            if (total >= 3) return 3
            return 4
        }
        function ageScore(year){
            const currentYear = new Date().getFullYear()
            const age = currentYear - year
            if (age > 15) return 1
            if (age > 10) return 2
            if (age > 5) return 3
            if (age > 2) return 4
            return 5
        }
        function calculateVehicleRating(predictedMileage, actualMileage, accidents, year){
            const mileageR = mileageScore(predictedMileage, actualMileage)
            const accidentR = accidentScore(accidents)
            const ageR = ageScore(year)

            const rating = Math.round((mileageR*0.4 + accidentR*0.4 + ageR*0.2))
            return Math.max(1, Math.min(5, rating))
        }

        // Predict all stored mileages
        async function predictAllMileages(vehicle) {
            const updatedReports = [];

            if (!vehicle.mileageReports || vehicle.mileageReports.length === 0 ){
                vehicle.mileageReports = []
            

            vehicle.mileageReports.push({
                date: new Date(),
                mileage: vehicle.currentMileage || 0 
            })
        }

            for (let r of vehicle.mileageReports) {
                // Ensure date is a Date object
                const reportDate = new Date(r.date);
                
                const payload = {
                    make: vehicle.make.toUpperCase(),
                    model: vehicle.model.toUpperCase(),
                    year: vehicle.year,
                    engine_cc: Number(vehicle.engineCC),
                    fuel_type: vehicle.fuel.toUpperCase()
                };

                let predictedMileage = null;
                let flag = "Not Available";

                // Handle property mismatch: 'mileage' vs 'recorded_mileage'
                const actualMileage = r.recorded_mileage || r.mileage;

                // --- FIX for Validation Error ---
                // If the schema requires 'mileage' but the doc has 'recorded_mileage',
                // we must set 'mileage' explicitly to pass Mongoose validation.
                if (r.mileage === undefined && actualMileage !== undefined) {
                    r.mileage = actualMileage;
                }

                try {

                    const response = await axios.post("http://localhost:8000/predict", payload);
                    predictedMileage = Number(response.data.predicted_mileage * Miles_to_Km) ;
                    flag = mileageFlag(predictedMileage, actualMileage);
                } catch (err) {
                    console.error("Prediction failed", r.date, err.message);
                }

                // Update subdocument properties if you want them saved to DB
                r.predicted_mileage = predictedMileage;
                r.flag = flag;

                // Push updated entry for response
                updatedReports.push({
                    date: r.date,
                    mileage: actualMileage,
                    predicted_mileage: predictedMileage,
                    flag
                });
            }

            // Save updates to vehicle
            await vehicle.save();

            return updatedReports;
        }

        // Pass 'vehicle', not 'report'
        const allReportsWithPredictions = await predictAllMileages(vehicle);

         report.image = vehicle.image || [];
        report.make = vehicle.make || "";
        report.model = vehicle.model || "";
        report.year = vehicle.year || "";
        report.numPlate = vehicle.numPlate || "";
        
        // Specs
        report.engine = vehicle.engine || "";
        report.transmission = vehicle.transmission || "";
        report.engine_CC = vehicle.engineCC || "";
        report.fuel_Type = vehicle.fuel || "";

        // Calculated Lists & Flags
        report.mileageReports = allReportsWithPredictions;
        report.flags = allReportsWithPredictions.map(r => r.flag);
        report.accidents = vehicle.accidentReports || [];
        
        // Current Mileage Logic
        report.current_mileage = vehicle.mileageReports?.length
            ? (vehicle.mileageReports[vehicle.mileageReports.length - 1].recorded_mileage || 
               vehicle.mileageReports[vehicle.mileageReports.length - 1].mileage)
            : null;
        
        report.rating = calculateVehicleRating(prediction, report.current_mileage, vehicle.accidentReports, vehicle.year)

        // Prediction
        if (prediction && prediction !== "Not Available") {
            report.predicted_mileage = prediction;
        }
        
        // Persist to MongoDB
        await report.save();

        const formattedReport = {
            photos: vehicle.image || [],
            make: vehicle.make || "",
            model: vehicle.model || "",
            year: vehicle.year || "",
            numPlate: vehicle.numPlate || "",
            rating: calculateVehicleRating(prediction, report.current_mileage, vehicle.accidentReports, vehicle.year),
            flags: allReportsWithPredictions.map(r => r.flag),
            price_range: report.price_range || [],
            // Ensure we access the correct property for current mileage
            current_mileage: vehicle.mileageReports?.length
                ? (vehicle.mileageReports[vehicle.mileageReports.length - 1].recorded_mileage || 
                   vehicle.mileageReports[vehicle.mileageReports.length - 1].mileage)
                : null,
            mileages: allReportsWithPredictions,
            accidents: vehicle.accidentReports || [],
            engine: vehicle.engine || "",
            transmission: vehicle.transmission || "",
            engineCC: vehicle.engineCC || "",
            fuelType: vehicle.fuel || ""
        };

        res.json(formattedReport);
    } catch (err) {
        // Detailed error logging for debugging
        console.error("Error creating/retrieving report:", err);
        res.status(500).json({ error: err.message });
    }
};