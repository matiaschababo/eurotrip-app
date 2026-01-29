
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Wizard from './pages/Wizard';
import RouteSelection from './pages/RouteSelection';
import ItineraryView from './pages/ItineraryView';
import PreTripHub from './components/PreTripHub';
import ScheduleView from './pages/ScheduleView';
import TravelerTips from './pages/TravelerTips';

const App = () => {
  return (
    <TripProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="wizard" element={<Wizard />} />
            <Route path="selection" element={<RouteSelection />} />
            <Route path="itinerary" element={<ItineraryView />} />
            <Route path="schedule" element={<ScheduleView />} />
            <Route path="pre-trip" element={<PreTripHub />} />
            <Route path="tips" element={<TravelerTips />} />
          </Route>
        </Routes>
      </Router>
    </TripProvider>
  );
};

export default App;
