import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
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

function App(){

const { rol, loading } = useRol();

  if (loading) {
    return <div style={{ padding: '20px' }}>Cargando...</div>;
  }

  // Determinar la ruta inicial según el rol
  const rutaInicial = rol === 'administrador' ? '/usuarios' : '/libros';

  return(
    <BrowserRouter>
    <RolNavbar />
    <Routes>
      <Route path="/" element={<Navigate to={rutaInicial} replace/>} />
      <Route path="/health" element={<Health/>} />
      
      {/* Para ambos roles */}
      <Route path="/prestamos" element={<Prestamos/>} />
      <Route path="/prestamos/usuario/:usuarioId" element={<PrestamosUsuario/>} />
      <Route path="/libros" element={<Libros/>} />
      <Route path="/libros/:id" element={<LibroDetalle/>} />
      <Route path="/lista-espera" element={<ListaEspera/>} />

      {/* Solo para administradores */}
      <Route path="/usuarios" element={<Ruta rolRequerido="administrador"><Usuarios/></Ruta>} />
      <Route path="/usuarios/:id" element={<Ruta rolRequerido="administrador"><UsuarioDetalle/></Ruta>} />
      <Route path="/licencias" element={<Ruta rolRequerido="administrador"><Licencias/></Ruta>} />
      <Route path="/licencias/libro/:libroId" element={<Ruta rolRequerido="administrador"><LicenciasLibro/></Ruta>} />
      <Route path="/lista-espera/libro/:libroId" element={<ListaEsperaLibro/>} />


    </Routes>
    </BrowserRouter>
  );
}



export default App;