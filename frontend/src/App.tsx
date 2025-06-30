import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import Landing from "./pages/landing";
import Dashboard from './pages/dashboard.tsx'; 
import CreateGoal from './pages/creategoal.tsx';
import GoalDetail from './pages/goaldetail.tsx';

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
    path: "/goal/:id", 
    element: <GoalDetail />,
  },
]);

function App() {
  return (
    <>
      <Toaster richColors position="top-right" /> 
      <RouterProvider router={router} />
    </>
  );
}

export default App;
