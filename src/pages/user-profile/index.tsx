import RecipeListing from '@/components/common/RecipeListing';
import UserFollowers from '@/components/user-profile/user-followers';
import axios from 'axios';
import { useEffect, useState } from 'react';

const UserProfile = () => {
    const [selectedTab, setSelectedTab] = useState('My Recipes');
    const [profileDetails, setProfileDetails] = useState<any>();

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

    const userDetail = (tab: string) => {
        switch (tab) {
            case 'My Recipes':
                return (
                    <RecipeListing recipes={profileDetails?.createdRecipes} />
                );
            case 'Following':
                return <UserFollowers followers={profileDetails?.following} />;
            case 'Followers':
                return <UserFollowers followers={profileDetails?.followers} />;
            case 'Liked':
                return <RecipeListing recipes={profileDetails?.likedRecipes} />;
            default:
                console.log('default');
                return null;
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className='flex flex-col gap-4 bg-slate-200 h-full'>
            {/* User profile header section */}
            <div className='flex mx-auto w-[97%] bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] my-2'>
                <div className='flex w-full justify-between items-center py-4 px-8'>
                    <div className='flex items-center gap-4'>
                        <div className='bg-slate-400 h-24 w-24 rounded-full'>
                            <img
                                src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${localStorage.getItem('userImage')}&radius=50&backgroundColor=65c9ff,b6e3f4,ffdfbf,ffd5dc,d1d4f9,c0aede&backgroundType=gradientLinear,solid`}
                            />
                        </div>

                        <div className='flex flex-col gap-4 justify-between'>
                            <div className='flex flex-col'>
                                <div className='text-xl font-bold'>
                                    {profileDetails?.name || 'Developer'}
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div>{`@${localStorage.getItem('user')?.split(' ').join('').toLowerCase()}`}</div>
                                    <div className='w-1 h-1 rounded-full bg-slate-600'></div>
                                    <div>Food enthusiast from Delhi</div>
                                </div>
                            </div>

                            <div className='flex gap-8 items-center'>
                                <div className='flex flex-col items-center'>
                                    <div className='font-bold text-sm'>{profileDetails?.createdRecipes?.length}</div>
                                    <div className='text-sm font-light'>
                                        Recipes
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='font-bold text-sm'>
                                        {profileDetails?.followers?.length}
                                    </div>
                                    <div className='text-sm font-light'>
                                        Followers
                                    </div>
                                </div>
                                <div className='flex flex-col items-center'>
                                    <div className='font-bold text-sm'>
                                        {profileDetails?.following?.length}
                                    </div>
                                    <div className='text-sm font-light'>
                                        Following
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='bg-[#202124] text-white rounded-lg px-3 py-2'>
                        Edit Profile
                    </div>
                </div>
            </div>

            {/* User menu section */}
            <div className='flex mx-auto w-[97%] bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]'>
                <div className='flex w-full items-center py-2 px-8'>
                    {['My Recipes', 'Liked', 'Following', 'Followers'].map(
                        (item, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer font-normal py-3 px-4 rounded-lg  ${selectedTab === item ? 'bg-fuchsia-400 text-white' : ''}`}
                                onClick={() => setSelectedTab(item)}
                            >
                                {item}
                            </div>
                        )
                    )}
                </div>
            </div>

            {userDetail(selectedTab)}
        </div>
    );
};

export default UserProfile;
