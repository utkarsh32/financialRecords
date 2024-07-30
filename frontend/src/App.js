import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate ,} from 'react-router-dom';
import FinancialRecords from './components/FinancialRecordList';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('authToken', authToken);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [authToken]);


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={!authToken ? <Register setAuthToken={setAuthToken} /> : <Navigate to="/financial-records" />} />
          <Route path="/login" element={!authToken ? <Login setAuthToken={setAuthToken} /> : <Navigate to="/financial-records" />} />
          <Route path="/financial-records" element={authToken ? <FinancialRecords setAuthToken={setAuthToken} /> : <Navigate to="/register" />} />
          <Route path="/" element={<Navigate to={authToken ? "/financial-records" : "/register"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
