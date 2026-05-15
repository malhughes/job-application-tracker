import { Routes, Route, Navigate } from 'react-router';
import { Dashboard } from './pages/Dashboard';
import { Authenticate } from './pages/Authenticate';
import { ApplicationInfo } from './pages/ApplicationInfo';
import { Navbar } from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';

function App() {
  const { user } = useAuthContext();
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={!user ? <Authenticate /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/application/:id" element={user ? <ApplicationInfo /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
