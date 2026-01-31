import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'; // We will create this next!
import Register from './pages/Register'; 
import Navbar from './components/Navbar'; // For navigation buttons
import Favorites from './pages/Favorites';

function App() {
  return (
    <Router>
      <Navbar /> {/* This stays visible on all pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;