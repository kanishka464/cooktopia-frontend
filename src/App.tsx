import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/login/index";
import Dashboard from "./pages/dashboard/index";
import CreateRecipe from "./pages/create-recipe";
import Recipes from "./pages/recipe/recipes";
import BaseLayout from "./layout/BaseLayout";
import RecipeDetails from "./pages/recipe/recipeDetails";
import UserProfile from "./pages/user-profile";

const isAuthenticated = () => {
  return localStorage.getItem("token");
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" /> : element;
};

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#f5f5f5] w-full h-[100vh]">
        <Routes>
          {/* <Route path="login" element={<Login/>}/> */}
          <Route path="login" element={<PublicRoute element={<Login />} />} />
          <Route path="/" element={<BaseLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-recipe" element={<CreateRecipe />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="recipes/:id" element={<RecipeDetails />} />
              <Route path="profile/:id" element={<UserProfile />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
