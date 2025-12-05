import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filters from './Filters';
import { Link } from 'react-router-dom';

function Main_Dash() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // This state holds the filters coming from the Filters component
  const [activeFilters, setActiveFilters] = useState({
    make: "",
    model: "",
    year: "",
    fuel: ""
  });

  const API_URL = "http://localhost:3542";
  const token = localStorage.getItem('token');

  // This Effect runs every time 'activeFilters' changes
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        
        // Construct the query string (e.g., ?make=Toyota&year=2020)
        const params = new URLSearchParams();
        if (activeFilters.make) params.append("make", activeFilters.make);
        if (activeFilters.model) params.append("model", activeFilters.model);
        if (activeFilters.year) params.append("year", activeFilters.year);
        if (activeFilters.fuel) params.append("fuel", activeFilters.fuel);

        const res = await axios.get(`${API_URL}/vehicleInfo/reports/all?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setReports(res.data.data || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [activeFilters]);

  return (
    // FIX: Added style for height and overflow
    // "calc(100vh - 100px)" accounts for the Header height so the scrollbar appears correctly
    <div className="p-4" style={{ height: "calc(100vh - 120px)", overflowY: "auto" }}>
      
      {/* 1. The Filters Component */}
      <Filters onFilterChange={setActiveFilters} />

      {/* 2. The Results List */}
      <div className="mt-5 container">
        <h3 className="mb-4">Vehicle Reports</h3>
        
        {loading ? (
          <div className="text-center p-5">Loading reports...</div>
        ) : (
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Number Plate</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Fuel</th>
                  <th>Mileage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report._id}>
                      <td className="fw-bold">{report.numPlate}</td>
                      <td>{report.make}</td>
                      <td>{report.model}</td>
                      <td>{report.year}</td>
                      <td>{report.fuel_Type}</td>
                      <td>{report.current_mileage?.toLocaleString()} km</td>
                      <td>
                        <Link 
                          to={`/report/${report.numPlate}`} 
                          className="btn btn-sm btn-outline-dark"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-muted">
                      No reports found matching these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main_Dash;