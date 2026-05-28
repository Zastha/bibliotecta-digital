import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Health from './pages/Health';
import Usuarios from './pages/Usuarios';
import UsuarioDetalle from './pages/UsuarioDetalle';
import Prestamos from './pages/Prestamos';
import PrestamosUsuario from './pages/PrestamosUsuario';
import RolNavbar from './components/RolNavbar';
import Licencias from './pages/Licencias';
import LicenciasLibro from './pages/LicenciasLibro';
import Libros from './pages/Libros';
import LibroDetalle from './pages/LibroDetalle';
import { Ruta } from './components/ruta';
import { useRol } from './hooks/roles';
import ListaEspera from './pages/ListaEspera';
import ListaEsperaLibro from './pages/ListaEsperaLibro';
import ListaEsperaUsuario from './pages/ListtaEsperaUsuario';
import Login from './pages/Login';

function App() {
  const { rol } = useRol();

const rutaInicial = !rol ? '/login' : rol === 'administrador' ? '/usuarios' : '/libros';

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <RolNavbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to={rutaInicial} replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/health" element={<Health />} />

            {/* Para ambos roles */}
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/prestamos/usuario/:usuarioId" element={<PrestamosUsuario />} />
            <Route path="/libros" element={<Libros />} />
            <Route path="/libros/:id" element={<LibroDetalle />} />
            <Route path="/lista-espera" element={<ListaEspera />} />
            <Route path="/lista-espera/usuario/:usuarioId" element={<ListaEsperaUsuario />} />

            {/* Solo para administradores */}
            <Route path="/usuarios" element={<Ruta rolRequerido="administrador"><Usuarios /></Ruta>} />
            <Route path="/usuarios/:id" element={<Ruta rolRequerido="administrador"><UsuarioDetalle /></Ruta>} />
            <Route path="/licencias" element={<Ruta rolRequerido="administrador"><Licencias /></Ruta>} />
            <Route path="/licencias/libro/:libroId" element={<Ruta rolRequerido="administrador"><LicenciasLibro /></Ruta>} />
            <Route path="/lista-espera/libro/:libroId" element={<ListaEsperaLibro />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;