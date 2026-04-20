import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginRegisterPage from './pages/LoginRegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import ClientDashboard from './pages/ClientDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const RedirectIfLoggedIn = ({ children }: { children: React.ReactNode }) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const role = JSON.parse(userStr).role;
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'agent') return <Navigate to="/agent" replace />;
        if (role === 'client') return <Navigate to="/client" replace />;
        if (role === 'owner') return <Navigate to="/owner" replace />;
        return <Navigate to="/properties" replace />;
      } catch (e) {}
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen text-white bg-[#050505]">
          <Routes>
            {/* Public OR Root Redirect. If logged in as Agent, we shouldn't even be on Home technically according to user: "like if i am agent show me only agent functinoality pages only" */}
            <Route path="/" element={<HomePage />} />
            
            {/* Standard Listing routes which arguably anyone can see, but we can protect if we want. We'll leave them public for now, but logged-in Agents/Admins should probably just use their dashboards. */}
            <Route path="/properties" element={<PropertyListingPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            
            <Route path="/login" element={
              <RedirectIfLoggedIn><LoginRegisterPage /></RedirectIfLoggedIn>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } /> 
            
            <Route path="/agent" element={
               <ProtectedRoute allowedRoles={['agent']}>
                 <AgentDashboard />
               </ProtectedRoute>
            } /> 

            <Route path="/client" element={
               <ProtectedRoute allowedRoles={['client']}>
                 <ClientDashboard />
               </ProtectedRoute>
            } /> 

            <Route path="/owner" element={
               <ProtectedRoute allowedRoles={['owner']}>
                 <OwnerDashboard />
               </ProtectedRoute>
            } /> 
          </Routes>
      </div>
    </Router>
  );
}

export default App;
