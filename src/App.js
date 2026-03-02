import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import DailyRoutine from "./pages/DailyRoutine";
import Personal from "./pages/Personal";
import Skill from "./pages/Skill";
import Todo from "./pages/Todo";
import Moments from "./pages/Moments";
import SkillNotebook from "./components/SkillNotebook";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/daily"
        element={
          <PrivateRoute>
            <DailyRoutine />
          </PrivateRoute>
        }
      />

      <Route
        path="/personal"
        element={
          <PrivateRoute>
            <Personal />
          </PrivateRoute>
        }
      />

      <Route
        path="/skills"
        element={
          <PrivateRoute>
            <Skill />
          </PrivateRoute>
        }
      />

      <Route
        path="/skills/:title"
        element={
          <PrivateRoute>
            <SkillNotebook />
          </PrivateRoute>
        }
      />

      <Route
        path="/todo"
        element={
          <PrivateRoute>
            <Todo />
          </PrivateRoute>
        }
      />

      <Route
        path="/moments"
        element={
          <PrivateRoute>
            <Moments />
          </PrivateRoute>
        }
      />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;