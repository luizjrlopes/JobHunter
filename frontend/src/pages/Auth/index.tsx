import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Page,
  Card,
  Title,
  Subtitle,
  Form,
  Input,
  Button,
  Toggle,
  ErrorText,
} from "./styles";

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Falha ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>Job Hunter</Title>
        <Subtitle>{mode === "login" ? "Acesse sua conta" : "Crie uma conta"}</Subtitle>
        <Toggle>
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Cadastro
          </button>
        </Toggle>

        <Form onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              <span>Nome</span>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </label>
          )}
          <label>
            <span>Email</span>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </label>
          <label>
            <span>Senha</span>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </label>

          {error && <ErrorText>{error}</ErrorText>}

          <Button type="submit" disabled={loading}>
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Cadastrar"}
          </Button>
        </Form>
      </Card>
    </Page>
  );
};

export default AuthPage;
