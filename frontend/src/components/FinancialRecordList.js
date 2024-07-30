import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const FinancialRecordList= ({setAuthToken}) => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate =useNavigate()
  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${apiUrl}/financial-records`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const resetForm = () => {
    setSelectedRecord(null);
    setDescription('');
    setAmount('');
    setDate('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const recordData = { description, amount: parseFloat(amount), date };

    try {
      if (selectedRecord) {
        await axios.put(`${apiUrl}/financial-records/${selectedRecord.id}`, recordData);
      } else {
        await axios.post(`${apiUrl}/financial-records`, recordData);
      }
      fetchRecords();
      resetForm();
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`${apiUrl}/financial-records/${id}`);
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setDescription(record.description);
    setAmount(record.amount);
    setDate(new Date(record.date).toISOString().split('T')[0]);
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Financial Records</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <form onSubmit={handleSubmit}>
        <h2>{selectedRecord ? 'Edit' : 'Add'} Financial Record</h2>
        <div>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Amount:
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <button type="submit">{selectedRecord ? 'Update' : 'Add'}</button>
          <button type="button" onClick={resetForm}>Cancel</button>
        </div>
      </form>
      <ul>
        {records.map(record => (
          <li key={record.id}>
            {record.description}: ${record.amount} on {new Date(record.date).toLocaleDateString()}
            <button onClick={() => handleEdit(record)}>Edit</button>
            <button onClick={() => deleteRecord(record.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialRecordList;
