import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Car, Calendar, Plus, Trash2, TrendingUp } from 'lucide-react';

function StepTwo({ data, setData }) {
  const [newMileage, setNewMileage] = useState({ date: '', mileage: '' });

  // Load persisted data on mount
  useEffect(() => {
    const saved = localStorage.getItem('mileageReports');
    if (saved) setData(prev => ({ ...prev, mileageReports: JSON.parse(saved) }));
  }, [setData]);

  // Persist mileageReports whenever updated
  useEffect(() => {
    localStorage.setItem('mileageReports', JSON.stringify(data.mileageReports));
  }, [data.mileageReports]);

  const handleMileageChange = (field, value) => {
    setNewMileage(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!newMileage.date || !newMileage.mileage) return;

    const entry = {
      id: Date.now(),
      date: newMileage.date,
      mileage: Number(newMileage.mileage)
    };

    setData(prev => ({
      ...prev,
      mileageReports: [...prev.mileageReports, entry]
    }));

    setNewMileage({ date: '', mileage: '' });
  };

  const deleteLog = id => {
    setData(prev => ({
      ...prev,
      mileageReports: prev.mileageReports.filter(log => log.id !== id)
    }));
  };

  const sortedLogs = [...data.mileageReports].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mileage: log.mileage
  }));

  const currentMileage = sortedLogs.length ? sortedLogs[sortedLogs.length - 1].mileage : 0;

  return (
    <div className="w-100 py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold d-flex align-items-center gap-2">
            <Car size={28} className="text-primary" /> Vehicle Mileage Log
          </h2>
          <small className="text-muted">Track your odometer readings and usage trends.</small>
        </div>
        <div className="d-none d-md-block border rounded p-3 bg-white shadow-sm">
          <div className="text-uppercase text-muted small fw-semibold">Current Odometer</div>
          <div className="fw-bold fs-4">
            {currentMileage.toLocaleString()} <span className="fs-6 text-muted">km</span>
          </div>
        </div>
      </div>

      <div className="row g-4">

        {/* Form */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold d-flex align-items-center gap-2 mb-3">
                <Plus size={18} className="text-primary" /> Log New Entry
              </h5>

              <form onSubmit={handleSubmit} className="vstack gap-3">

                {/* Date */}
                <div>
                  <label className="form-label">Date</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <Calendar size={18} className="text-muted" />
                    </span>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={newMileage.date}
                      onChange={(e) => handleMileageChange('date', e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Mileage */}
                <div>
                  <label className="form-label">Odometer Reading</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white fw-bold text-muted">#</span>
                    <input
                      type="number"
                      name="mileage"
                      className="form-control"
                      value={newMileage.mileage}
                      onChange={(e) => handleMileageChange('mileage', e.target.value)}
                      placeholder="45000"
                      required
                    />
                  </div>
                </div>

                <button className="btn btn-primary w-100 fw-semibold">Save Entry</button>
              </form>
            </div>
          </div>

          {/* Delete last log */}
          <button
            className="btn btn-danger mt-3"
            onClick={() => {
              if (data.mileageReports.length === 0) return;
              setData(prev => ({
                ...prev,
                mileageReports: prev.mileageReports.slice(0, -1)
              }));
            }}
          >
            Delete Last Log
          </button>
        </div>

        {/* Chart + History */}
        <div className="col-lg-8 vstack gap-4">

          {/* Chart */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold d-flex align-items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-primary" /> Mileage Trend
              </h5>

              <div style={{ height: "300px" }}>
                {data.mileageReports.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="mileage" stroke="#0d6efd" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                    <TrendingUp size={32} className="mb-2 opacity-50" />
                    Add at least two logs to see trends
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default StepTwo;
