import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Landing from "./pages/landing";
import Dashboard from './pages/dashboard.tsx'; // Nueva: la página de metas
import CreateGoal from './pages/creategoal.tsx';// Nueva: la página de crear meta
import GoalDetail from './pages/goaldetail.tsx'; // Nueva: la página de detalle de la meta

import { Toaster } from 'sonner';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/create-goal",
    element: <CreateGoal />,
  },
  {
    path: "/goal/:id", // Ruta dinámica para los detalles de la meta
    element: <GoalDetail />,
  },
]);

function App() {
  return (
    <>
      {/* Añade el Toaster aquí. Estará disponible para toda tu aplicación. */}
      {/* Puedes ajustar la posición y otras props según tu preferencia. */}
      <Toaster richColors position="top-right" /> 
      <RouterProvider router={router} />
    </>
  );
}

export default App;
