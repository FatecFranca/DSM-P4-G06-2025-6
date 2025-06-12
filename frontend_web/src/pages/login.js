import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const clickLogin = async () => {
    if (!email || !password) {
      alert("Preencha e-mail e senha");
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken } = response.data;
      localStorage.setItem('userToken', accessToken);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1 className="login-title">
          Bem-vindo ao SmartLocker!
        </h1>

      <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaEnvelope size={20} color="#64B5F6" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

        <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaLock   size={20} color="#64B5F6" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className="login-btn" onClick={clickLogin}>
          Entrar
        </button>

        <button className="register-link" onClick={() => navigate("/cadastro")}>
          Não tem uma conta? Cadastre-se
        </button>
      </div>

      <div className="login-right">
        {/*Imagem adicionada de fundo pelo CSS */}
      </div>
    </div>
  );
};

export default Login;
