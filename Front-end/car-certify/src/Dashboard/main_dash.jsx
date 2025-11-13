import React, { useState } from 'react';

function MockPapers() {
  const [papers, setPapers] = useState([...Array(6)].map((_, i) => ({
    id: i+1,
    question: `ISC Class XI Mid-term 2024`,
    year: 2024,
    student: 'Jho Smith',
    pages: '03',
    totalQuestions: 40,
    responses: 27
  })));

  return (
    <div className="mock-papers p-6">
      <div className="flex justify-between items-center mb-4">
        <h2>Mock Papers</h2>
        <button className="btn-orange">My Uploads</button>
      </div>
      <Filters />
      <PaperTable papers={papers} />
      <Pagination currentPage={2} totalPages={8} />
    </div>
  );
}

export default MockPapers;
