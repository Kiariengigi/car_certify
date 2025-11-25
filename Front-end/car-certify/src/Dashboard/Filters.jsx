import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Filters_styles.css';

function Filters() {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3542";

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMileage, setSelectedMileage] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/vehicleInfo/makes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMakes(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMakes();
  }, []);

  // Optional: fetch models for selected make
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/vehicleInfo/models/${selectedMake}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setModels(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchModels();
  }, [selectedMake]);

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
          onClick={() => navigate('/')} 
          className='report_btn bg-black border-0'>
          Generate New Report
        </Button>
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
          <Form.Select value={selectedMake} onChange={(e) => setSelectedMake(e.target.value)}>
            <option value="" disabled>E.g. Volkswagen</option>
            {makes.map((make, idx) => (
              <option key={idx} value={make}>{make}</option>
            ))}
          </Form.Select>
        </div>

        {/* Model */}
        <div>
          <p className='text-muted'>Select Model</p>
          <Form.Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <option value="" disabled>E.g. Passat</option>
            {models.map((model, idx) => (
              <option key={idx} value={model}>{model}</option>
            ))}
          </Form.Select>
        </div>

        {/* Year */}
        <div>
          <p className='text-muted'>Select Year</p>
          <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="" disabled>E.g. 2022</option>
            {years.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </Form.Select>
        </div>

        {/* Mileage */}
        <div>
          <p className='text-muted'>Select Mileage</p>
          <Form.Select value={selectedMileage} onChange={(e) => setSelectedMileage(e.target.value)}>
            <option value="" disabled>E.g. 100,000KM</option>
          </Form.Select>
        </div>

        {/* Fuel */}
        <div>
          <p className='text-muted'>Select Fuel Type</p>
          <Form.Select value={selectedFuel} onChange={(e) => setSelectedFuel(e.target.value)}>
            <option value="" disabled>E.g. Diesel</option>
          </Form.Select>
        </div>
      </div>
    </section>
  );
}

export default Filters;
