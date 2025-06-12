import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./cadastro.css";

const CadastrarUsuario = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=(?:.*[A-Za-z]){3,})(?=(?:.*\d){3,}).{6,}$/;

  const handleCadastro = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("E-mail inválido");
      return;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError("A senha deve conter no mínimo 3 letras e 3 números");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      } else {
        alert("Não foi possível cadastrar o usuário.");
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      const msg = error.response?.data?.message || "Erro ao conectar com o servidor.";
      alert(msg);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="card">
        <h1 className="cadastro-title">Crie sua conta</h1>

        <form onSubmit={handleCadastro}>
          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-container">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(emailRegex.test(e.target.value) ? "" : "E-mail inválido");
              }}
              className="input-field"
            />
          </div>
          {emailError && <p className="error-text">{emailError}</p>}

          <div className="input-container">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(
                  passwordRegex.test(e.target.value)
                    ? ""
                    : "Mínimo 3 letras e 3 números"
                );
              }}
              className="input-field"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordError && <p className="error-text">{passwordError}</p>}

          <button type="submit" className="primary-button">
            Cadastrar
          </button>
        </form>

        <button className="register-link" onClick={() => navigate("/login")}>
          Já tem uma conta? Entrar
        </button>
      </div>
    </div>
  );
};

export default CadastrarUsuario;