import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Filters_styles.css';

// Accept the 'onFilterChange' prop
function Filters({ onFilterChange }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3542";
  const token = localStorage.getItem('token');

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  
  // Local state for the dropdowns
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    fuel: ""
  });

  // 1. Fetch Makes on load
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await axios.get(`${API_URL}/vehicleInfo/makes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMakes(res.data.data || []);
      } catch (err) { console.error("Error loading makes:", err); }
    };
    fetchMakes();
  }, []);

  // 2. Fetch Models when Make changes
  useEffect(() => {
    if (!filters.make) {
      setModels([]); 
      return;
    }
    const fetchModels = async () => {
      try {
        const res = await axios.get(`${API_URL}/vehicleInfo/models/${filters.make}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setModels(res.data.data || []);
      } catch (err) { console.error("Error loading models:", err); }
    };
    fetchModels();
  }, [filters.make]);

  // 3. Handle Input Changes
  const handleInputChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // IMPORTANT: Send the new filters up to Main_Dash
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <section className='p-5'>
      <div className='d-flex justify-content-between align-items-start w-100'>
        <div>
          <h1 style={{fontSize: '4em'}}>Reports</h1>
          <p>Browse Reports</p>
        </div>
        <div className='d-flex gap-3'>
          <Button 
            style={{width: '12rem', height: '3rem'}} 
            onClick={() => navigate('/new')} 
            className='report_btn bg-black border-0'>
            Enter New Vehicle
          </Button>
        </div>
      </div>

      <div className='d-flex w-100 justify-content-between p-5 border border-1 shadow rounded-5'>
        {/* Make */}
        <div>
          <p className='text-muted'>Select Make</p>
          <Form.Select value={filters.make} onChange={(e) => handleInputChange("make", e.target.value)}>
            <option value="">All Makes</option>
            {makes.map((make, idx) => (
              <option key={idx} value={make}>{make}</option>
            ))}
          </Form.Select>
        </div>

        {/* Model */}
        <div>
          <p className='text-muted'>Select Model</p>
          <Form.Select value={filters.model} onChange={(e) => handleInputChange("model", e.target.value)}>
            <option value="">All Models</option>
            {models.map((model, idx) => (
              <option key={idx} value={model}>{model}</option>
            ))}
          </Form.Select>
        </div>

        {/* Year */}
        <div>
          <p className='text-muted'>Select Year</p>
          <Form.Select value={filters.year} onChange={(e) => handleInputChange("year", e.target.value)}>
            <option value="">All Years</option>
            {Array.from({length: 26}, (_, i) => 2025 - i).map(year => (
               <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
        </div>

        {/* Fuel */}
        <div>
          <p className='text-muted'>Select Fuel Type</p>
          <Form.Select value={filters.fuel} onChange={(e) => handleInputChange("fuel", e.target.value)}>
            <option value="">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
          </Form.Select>
        </div>
      </div>
    </section>
  );
}

export default Filters;