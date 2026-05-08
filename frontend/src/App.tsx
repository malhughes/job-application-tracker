import { Routes, Route, Navigate } from 'react-router';
import { Dashboard } from './pages/Dashboard';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Navbar } from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
          <Route path="/signin" element={!user ? <Signin /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
