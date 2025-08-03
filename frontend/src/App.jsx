import { useState } from 'react'
import ChurnForm from './components/ChurnForm'
import ResultCard from './components/ResultCard'
import './App.css'

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <ChurnForm onResult={setResult} />
      <ResultCard result={result} />
    </div>
  );
}

export default App
