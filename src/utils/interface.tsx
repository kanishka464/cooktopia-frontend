export interface Comment {
    commentText: string;
    commentedBy: {
        name: string;
    };
    created_at: string;
}

export interface Recipe {
    recipeName: string;
    cuisines: string;
    category: string;
    cookingTime: number;
    serves: number;
    comments: Comment[];
}