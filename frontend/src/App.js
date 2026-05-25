import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Health from './pages/Health';
import Usuarios from './pages/Usuarios';
import UsuarioDetalle from './pages/UsuarioDetalle';


function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/health" element={<Health/>} />
      <Route path="/usuarios" element={<Usuarios/>} />
      <Route path="/usuarios/:id" element={<UsuarioDetalle/>} />
    </Routes>
    </BrowserRouter>
  );
}



export default App;