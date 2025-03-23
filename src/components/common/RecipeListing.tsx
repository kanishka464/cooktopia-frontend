import { AccessTime, Groups } from "@mui/icons-material";
import { Link } from "react-router-dom";

const RecipeListing = ({ recipes }: { recipes: any }) => {
  return (
    <div className="w-[97%] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-3">
      {recipes?.map((recipe: any) => (
        <div key={recipe?._id} className="flex flex-col w-full rounded-xl">
          {/* Recipe Image */}
          <Link
            to={`${window.location.origin}/recipes/${recipe?._id}`}
            className="w-full h-48 rounded-t-xl"
          >
            <img
              src={recipe?.recipeImage}
              className="h-52 max-h-52 w-full object-cover rounded-xl"
            />
          </Link>

          {/* Recipe Detail */}
          <div className="flex flex-col gap-3 p-5 bg-[#f9f9f9] rounded-b-xl">
            <div className="flex justify-between items-center">
              <Link to={recipe?._id} className="font-semibold text-xl">
                {recipe?.recipeName}
              </Link>
            </div>

            {/* Recipe Tags */}
            <div className="flex gap-1">
              {[recipe?.category, recipe?.cuisines, recipe?.mealType]?.map(
                (tag) => (
                  <div className="text-xs px-3 py-1 bg-slate-100 rounded-xl">
                    {tag}
                  </div>
                )
              )}
            </div>

            {/* Recipe rating and cook time */}
            <div className="flex gap-3 items-center text-sm font-normal text-[#666666]">
              <div className="flex items-center gap-1">
                <AccessTime fontSize="small" />
                {`${recipe?.cookingTime} mins`}
              </div>

              <div className="flex items-center gap-1">
                <Groups fontSize="small" />
                {`${recipe?.serves} servings`}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeListing;
