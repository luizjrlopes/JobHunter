import { ReactElement } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthProvider } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import AuthPage from "./pages/Auth";
import DetalhesCandidatura from "./pages/detalhesCanditatura";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<AuthPage />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/detalhes/:id"
      element={
        <PrivateRoute>
          <DetalhesCandidatura />
        </PrivateRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <JobProvider>
          <GlobalStyles />
          <AppRoutes />
        </JobProvider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
