import logo from './logo.svg';
import './App.css';
import Navbar from './components/Header/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Header/Signup'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navbar />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
