import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SchedulePage from './pages/SchedulePage';
import RoutePage from './pages/RoutePage';
import LodgingPage from './pages/LodgingPage';
import MenusPage from './pages/MenusPage';
import ShoppingPage from './pages/ShoppingPage';
import PackingPage from './pages/PackingPage';
import CarsPage from './pages/CarsPage';
import BudgetPage from './pages/BudgetPage';
import EmergencyPage from './pages/EmergencyPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/route" element={<RoutePage />} />
        <Route path="/lodging" element={<LodgingPage />} />
        <Route path="/menus" element={<MenusPage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/packing" element={<PackingPage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
      </Route>
    </Routes>
  );
}
