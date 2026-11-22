import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from '../components/layout/Shell';
import { DiscoverScreen } from '../screens/DiscoverScreen';
import { HouseScreen } from '../screens/HouseScreen';
import { AgentScreen } from '../screens/AgentScreen';
import { NeighbourhoodScreen } from '../screens/NeighbourhoodScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { BookingFlowScreen } from '../screens/BookingFlowScreen';
import { ViewingsScreen } from '../screens/ViewingsScreen';
import { AgentDashboardScreen } from '../screens/AgentDashboardScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SafetyScreen } from '../screens/SafetyScreen';
import { MonetizationScreen } from '../screens/MonetizationScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HunterSignupScreen } from '../screens/auth/HunterSignupScreen';
import { AgentSignupScreen } from '../screens/auth/AgentSignupScreen';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Shell>
        <Routes>
          {/* Auth flows rendered without Shell chrome? No - they are inside Shell but Shell is thin now */}
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<HunterSignupScreen />} />
          <Route path="/agent-signup" element={<AgentSignupScreen />} />

          {/* Hunter screens */}
          <Route path="/" element={<DiscoverScreen />} />
          <Route path="/discover" element={<Navigate to="/" replace />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/saved" element={<SavedScreen />} />
          <Route path="/viewings" element={<ViewingsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/house/:id" element={<HouseScreen />} />
          <Route path="/agent/:id" element={<AgentScreen />} />
          <Route path="/neighbourhood/:id" element={<NeighbourhoodScreen />} />
          <Route path="/book/:id" element={<BookingFlowScreen />} />

          {/* Agent and Admin */}
          <Route path="/agent-dashboard" element={<AgentDashboardScreen />} />
          <Route path="/admin" element={<AdminScreen />} />

          {/* Info pages */}
          <Route path="/safety" element={<SafetyScreen />} />
          <Route path="/monetization" element={<MonetizationScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </HashRouter>
  );
};
