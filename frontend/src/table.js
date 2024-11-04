// src/RandomTable.js
import React, { useState, useEffect } from 'react';

const dummyData = [
  { date: '2023-11-01', alcohol_type: 'Beer', location: 'Bar A', event_type: 'Happy Hour' },
  { date: '2023-11-02', alcohol_type: 'Wine', location: 'Restaurant B', event_type: 'Wine Tasting' },
  { date: '2023-11-03', alcohol_type: 'Whiskey', location: 'Club C', event_type: 'Live Music' },
  { date: '2023-11-04', alcohol_type: 'Cocktail', location: 'Lounge D', event_type: 'Cocktail Night' },
  { date: '2023-11-05', alcohol_type: 'Beer', location: 'Bar A', event_type: 'Trivia Night' },
];

const RandomTable = () => {
  const [data, setData] = useState(dummyData);
  const [filteredData, setFilteredData] = useState(dummyData);
  const [filters, setFilters] = useState({
    date: '',
    alcohol_type: '',
    location: '',
    event_type: '',
  });

  // Apply filters to the data
  const applyFilters = () => {
    let newData = [...data];
    if (filters.date) {
      newData = newData.filter(item => item.date === filters.date);
    }
    if (filters.alcohol_type) {
      newData = newData.filter(item => item.alcohol_type.toLowerCase().includes(filters.alcohol_type.toLowerCase()));
    }
    if (filters.location) {
      newData = newData.filter(item => item.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.event_type) {
      newData = newData.filter(item => item.event_type.toLowerCase().includes(filters.event_type.toLowerCase()));
    }
    setFilteredData(newData);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div>
      <h2>Event Data Table</h2>

      {/* Filter Inputs */}
      <div className="filters">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="alcohol_type"
          placeholder="Alcohol Type"
          value={filters.alcohol_type}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="event_type"
          placeholder="Event Type"
          value={filters.event_type}
          onChange={handleFilterChange}
        />
      </div>

      {/* Table to showcase filtered data */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Alcohol Type</th>
            <th>Location</th>
            <th>Event Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.date}</td>
              <td>{row.alcohol_type}</td>
              <td>{row.location}</td>
              <td>{row.event_type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f2f2f2;
        }
        .filters {
          margin-bottom: 20px;
        }
        .filters input {
          margin-right: 10px;
        }
      `}</style>
    </div>
  );
};

export default RandomTable;
