import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Health from './pages/Health';
import Usuarios from './pages/Usuarios';
import UsuarioDetalle from './pages/UsuarioDetalle';
import Prestamos from './pages/Prestamos';
import PrestamosUsuario from './pages/PrestamosUsuario';
import AdminNavbar from './components/AdminNavbar';

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
    </Routes>
    </BrowserRouter>
  );
}



export default App;