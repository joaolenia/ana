import { useState } from 'react';
import { LuLock, LuUser, LuEye, LuEyeOff, LuArrowLeft } from 'react-icons/lu';
import './LoginProfessor.css';

interface LoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginProfessor({ onLogin, onBack }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulação de delay de rede
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        sessionStorage.setItem('professor_session', 'true');
        onLogin();
      } else {
        setError('Usuário ou senha incorretos.');
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <button className="btn-back" onClick={onBack} type="button">
          <LuArrowLeft size={20} /> Voltar
        </button>

        <div className="login-header">
          <h2>Área do Professor</h2>
          <p>Faça login para lançar pontuações</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Usuário</label>
            <div className="input-wrapper">
              <LuUser className="input-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="input-wrapper">
              <LuLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="btn-toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}