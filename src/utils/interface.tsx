export interface Comment {
    commentText: string;
    commentedBy: {
        name: string;
    };
    created_at: string;
}

export interface Recipe {
    recipeName: string;
    recipeImage?: string;
    cuisines: string;
    category: string;
    cookingTime: string;
    serves: number;
    rating: [{rating: number, ratedBy: { _id: string }}];
    comments: Comment[];
    mealType: string;
    ratingAverage: string;
    calories: string;
    steps: string[];
    created_by: string;
    similarRecipes?: Recipe[];
    likedByUser: any;
}