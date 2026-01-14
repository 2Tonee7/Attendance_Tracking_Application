import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import CreateEventGroup from './pages/CreateEventGroup';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import AttendanceMonitor from './pages/AttendanceMonitor';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className='main-content'>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/event-groups/new" element={<PrivateRoute><CreateEventGroup /></PrivateRoute>} />
            <Route path="/event-groups/:id" element={<PrivateRoute><EventList /></PrivateRoute>} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/:id/attendance" element={<AttendanceMonitor />} />
        </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;