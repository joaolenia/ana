import { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { LoginProfessor } from './pages/Professor/LoginProfessor';
import { ProfessorPanel } from './pages/Professor/ProfessorPanel';
import { LuGraduationCap } from 'react-icons/lu';
import './App.css';

type Route = 'dashboard' | 'login' | 'professor';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');

  // Verifica a sessão ao carregar
  useEffect(() => {
    const isLogged = sessionStorage.getItem('professor_session');
    if (isLogged && currentRoute === 'login') {
      setCurrentRoute('professor');
    }
  }, [currentRoute]);

  const handleLogout = () => {
    sessionStorage.removeItem('professor_session');
    setCurrentRoute('dashboard');
  };

  return (
    <div className="app-container">
      {/* Botão de Acesso do Professor Global (Visível apenas no Dashboard) */}
      {currentRoute === 'dashboard' && (
        <button 
          className="btn-floating-login"
          onClick={() => {
            const isLogged = sessionStorage.getItem('professor_session');
            setCurrentRoute(isLogged ? 'professor' : 'login');
          }}
        >
          <LuGraduationCap size={20} />
          Entrar como Professor
        </button>
      )}

      {/* Roteamento Simples */}
      {currentRoute === 'dashboard' && <Dashboard />}
      
      {currentRoute === 'login' && (
        <LoginProfessor 
          onLogin={() => setCurrentRoute('professor')} 
          onBack={() => setCurrentRoute('dashboard')} 
        />
      )}
      
      {currentRoute === 'professor' && (
        <ProfessorPanel onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;