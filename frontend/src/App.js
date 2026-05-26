import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Health from './pages/Health';
import Usuarios from './pages/Usuarios';
import UsuarioDetalle from './pages/UsuarioDetalle';
import Prestamos from './pages/Prestamos';
import PrestamosUsuario from './pages/PrestamosUsuario';
import AdminNavbar from './components/AdminNavbar';
import Licencias from './pages/Licencias';
import LicenciasLibro from './pages/LicenciasLibro';
import Libros from './pages/Libros';
import LibroDetalle from './pages/LibroDetalle';

function App(){
  return(
    <BrowserRouter>
    <AdminNavbar />
    <Routes>
      <Route path="/" element={<Navigate to="/usuarios" replace/>} />
      <Route path="/health" element={<Health/>} />
      <Route path="/usuarios" element={<Usuarios/>} />
      <Route path="/usuarios/:id" element={<UsuarioDetalle/>} />
      <Route path="/prestamos" element={<Prestamos/>} />
      <Route path="/prestamos/usuario/:usuarioId" element={<PrestamosUsuario/>} />
      <Route path="/licencias" element={<Licencias/>} />
      <Route path="/licencias/libro/:libroId" element={<LicenciasLibro/>} />

      <Route path="/libros" element={<Libros/>} />
      <Route path="/libros/:id" element={<LibroDetalle/>} />

    </Routes>
    </BrowserRouter>
  );
}



export default App;