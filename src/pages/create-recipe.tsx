// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const CreateRecipe = () => {
//   return (
//     <div className="flex justify-center items-center h-[100vh]">
//       <div className="bg-white w-1/3 p-5 flex flex-col gap-8">
//         <div className="text-3xl font-bold flex justify-center">
//           Create Recipe for CookTopia
//         </div>

//         <div className="w-full flex flex-col gap-5">
//           <div>
//             <Label htmlFor="recipeName">Recipe Name</Label>
//             <Input
//               type="text"
//               id="recipeName"
//               placeholder="Enter Recipe name"
//               name="recipeName"
//             />
//           </div>

//           <div>
//             <Label htmlFor="cookingTime">Cooking Time</Label>
//             <Input
//               type="number"
//               id="cookingTime"
//               placeholder="Enter Cooking Time in mins"
//               name="cookingTime"
//             />
//           </div>

//           <div>
//             <Label>Category</Label>
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select a category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="Veg">Vegetarian</SelectItem>
//                   <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
//                   <SelectItem value="Egg">Eggs</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Meal type</Label>
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select a meal type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="BreakFast">BreakFast</SelectItem>
//                   <SelectItem value="Lunch">Lunch</SelectItem>
//                   <SelectItem value="Dinner">Dinner</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label>Cuisines</Label>
//             <Select>
//               <SelectTrigger className="w-full">
//                 <SelectValue placeholder="Select a cuisine" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectItem value="Indian">Indian</SelectItem>
//                   <SelectItem value="Chinese">Chinese</SelectItem>
//                   <SelectItem value="Italian">Italian</SelectItem>
//                   <SelectItem value="French">French</SelectItem>
//                   <SelectItem value="German">German</SelectItem>
//                   <SelectItem value="British">British</SelectItem>
//                   <SelectItem value="Mexican">Mexican</SelectItem>
//                   <SelectItem value="Turkish">Turkish</SelectItem>
//                   <SelectItem value="Caribbean">Caribbean</SelectItem>
//                   <SelectItem value="Thai">Thai</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="serves">Serves</Label>
//             <Input
//               type="number"
//               id="serves"
//               placeholder="Enter serves"
//               name="serves"
//             />
//           </div>

//           <div>
//             <Label htmlFor="calories">Calories</Label>
//             <Input
//               type="text"
//               id="calories"
//               placeholder="Enter calories (units cal)"
//               name="calories"
//             />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateRecipe;


import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

const CreateRecipe = () => {
  const [steps, setSteps] = useState([{ id: 1, value: "" }]);
  const [ recipeForm, setRecipeForm] = useState<{
    recipeName: string;
    cookingTime: string;
    category: string;
    mealType: string;
    cuisines: string;
    ratingAverage: string;
    serves: number;
    calories: string;
    steps: string[];
    created_by: string;
  }>({
    recipeName:'',
    cookingTime: '',
    category: '',
    mealType: '',
    cuisines: '',
    ratingAverage: '',
    serves: 0,
    calories: '',
    steps: [],
    created_by:'',
  });

  const handleRecipeForm = (key:string, value:string | number) => {
    setRecipeForm({
        ...recipeForm,
        [key]:value
    })
  }

  const submitRecipe = async () => {
    const recipeSteps:string[] = steps.map((step) => step.value);
    console.log(recipeSteps);
    setRecipeForm({
        ...recipeForm,
        steps: recipeSteps,
        created_by: localStorage.getItem('user_id') || ''
    })
    console.log(recipeForm);

    try {
        const response = await axios.post('http://localhost:4000/api/recipe/insertRecipe', recipeForm);
        console.log(response);
    } catch (error) {
      console.log(error);
    }
}
  const handleStepChange = (id:any, value:any) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, value } : step))
    );
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };

  const removeStep = (id:any) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="bg-white w-1/3 p-5 flex flex-col justify-center gap-8 ">
        <div className="text-3xl font-bold flex justify-center">
          Create Recipe for CookTopia
        </div>

        <div className="w-full flex flex-col gap-5">
          <div>
            <Label htmlFor="recipeName">Recipe Name</Label>
            <Input
              type="text"
              id="recipeName"
              placeholder="Enter Recipe name"
              name="recipeName"
              onChange={(e:any) => handleRecipeForm(e.target.name, e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="cookingTime">Cooking Time</Label>
            <Input
              type="number"
              id="cookingTime"
              placeholder="Enter Cooking Time in mins"
              name="cookingTime"
              onChange={(e) => handleRecipeForm(e.target.name, e.target.value)}
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select name="mealType" onValueChange={(e) => handleRecipeForm('category', e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Veg">Vegetarian</SelectItem>
                  <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                  <SelectItem value="Egg">Eggs</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Meal type</Label>
            <Select onValueChange={(e) => handleRecipeForm('mealType', e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="BreakFast">BreakFast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cuisines</Label>
            <Select onValueChange={(e) => handleRecipeForm('cuisines', e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Indian">Indian</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="British">British</SelectItem>
                  <SelectItem value="Mexican">Mexican</SelectItem>
                  <SelectItem value="Turkish">Turkish</SelectItem>
                  <SelectItem value="Caribbean">Caribbean</SelectItem>
                  <SelectItem value="Thai">Thai</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="serves">Serves</Label>
            <Input
              type="number"
              id="serves"
              placeholder="Enter serves"
              name="serves"
              onChange={(e) => handleRecipeForm(e.target.name, e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input
              type="text"
              id="calories"
              placeholder="Enter calories (units cal)"
              name="calories"
              onChange={(e) => handleRecipeForm(e.target.name, e.target.value)}
            />
          </div>

          {/* Steps Section */}
          <div>
            <Label>Steps</Label>
            <div className="flex flex-col gap-3">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={`Step ${step.id}`}
                    value={step.value}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                  />
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStep}
              className="mt-3 bg-blue-500 text-white py-1 px-3 rounded"
            >
              Add Step
            </button>
          </div>

          <div className="w-full bg-[#202124] text-white rounded-lg text-center font-semibold cursor-pointer py-2" onClick={submitRecipe}>
            Create Recipe
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
