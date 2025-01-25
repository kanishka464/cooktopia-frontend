import axios from "axios";
import { useEffect, useState } from "react";
import { Favorite, FavoriteBorder, Star } from "@mui/icons-material";
import { toast } from "@/hooks/use-toast";

interface RecipeSchema {
    _id: string;
    recipeName: string;
    ratingAverage: string;
    cookingTime: number;
    category: string;
    cuisines: string;
    mealType: string;
    likedByUser: string[];
    created_by: {
        name: string;
    }
}
const Recipes = () => {
    const [recipes, setRecipes] = useState<RecipeSchema[]>([]);

    const getRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/recipe/getAllRecipe');
            setRecipes(response?.data?.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleLike = async (recipe:RecipeSchema) => {
        try {
            const response = await axios.post('http://localhost:4000/api/recipe/like-recipe', {
                user_id: localStorage.getItem('user_id'),
                recipe_id: recipe?._id
            });

            if(response?.data?.success) {
                if(response?.data?.data) {
                    toast({
                        title: `Liked ${recipe?.recipeName}`,
                        description: `You can view this recipe in your liked recipes`,
                    })
                } else {
                    toast({
                        title: `Uniked ${recipe?.recipeName}`,
                        description: `Recipe removed from your liked recipes`,
                    })
                }
                await getRecipes();
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getRecipes();
    }, [])

    const checkLike = (recipe:RecipeSchema) => {
        const user_id = localStorage.getItem('user_id');
        const isLiked = recipe?.likedByUser?.some((user:string) => user === user_id);
        console.log("check like", isLiked);
        if(isLiked) {
            return true;
        } else {
            return false;
        }
    }
  return (
    <div className="flex flex-col gap-8 py-5 h-[100vh]">
        <div className="w-11/12 mx-auto p-10 rounded-xl bg-white">

        </div>

        {/* LIST RECIPES */}
        <div className="grid grid-cols-4 gap-5 w-11/12 mx-auto">
            {
                recipes?.map((recipe) => (
                    <div key={recipe?._id} className="flex flex-col w-full rounded-xl bg-white">
                        {/* Recipe Image */}
                        <div className="w-full bg-[#a1a0a052] h-48 rounded-xl">

                        </div>

                        {/* Recipe Detail */}
                        <div className="flex flex-col gap-3 p-5">
                            <div className="flex justify-between items-center">
                               <div className="font-semibold text-xl">
                                    {recipe?.recipeName}
                                </div>
                               {/* Recipe Like Button */}
                               <div onClick={() => handleLike(recipe)} className="cursor-pointer">
                                { checkLike(recipe) ? <Favorite style={{color:'red'}}/> : <FavoriteBorder/> }
                               </div>
                            </div>

                            {/* Recipe rating and cook time */}
                            <div className="flex gap-3 items-center text-sm font-normal">
                                <div className="flex items-center gap-2">
                                    {/* <span className="material-symbols-outlined text-yellow-400">
                                        <Star style={{fontSize:'12px'}}/>
                                    </span> */}
                                    <Star style={{fontSize:'12px', color:'yellow'}}/>
                                    <div>
                                        {'4.3'}
                                    </div>

                                    <div>
                                        {`(234)`}
                                    </div>
                                </div>

                                <div className="w-1 h-1 rounded-full bg-slate-300"></div>

                                <div>
                                    {`${recipe?.cookingTime} mins`}
                                </div>
                            </div>

                            {/* Recipe Tags */}
                            <div className="flex gap-1">
                               {
                                    [recipe?.category, recipe?.cuisines, recipe?.mealType]?.map((tag) => (
                                        <div className="text-xs px-3 py-1 bg-slate-100 rounded-xl">
                                            {tag}
                                        </div>
                                    ))
                               }
                            </div>

                            {/* Recipe Created by User */}
                            <div className="flex items-center gap-3">
                                {/*Created by User image */}
                               <div className="w-8 h-8 rounded-full bg-[#a1a0a052]">

                               </div>

                               {/* created by user name */}
                               <div>
                                    {`by ${recipe?.created_by?.name}`}
                               </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Recipes;