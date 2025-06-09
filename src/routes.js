import React, { useEffect , useState} from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/login";
import CadastrarUsuario from "./pages/cadastro";
import Dashboard from "./pages/dashboard";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginWrapper />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/cadastro" element={<CadastroWrapper />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

// Componente para rotas protegidas
function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("userToken");
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem("userToken");
  return isAuthenticated ? children : null;
}

function LoginWrapper() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("userToken");
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
    setIsCheckingAuth(false);
  }, [navigate]);

  if (isCheckingAuth) {
    return <div>Carregando...</div>;
  }

  return <Login />;
}

function CadastroWrapper() {
  return (
    <div>
      <CadastrarUsuario />
    </div>
  );
}

function DashboardWrapper() {
  return (
    <div>
       <Dashboard />
    </div>
  );
}

