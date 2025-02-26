import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/login/index';
import Dashboard from './pages/dashboard/index';
import CreateRecipe from './pages/create-recipe';
import Recipes from './pages/recipe/recipes';
import BaseLayout from './layout/BaseLayout';

function App() {
  return (
    <BrowserRouter>
      <div className='bg-[#f5f5f5] w-full h-[100vh]'>
      <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path='/' element={<BaseLayout/>}>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path="create-recipe" element={<CreateRecipe/>}/>
          <Route path='recipes' element={<Recipes/>}/>
        </Route>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App;
