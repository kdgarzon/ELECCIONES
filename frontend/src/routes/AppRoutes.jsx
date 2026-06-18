import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import GestionPartidos from '../pages/GestionPartidos';
import GestionCandidatos from '../pages/GestionCandidatos';
import RegistrarVoto from '../pages/RegistrarVoto';
import ConsultaVotos from '../pages/ConsultaVotos';
import Estadisticas from '../pages/Estadisticas';

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/partidos" element={<GestionPartidos />} />
      <Route path="/candidatos" element={<GestionCandidatos />} />
      <Route path="/votos/registrar" element={<RegistrarVoto />} />
      <Route path="/votos" element={<ConsultaVotos />} />
      <Route path="/estadisticas" element={<Estadisticas />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;