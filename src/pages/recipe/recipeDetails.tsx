import { AccessTime, FavoriteBorder, Group, Share } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { calculateDifference, getAverageRating } from "@/utils/helper";
import { Recipe } from "@/utils/interface";
import RecipeListing from "@/components/common/RecipeListing";
import { Star } from "lucide-react";
import { CustomStarRating } from "@/components/common/CustomStarRating";

const RecipeDetails = () => {
    const { id } = useParams();
    
    const API_URL = import.meta.env.VITE_API_URL;
    const [recipeDetails, setRecipeDetails] = useState<Recipe | null>();
    const [commentText, setCommentText] = useState<string>('');
    const getRecipeDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/recipe/get-recipe-details?recipe_id=${id}`);
            setRecipeDetails(response?.data?.data);
        } catch(error) {
            console.log(error);
        }
    }

    const createComment = async () => {
        try {
            const commentPayload = {
                commentText:commentText,
                user_id: localStorage.getItem('user_id'),
                recipe_id: id
            }
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/recipe/comment-recipe`, commentPayload);
            getRecipeDetails();
            console.log(response);
            setCommentText('');
        } catch (error) {
            console.log(error);
        }
    }

    const getRatingValue = () => {
        if(recipeDetails?.rating) {
            const userRating = recipeDetails?.rating.find((rating) => rating?.ratedBy?._id === localStorage.getItem('user_id'));
            if(userRating) {
                return userRating.rating;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    console.log("User rating", getRatingValue());
    

    useEffect(() => {
        id && getRecipeDetails();
    }, [id]);

    return (
        <div className="flex flex-col overflow-y-scroll">
            {/* RECIPE BANNER */}
            <div className="w-full bg-[#202124] h-[500px] flex items-center gap-8 py-8">
                <div className="w-9/12 mx-auto flex items-center gap-10">
                    {/* RECIPE IMAGE */}
                    <div className="w-1/2 rounded-xl h-[300px] max-h-[300px]">
                        <img src={recipeDetails?.recipeImage} className="w-full object-cover rounded-xl max-h-[300px]"/>
                    </div>

                    <div className="w-1/2 flex flex-start flex-col gap-5">
                        {/* TAGS */}
                        <div className="flex gap-5">
                            <div className={`tag`}>{recipeDetails?.cuisines}</div>
                            <div className={`tag ${recipeDetails?.category.toLowerCase()}`}>{recipeDetails?.category}</div>
                        </div>

                        {/* RECIPE NAME */}
                        <div className="font-bold text-4xl text-[#cccccc]">
                            {recipeDetails?.recipeName}
                        </div>

                        {/* RECIPE OVERVIEW */}
                        <div className="flex gap-5 items-center">
                            <div className="flex gap-2 items-center text-[#cccccc]">
                                <div className="text-xs"><Star size={20} color="yellow" fill={"yellow"}/></div>
                                <div className="flex gap-1 items-center">
                                    <div>{recipeDetails?.rating && !isNaN(parseInt(getAverageRating(recipeDetails.rating))) ? getAverageRating(recipeDetails.rating) : 0}</div>
                                    <div>{`( ${recipeDetails?.rating?.length} )`}</div>
                                </div>
                            </div>
                            <div className="flex gap-1 items-center text-[#cccccc]">
                                <div className="text-xs"><AccessTime/></div>
                                <div>{recipeDetails?.cookingTime} mins</div>
                            </div>

                            <div className="flex gap-1 items-center text-[#cccccc]">
                                <div className="text-xs"><Group/></div>
                                <div>Serves {recipeDetails?.serves}</div>
                            </div>
                        </div>

                        {/* RECIPE LIKE AND SHARE */}
                        <div className="flex gap-5">
                            {/* LIKE BUTTON */}
                            <div className="flex items-center gap-2 text-white bg-red-500 w-fit px-3 py-2 rounded-xl">
                                <FavoriteBorder style={{fontSize:'18px', marginTop:0}}/>
                                <div>Like</div>
                            </div>

                            {/* SHARE BUTTON */}
                            <div className="flex items-center gap-2 text-white bg-blue-500 w-fit px-3 py-2 rounded-xl">
                                <Share style={{fontSize:'18px', marginTop:0}}/>
                                <div>Share</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            {/* RECIPE STEPS */}
            <div className="py-8 bg-white">
                <div className="w-11/12 mx-auto flex flex-col gap-5">
                    <div className="text-3xl font-bold">
                        Cooking Instructions
                    </div>

                    <div className="flex flex-col gap-5">
                        {
                            recipeDetails?.steps?.map((step, index) => (
                                <div className="flex items-center gap-5 bg-slate-200 rounded-xl w-[80%] p-8">
                                    <div className="w-8 h-8 flex justify-center items-center bg-[#202124] text-white rounded-full">
                                        {index+1}
                                    </div>

                                    <div className="text-lg">
                                        {step}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Rate Recipe */}
            <div className="w-full py-5">
                <div className="w-11/12 mx-auto">
                    <div className="flex flex-col w-1/2 gap-3 bg-white p-5 rounded-xl shadow-lg">
                        <div className="font-semibold">
                            Rate This Recipe
                        </div>

                        <CustomStarRating value={getRatingValue()}/>
                    </div>
                </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="w-full bg-[#eae7e7] py-5">
                <div className="w-11/12 mx-auto flex flex-col gap-5">
                    <div className="text-3xl font-bold">
                        {`Comments (${recipeDetails?.comments?.length})`}
                    </div>

                    {/* COMMENT ON RECIPE */}
                    <div className="flex flex-col gap-3 bg-white p-5 rounded-xl">
                        <div>
                            <input
                                type="text"
                                value={commentText}
                                className="w-full border-[1px] border-black rounded-xl h-[50px] px-2"
                                placeholder="Share your thoughts about this recipe ..."
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                        </div>

                        <div 
                            className="px-5 py-2 rounded-xl bg-green-600 text-white font-normal w-fit cursor-pointer"
                            onClick={() => {(commentText.length > 0) && createComment()}}
                        >
                            Post Comment
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        {
                            recipeDetails?.comments?.map((comment) => (
                                <div className="flex flex-col gap-3 bg-white p-5 rounded-xl">
                                    <div className="flex flex-col">
                                            <div className="font-semibold text-lg">
                                                {comment?.commentedBy?.name}
                                            </div>

                                            <div className="text-xs text-[#858585]">
                                                {calculateDifference(comment?.created_at)}
                                            </div>
                                    </div>

                                    <div>
                                        {comment?.commentText}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Similar Recipes */}
            <div className="bg-white py-8">
                <div className="w-11/12 mx-auto flex flex-col gap-5">
                    <div className="text-3xl font-bold">
                        You Might Also Like
                    </div>
                    
                    <RecipeListing recipes={recipeDetails?.similarRecipes}/>

                </div>
            </div>
        </div>
    )
}

export default RecipeDetails;