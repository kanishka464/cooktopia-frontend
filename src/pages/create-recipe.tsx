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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Recipe } from "@/utils/interface";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CreateRecipe = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("image", file);

      // Send to backend
      const response = await fetch(
        "http://localhost:4000/api/recipe/upload-recipe-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if(data.success) {
        toast({
          title: data.message
        })
      }
      setRecipeForm({
        ...recipeForm,
        recipeImage: data.data
      });
      setUploadedUrl(data.url);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  const [steps, setSteps] = useState([{ id: 1, value: "" }]);
  const API_URL = import.meta.env.VITE_API_URL;
  const [recipeForm, setRecipeForm] = useState<Recipe>({
    recipeName: "",
    recipeImage: "",
    cookingTime: "",
    category: "",
    mealType: "",
    cuisines: "",
    ratingAverage: "",
    serves: 0,
    calories: "",
    steps: [],
    created_by: "",
    comments: [],
  });

  const handleRecipeForm = (key: string, value: string | number) => {
    setRecipeForm({
      ...recipeForm,
      [key]: value,
    });
  };

  const submitRecipe = async () => {
    const recipeSteps: string[] = steps.map((step) => step.value);
    console.log(recipeSteps);
    setRecipeForm({
      ...recipeForm,
      steps: recipeSteps,
      created_by: localStorage.getItem("user_id") || "",
    });
    console.log(recipeForm);

    try {
      const response = await axios.post(
        `${API_URL}/recipe/insertRecipe`,
        recipeForm
      );
      console.log(response);
      if(response) {
        navigate(`/recipes`)

      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleStepChange = (id: any, value: any) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, value } : step))
    );
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };

  const removeStep = (id: any) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white w-2/3 h-[70%] overflow-y-scroll p-5 flex flex-col justify-center gap-8 ">
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
              onChange={(e: any) =>
                handleRecipeForm(e.target.name, e.target.value)
              }
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

          {/* RECIPE IMAGE UPLOAD */}
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {preview && (
              <div className="mb-4">
                <img
                  src={preview.toString()}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>

            {error && <div className="mt-4 text-red-600">{error}</div>}

            {uploadedUrl && (
              <div className="mt-4">
                <p className="text-green-600">Upload successful!</p>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View uploaded image
                </a>
              </div>
            )}
          </div>
          <div>
            <Label>Category</Label>
            <Select
              name="mealType"
              onValueChange={(e) => handleRecipeForm("category", e)}
            >
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
            <Select onValueChange={(e) => handleRecipeForm("mealType", e)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Breakfast">BreakFast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cuisines</Label>
            <Select onValueChange={(e) => handleRecipeForm("cuisines", e)}>
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

          <div
            className="w-full bg-[#202124] text-white rounded-lg text-center font-semibold cursor-pointer py-2"
            onClick={submitRecipe}
          >
            Create Recipe
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
