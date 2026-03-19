import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';

function App() {

  return (
    <>
      
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/status" element={<StatusPage />}/>
      </Routes>
    </>
   
  )
}

export default App
