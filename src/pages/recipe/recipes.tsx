import axios from 'axios';
import { useEffect, useState } from 'react';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import { toast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { getAverageRating } from '@/utils/helper';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface RecipeSchema {
  _id: string;
  recipeName: string;
  recipeImage: string;
  ratingAverage: string;
  cookingTime: number;
  category: string;
  cuisines: string;
  mealType: string;
  likedByUser: string[];
  created_by: {
    name: string;
  };
}
const Recipes = () => {
  const defaultfilters = {
    mealType: null,
    category:null,
    cuisines: null,
  }

  const [recipes, setRecipes] = useState<RecipeSchema[]>([]);
  const [filters, setFilters] = useState<any>(defaultfilters);
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const navigate = useNavigate();

  const getSearchedRecipes = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipe/recipe-search`, {params: {query: searchQuery} });
        console.log(response);
        setRecipes(response?.data?.data);
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    searchQuery && getSearchedRecipes();
    !searchQuery && getRecipes();
  }, [searchQuery])

  const getRecipes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/recipe/getAllRecipe`, {params:filters}
      );
      setRecipes(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (recipe: RecipeSchema) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recipe/like-recipe`,
        {
          user_id: localStorage.getItem('user_id'),
          recipe_id: recipe?._id,
        }
      );

      if (response?.data?.success) {
        if (response?.data?.data) {
          toast({
            title: `Liked ${recipe?.recipeName}`,
            description: `You can view this recipe in your liked recipes`,
          });
        } else {
          toast({
            title: `Uniked ${recipe?.recipeName}`,
            description: `Recipe removed from your liked recipes`,
          });
        }
        await getRecipes();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRecipes();
  }, [filters]);

  const checkLike = (recipe: RecipeSchema) => {
    const user_id = localStorage.getItem('user_id');
    const isLiked = recipe?.likedByUser?.some(
      (user: string) => user === user_id
    );
    console.log('check like', isLiked);
    if (isLiked) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <div className='flex flex-col gap-8 py-5 h-fit'>
      <div className='w-[97%] mx-auto p-5 rounded-xl bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
        <div className='flex gap-5 justify-between items-center w-full'>
          <div className='relative w-full'>
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'
              size={20}
            />
            <Input
              type='text'
              placeholder='Search Recipes ...'
              className='pl-10 pr-4 py-2 w-[40vw] border rounded-md outline-none'
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className='w-full'>
            <Select onValueChange={(e) => setFilters((prev: any) => {return { ...prev, mealType: e}})}>
              <SelectTrigger className='w-full font-semibold text-[#202124]'>
                <SelectValue placeholder='Meal type' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='Breakfast'>BreakFast</SelectItem>
                  <SelectItem value='Lunch'>Lunch</SelectItem>
                  <SelectItem value='Dinner'>Dinner</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='w-full'>
            <Select onValueChange={(e) => setFilters((prev: any) => {return { ...prev, cuisines: e}})}>
              <SelectTrigger className='w-full font-semibold text-[#202124]'>
                <SelectValue placeholder='Cuisine' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='Indian'>Indian</SelectItem>
                  <SelectItem value='Chinese'>Chinese</SelectItem>
                  <SelectItem value='Italian'>Italian</SelectItem>
                  <SelectItem value='French'>French</SelectItem>
                  <SelectItem value='German'>German</SelectItem>
                  <SelectItem value='British'>British</SelectItem>
                  <SelectItem value='Mexican'>Mexican</SelectItem>
                  <SelectItem value='Turkish'>Turkish</SelectItem>
                  <SelectItem value='Caribbean'>Caribbean</SelectItem>
                  <SelectItem value='Thai'>Thai</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='w-full'>
            <Select
              name='mealType'
              onValueChange={(e) => setFilters((prev: any) => {return { ...prev, category: e}})}
            >
              <SelectTrigger className='w-full font-semibold text-[#202124]'>
                <SelectValue placeholder='Diet' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='Veg'>Vegetarian</SelectItem>
                  <SelectItem value='Non-Veg'>Non-Vegetarian</SelectItem>
                  <SelectItem value='Egg'>Eggs</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='w-full flex justify-center bg-[#202124] text-white py-2 rounded-lg px-3 cursor-pointer' onClick={() => navigate('/create-recipe')}>
            Create Recipe
          </div>
        </div>
      </div>

        {/* LIST RECIPES */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-[95%] lg:w-[97%] mx-auto">
            {
                recipes?.length > 0 ? recipes?.map((recipe: any) => (
                    <div key={recipe?._id} className="flex flex-col w-full rounded-xl bg-white shadow-[rgba(245,_208,_254)_0px_3px_8px] transition-all duration-200 ease-in-out hover:scale-105">
                        {/* Recipe Image */}
                        <Link to={recipe?._id} className="w-full h-48 rounded-xl">
                            <img src={recipe?.recipeImage} className="h-52 max-h-52 w-full object-cover rounded-xl"/>
                        </Link>

                        {/* Recipe Detail */}
                        <div className='flex flex-col gap-4 p-5'>
                          <div className='flex justify-between items-center'>
                            <Link to={recipe?._id} className='font-semibold text-xl'>
                              {recipe?.recipeName}
                            </Link>
                            {/* Recipe Like Button */}
                            <div
                              onClick={() => handleLike(recipe)}
                              className='cursor-pointer'
                            >
                              {
                                checkLike(recipe) ? (
                                  <Favorite style={{ color: 'red' }} />
                                ) : (
                                    <FavoriteBorder />
                                  )}
                            </div>
                          </div>

                          {/* Recipe rating and cook time */}
                          <div className='flex gap-3 items-center text-sm font-normal'>
                            <div className='flex items-center gap-2'>
                            {/* <span className="material-symbols-outlined text-yellow-400">
                                        <Star style={{fontSize:'12px'}}/>
                                    </span> */}
                              <Star style={{ fontSize: '12px', color: 'yellow' }} />
                              <div>
                                {!isNaN(parseInt(getAverageRating(recipe?.rating)))
                                  ? getAverageRating(recipe?.rating)
                                  : 0
                                }
                              </div>

                            <div>{`( ${recipe?.rating?.length} )`}</div>
                          </div>

                          <div className='w-1 h-1 rounded-full bg-slate-300'></div>

                          <div>{`${recipe?.cookingTime} mins`}</div>
                        </div>

                        {/* Recipe Tags */}
                        <div className='flex gap-1'>
                          {[recipe?.category, recipe?.cuisines, recipe?.mealType]?.map(
                            (tag) => (
                              <div className='text-xs px-3 py-1 bg-slate-100 rounded-xl'>
                                {tag}
                              </div>
                            )
                          )}
                        </div>

                        {/* Recipe Created by User */}
                        <div className='flex items-center gap-3 pt-2'>
                          {/*Created by User image */}
                          <div className='w-8 h-8 rounded-full bg-[#a1a0a052] cursor-pointer' onClick={() => navigate(`/profile/${recipe?.created_by?._id}`)}>
                            <img src={recipe?.created_by?.picture}/>
                          </div>

                          {/* created by user name */}
                          <div className='text-sm'>{`by ${recipe?.created_by?.name}`}</div>
                        </div>
                      </div>
                    </div>
                  )): <div className='flex text-3xl font-bold w-[80vw] h-[70vh] mx-auto justify-center items-center text-[#858585]'>CookTopia cooking your search</div>}
      </div>
    </div>
  );
};

export default Recipes;
