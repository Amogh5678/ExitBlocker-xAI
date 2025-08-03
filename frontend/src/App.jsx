import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChurnForm from './components/ChurnForm';
import ResultCard from './components/ResultCard';
import LandingPage from './components/LandingPage';
import './App.css';

function App() {
  const [result, setResult] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Prediction page route */}
          <Route 
            path="/predict" 
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <ChurnForm onResult={setResult} />
                <ResultCard result={result} />
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
