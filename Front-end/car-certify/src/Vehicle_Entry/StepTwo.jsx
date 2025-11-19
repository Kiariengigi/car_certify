import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Car, Calendar, Plus, Trash2, TrendingUp, History, MapPin } from 'lucide-react';

function StepTwo() {

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('mileageLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    mileage: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  useEffect(() => {
    localStorage.setItem('mileageLogs', JSON.stringify(logs));
  }, [logs]);

  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentMileage = sortedLogs.length ? sortedLogs[sortedLogs.length - 1].mileage : 0;
  const totalEntries = logs.length;

  const chartData = sortedLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mileage: log.mileage
  }));

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.mileage || !formData.date) return;

    const newLog = {
      id: Date.now(),
      mileage: Number(formData.mileage),
      date: formData.date,
      note: formData.note
    };

    setLogs([...logs, newLog]);
    setFormData({ mileage: '', note: '', date: formData.date });
  };

  const deleteLog = id => {
    setLogs(logs.filter(log => log.id !== id));
  };

  return (
    <div className="w-100 py-4" style={{width: '100%'}}>

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold d-flex align-items-center gap-2">
            <Car size={28} className="text-primary" />
            Vehicle Mileage Log
          </h2>
          <small className="text-muted">Track your odometer readings and usage trends.</small>
        </div>
        <div className="d-none d-md-block border rounded p-3 bg-white shadow-sm">
          <div className="text-uppercase text-muted small fw-semibold">Current Odometer</div>
          <div className="fw-bold fs-4">
            {currentMileage.toLocaleString()} <span className="fs-6 text-muted">mi</span>
          </div>
        </div>
      </div>

      <div className="row g-4">

        {/* LEFT: FORM */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">

              <h5 className="fw-semibold d-flex align-items-center gap-2 mb-3">
                <Plus size={18} className="text-primary" />
                Log New Entry
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
                      value={formData.date}
                      onChange={handleInputChange}
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
                      value={formData.mileage}
                      onChange={handleInputChange}
                      placeholder="45000"
                      required
                    />
                  </div>
                </div>

                {/* Submit */}
                <button className="btn btn-primary w-100 fw-semibold">
                  Save Entry
                </button>
              </form>

            </div>
          </div>
          <button
  className="btn btn-danger mt-3"
  onClick={() => {
    if (logs.length === 0) return;
    const updated = [...logs];
    updated.pop(); // remove last entry
    setLogs(updated);
  }}
>
  Delete Last Log
</button>

        </div>

        {/* RIGHT: CHART + HISTORY */}
        <div className="col-lg-8 vstack gap-4">

          {/* CHART */}
          <div className="card shadow-sm">
            <div className="card-body">

              <h5 className="fw-semibold d-flex align-items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-primary" />
                Mileage Trend
              </h5>

              <div style={{ height: "300px" }}>
                {logs.length > 1 ? (
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
