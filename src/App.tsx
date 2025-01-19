import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/login/index';
import Dashboard from './pages/dashboard/index';

function App() {
  return (
    <BrowserRouter>
      <div className='bg-[#f5f5f5] w-full h-[100vh]'>
      <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path='dashboard' element={<Dashboard/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App;
