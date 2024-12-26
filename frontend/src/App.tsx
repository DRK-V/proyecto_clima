import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import Register from './pages/register';
import ForgotPassword from './pages/forgot_password';
import Perfil from './pages/perfil'; // Asegúrate de importar este componente
import ChangePassword from './pages/changepassword';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard user={user} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />
       
        <Route path="/perfil" element={<Perfil setIsAuthenticated={setIsAuthenticated} />} /> 
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
