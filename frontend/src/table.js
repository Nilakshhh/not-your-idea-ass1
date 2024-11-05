// src/RandomTable.js
import React, { useState, useEffect } from 'react';

const RandomTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    alcohol_type: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [alcoholTypes, setAlcoholTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  // Fetch data from the API on button click
  const fetchData = () => {
    setLoading(true);
    fetch('http://127.0.0.1:5000/')
      .then(response => response.json())
      .then(apiData => {
        setData(apiData);
        setFilteredData(apiData);
        
        // Extract unique values for dropdowns
        setAlcoholTypes([...new Set(apiData.map(item => item.MustHave))]);
        setLocations([...new Set(apiData.map(item => item.Address))]);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  // Apply filters to the data
  const applyFilters = () => {
    let newData = [...data];
    if (filters.date) {
      newData = newData.filter(item => item.PostingDate === filters.date);
    }
    if (filters.alcohol_type) {
      newData = newData.filter(item => item.MustHave === filters.alcohol_type);
    }
    if (filters.location) {
      newData = newData.filter(item => item.Address === filters.location);
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

      {/* Fetch Data Button */}
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>

      {/* Filter Inputs */}
      <div className="filters">
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        
        {/* Dropdown for Alcohol Type */}
        <select
          name="alcohol_type"
          value={filters.alcohol_type}
          onChange={handleFilterChange}
        >
          <option value="">Select Alcohol Type</option>
          {alcoholTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
        
        {/* Dropdown for Location */}
        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Table to showcase filtered data */}
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Link</th>
            <th>Alcohol Type</th>
            <th>Page Heading</th>
            <th>Posting Date</th>
            <th>Timing</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.Address}</td>
              <td><a href={row.Link} target="_blank" rel="noopener noreferrer">Click here</a></td>
              <td>{row.MustHave}</td>
              <td>{row.PageHeading}</td>
              <td>{row.PostingDate}</td>
              <td>{row.Timing}</td>
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
        .filters input, .filters select {
          margin-right: 10px;
        }
        button {
          margin-bottom: 20px;
          padding: 10px 20px;
          background-color: #007BFF;
          color: white;
          border: none;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default RandomTable;
