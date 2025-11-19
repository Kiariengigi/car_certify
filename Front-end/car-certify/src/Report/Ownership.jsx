import React from "react";

const Ownership = () => {
  const records = [
    { label: "Manufactured", date: "March 2015", class: "status-manufactured" },
    { label: "Title Changed", date: "June 2016", class: "status-title-change" },
    { label: "For Sale", date: "September 2016", class: "status-sale" },
    { label: "Auctioned", date: "January 2020", class: "status-auction" }
  ];

  return (
    <section id="ownership" className="mb-5">
      <h3 className="h5 mb-1">Ownership</h3>
      <p className="text-muted">Who drove the car?</p>
      <p><small className="text-muted">Records found: <strong>4</strong></small></p>

      <ul className="list-group">
        {records.map((item, index) => (
          <li key={index} className="list-group-item d-flex align-items-start">
            <span className={`status-indicator ${item.class} me-3`}></span>
            <div>
              <strong>{item.label}</strong>
              <div className="text-muted small">{item.date}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Ownership;
