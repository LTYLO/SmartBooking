import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Error404 from 'containers/errors/Error404';
import Home from 'containers/pages/Home';
import Contacto from 'containers/pages/Contacto';
import Espacios from 'containers/pages/Espacios';
import Reservas from 'containers/pages/Reservas';
import Resgistrarse from 'containers/pages/Sing_Up'
import IniciarSesion from 'containers/pages/Log_in'
import store from './store';
import { Provider } from 'react-redux';
import { AuthProvider } from 'components/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Home Display */}
          <Route path="/" element={<Home/>} />
          <Route path="Contacto" element={<Contacto/>} />
          <Route path="/Espacios" element={<Espacios/>} />
          <Route path="/Reservas" element={<Reservas/>} />
          <Route path="/Registrarse" element={<Resgistrarse/>} />
          <Route path="/InciarSesion" element={<IniciarSesion/>} />

          {/* Error Display - Debe ir al final */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
    </Provider>
    </AuthProvider>
  );
}

export default App;