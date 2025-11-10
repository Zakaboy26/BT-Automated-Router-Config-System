import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import RequestForm from './components/RouterRequests/RequestForm';
import RoutersPage from './components/Routers/RouterPage';
import CustomersPage from './components/Customers/CustomerPage';
import OrderHistoryPage from "./pages/OrderHistoryPage";
import User from "./components/UserList/User";
import OrderExport from "./components/OrderHistory/OrderExport";
import OrderTracking from './components/OrderTracking/OrderTracking';
import UserSettingsPage from "./pages/UserSettingsPage";
import TrackOrderSearch from './components/OrderTracking/TrackOrderSearch';
import RouterRequestManagement from './components/Admin/RouterRequestManagement';
import NewsEditor from './components/NewsManagement/NewsEditor';
import NewsPage from './components/UserNews/NewsPage';
import UserReportPage from './components/UserReports/UserReportPage';
import AdminReportsPage from './components/Admin/AdminReportView';
import HelpGuide from './components/HelpGuide/HelpGuide';
import ContactUs from './components/Contact/ContactUs';
import ChatBot from './components/ChatBot/ChatBot';
import useAuth from './components/Auth/useAuth';

const ChatBotWrapper = () => {
  const location = useLocation();
  const excludedPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (excludedPaths.includes(location.pathname)) {
    return null;
  }
  return <ChatBot />;
};

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/export" element={<OrderExport />} />

          <Route path="/track-order" element={
            <ProtectedRoute>
              <TrackOrderSearch />
            </ProtectedRoute>
          } />
          <Route path="/order-tracking/:referenceNumber" element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          } />
          <Route path="/track-order/:referenceNumber" element={<OrderTracking />} />

          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/routers" element={
            <ProtectedRoute>
              <RoutersPage />
            </ProtectedRoute>
          } />

          <Route path="/customers" element={
            <ProtectedRoute>
              <CustomersPage />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute>
              <User url="http://localhost:8080/api/admin/users" />
            </ProtectedRoute>
          } />

          <Route path="/router-requests" element={
            <ProtectedRoute>
              <RequestForm />
            </ProtectedRoute>
          } />

          <Route path="/order-history" element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          } />

          <Route path="/manage-router-requests" element={
            <ProtectedRoute>
              <RouterRequestManagement />
            </ProtectedRoute>
          } />

          <Route path="/news-management" element={
            <ProtectedRoute>
              <NewsEditor />
            </ProtectedRoute>
          } />

          <Route path="/news" element={
            <ProtectedRoute>
              <NewsPage />
            </ProtectedRoute>
          } />

          <Route path="/contact" element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          } />

          <Route path="/user-report" element={
            <ProtectedRoute>
              <UserReportPage />
            </ProtectedRoute>
          } />

          <Route path="/admin/reports" element={
            <ProtectedRoute>
              <AdminReportsPage />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <UserSettingsPage />
            </ProtectedRoute>
          } />

          <Route path="/help" element={
            <ProtectedRoute>
              <HelpGuide />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>

        <ChatBotWrapper />
      </Router>
  );
}

export default App;