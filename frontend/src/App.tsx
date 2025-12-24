import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { JobProvider } from "./context/JobContext";
import DetalhesCandidatura from "./pages/detalhesCanditatura";
import Dashboard from "./pages/Dashboard";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";

const App = () => (
  <ThemeProvider theme={theme}>
    <JobProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/detalhes/:id" element={<DetalhesCandidatura />} />
        </Routes>
      </BrowserRouter>
    </JobProvider>
  </ThemeProvider>
);

export default App;
