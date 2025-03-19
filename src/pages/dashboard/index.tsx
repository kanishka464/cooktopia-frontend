import { calculateDifference } from '@/utils/helper';
import axios from 'axios';
import { Heart, MessageSquareText, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [profileDetails, setProfileDetails] = useState<any>();
  const [trendingRecipe, setTrendingRecipes] = useState<any>();
  const [recentActivity, setRecentActivity] = useState<any>();

  const navigate = useNavigate();

  const getRecentActivity = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/recent-activity`, { params: { userId: localStorage.getItem('user_id')}});
      setRecentActivity(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  }

  const getTrendingRecipes = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/recipe/trending-recipes`,
        { params: { userId: localStorage.getItem('user_id') } }
      );
      setTrendingRecipes(response?.data?.data);
    } catch (error) {}
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setProfileDetails(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
    getTrendingRecipes();
    getRecentActivity();
  }, []);

  const getLikeOnUserRecipes = (recipes: any) => {
    let count = 0;

    recipes?.map((recipe: any) => {
      count += recipe?.likedByUser?.length;
    });

    return count;
  };

  const getCommentOnUserRecipes = (recipes: any) => {
    let count = 0;

    recipes?.map((recipe: any) => {
      count += recipe?.comments?.length;
    });

    return count;
  };

  const profileAnalytics = [
    {
      id: 1,
      title: 'Followers',
      count: profileDetails?.followers?.length,
      icon: 'group',
    },

    {
      id: 2,
      title: 'Recipes',
      count: profileDetails?.createdRecipes?.length,
      icon: 'content_paste',
    },

    {
      id: 3,
      title: 'Likes',
      count: getLikeOnUserRecipes(profileDetails?.createdRecipes),
      icon: 'favorite',
    },

    {
      id: 4,
      title: 'Comments',
      count: getCommentOnUserRecipes(profileDetails?.createdRecipes),
      icon: 'chat_bubble',
    },
  ];

  return (
    <div className='flex flex-col gap-5 py-5'>
      {/* Profile Header */}
      <div className='flex justify-between items-center rounded-xl p-5 bg-white w-11/12 mx-auto shadow-[0_8px_30px_rgb(0,0,0,0.12)]'>
        <div className='text-3xl font-semibold'>
          Welcome back, {localStorage.getItem('user')} !
        </div>

        <div className='flex gap-5 items-center justify-center'>
          <span className='material-symbols-outlined'>notifications</span>

          <img
            className='w-12 h-12'
            src={`${localStorage.getItem(
              'userImage'
            )}`}
          />
        </div>
      </div>

      {/* Profile Analytics */}
      <div className='flex justify-between gap-8 w-11/12 mx-auto'>
        {profileAnalytics?.map((analytic) => (
          <div
            key={analytic.id}
            className='flex gap-3 bg-white w-1/4 p-5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
          >
            <span className='material-symbols-outlined p-3 rounded-md bg-slate-100'>
              {analytic.icon}
            </span>

            <div className='flex flex-col'>
              <div className='text-sm font-regular text-[#858585]'>
                {analytic.title}
              </div>

              <div className='text-xl font-semibold'>{analytic.count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className='flex justify-between gap-8 w-11/12 mx-auto'>
        {/* Activities */}
        <div className='w-1/2 bg-white rounded-xl p-5 flex flex-col gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'>
          <div className='text-xl font-bold'>Recent Activities</div>

          <div className='flex flex-col gap-5'>
            {recentActivity?.map((activity:any) => (
              <div className='flex gap-3'>
                <img
                  className='w-10 h-10'
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${activity.user}&radius=50&backgroundColor=65c9ff,b6e3f4,ffdfbf,ffd5dc,d1d4f9,c0aede&backgroundType=gradientLinear,solid`}
                />

                <div className='flex flex-col'>
                  <div className='text-lg'>{activity?.message}</div>

                  <div className='text-sm text-[#858585]'>
                    {calculateDifference(activity?.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Recipes */}
        <div className='w-1/2 bg-white rounded-xl p-5 flex flex-col gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]'>
          <div className='text-xl font-bold'>Trending Recipes</div>

          <div className='flex flex-col'>
            {trendingRecipe?.map((recipe: any) => (
              <div className='flex items-center gap-5 hover:bg-fuchsia-100 px-5 py-3 rounded-lg cursor-pointer' onClick={() => navigate(`/recipes/${recipe?._id}`)}>
                <div className='flex justify-center items-center bg-slate-100 rounded-lg text-[#666666] text-2xl '>
                  <img
                    src={recipe?.recipeImage}
                    className='rounded-lg object-cover w-16 h-16'
                  />
                </div>

                <div className='flex flex-col'>
                  <div className='font-semibold'>{recipe.recipeName}</div>

                  <div className='flex gap-5 w-full items-center'>
                    <div className='flex gap-1 items-center text-sm text-[#858585]'>
                      <Star color='yellow' fill='yellow' />

                      <div>{recipe.averageRating}</div>

                      <div>{`( ${recipe.rating?.length} reviews )`}</div>
                    </div>

                    <div className='w-1 h-1 rounded-full bg-fuchsia-400'></div>

                    <div className='flex gap-1 items-center text-sm text-[#858585]'>
                      <Heart color='red' fill='red' />

                      <div>{recipe.likesCount}</div>
                    </div>

                    <div className='w-1 h-1 rounded-full bg-fuchsia-400'></div>

                    <div className='flex gap-1 items-center text-sm text-[#858585]'>
                      <MessageSquareText color='#858585' />

                      <div>{recipe?.comments?.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
