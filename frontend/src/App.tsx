import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const FormBuilder = React.lazy(() => import('./pages/FormBuilder'));
const FormSubmissions = React.lazy(() => import('./pages/FormSubmissions'));

function App() {
  return (
    <Router>
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <div>
                    <Navigation />
                    <main>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/forms/new" element={<FormBuilder />} />
                        <Route path="/forms/:id/edit" element={<FormBuilder />} />
                        <Route path="/forms/:id/submissions" element={<FormSubmissions />} />
                      </Routes>
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </React.Suspense>
    </Router>
  );
}

export default App;
