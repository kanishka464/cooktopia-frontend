import RecipeListing from '@/components/common/RecipeListing';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UserFollowers from '@/components/user-profile/user-followers';
import { useToast } from '@/hooks/use-toast';
import { type, userAvatar } from '@/utils/constants';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { ArrowLeftRight, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const [selectedTab, setSelectedTab] = useState('My Recipes');
  const [profileDetails, setProfileDetails] = useState<any>();
  const [profilePicUpdate, setProfilePicUpdate] = useState<boolean>(false);
  const [profileUpdate, setProfileUpdate] = useState({
    selectedType: '',
    selectedAvtaar: '',
  });

  const { id } = useParams();
  const { toast } = useToast();

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },

          params: {
            userId: id !== localStorage.getItem('user_id') ? id : null,
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
        return <RecipeListing recipes={profileDetails?.createdRecipes} />;
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

  const handleProfileUpdate = async () => {
    try {
      const payloadBody = {
        type: profileUpdate?.selectedType,
        avtaar: profileUpdate.selectedAvtaar,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/update-profile-picture`,
        payloadBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response?.data?.success) {
        localStorage.setItem('userImage', response?.data?.data);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setProfileUpdate({ selectedType: '', selectedAvtaar: '' });
      setProfilePicUpdate(false);
    }
  };

  const handleFollow = async () => {
    try {
        console.log(localStorage.getItem('token'))
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/follow/${id}`,{}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(response);
        if(response.data.success) {
            toast({
                title: response?.data?.message
            })
        }
    } catch (error) {
        console.log(error);
    } finally {
        getUserDetails();
    }
  }

  const handleUnfollow = async () => {
    try {
        console.log(localStorage.getItem('token'))
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/unfollow/${id}`,{}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        console.log(response);
        if(response.data.success) {
            toast({
                title: response?.data?.message
            })
        }
    } catch (error) {
        console.log(error);
    } finally {
        getUserDetails();
    }
  }

  console.log(profileDetails?.following?.some((follow:any) => follow?._id !== id))

  useEffect(() => {
    getUserDetails();
  }, [id]);

  return (
    <div className='flex flex-col gap-4 bg-slate-200 h-full'>
      {/* User profile header section */}
      <div className='flex mx-auto w-[97%] bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] my-2'>
        <div className='flex w-full justify-between items-center py-4 px-8'>
          <div className='flex items-center gap-4'>
            <div className='bg-slate-400 h-24 w-24 rounded-full relative'>
              <img src={profileDetails?.picture} />

              { id === localStorage.getItem('user_id') && <div
                className='absolute bottom-0 right-0 p-2 rounded-full bg-[#fafafa] cursor-pointer'
                onClick={() => setProfilePicUpdate(true)}
              >
                <Pencil size={16} />
              </div>}
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
                  <div className='font-bold text-sm'>
                    {profileDetails?.createdRecipes?.length}
                  </div>
                  <div className='text-sm font-light'>Recipes</div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='font-bold text-sm'>
                    {profileDetails?.followers?.length}
                  </div>
                  <div className='text-sm font-light'>Followers</div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='font-bold text-sm'>
                    {profileDetails?.following?.length}
                  </div>
                  <div className='text-sm font-light'>Following</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {id !== localStorage.getItem('user_id') && <div>
                {
                    profileDetails?.followers?.some((follow:any) => follow?._id === localStorage.getItem('user_id'))  ? <div className='bg-white  text-[#202124] border-[2px] border-[#202124] text-lg rounded-lg px-4 py-2 cursor-pointer' onClick={() => handleUnfollow()}>
                    Unfollow
                  </div> : <div className='bg-[#202124]  text-white text-lg rounded-lg px-4 py-2 cursor-pointer' onClick={() => handleFollow()}>
                  Follow
                </div>
                }
                </div>}
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

      {profilePicUpdate && (
        <Dialog
          fullWidth
          maxWidth='sm'
          open={profilePicUpdate}
          onClose={() => setProfilePicUpdate(false)}
        >
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogContent>
            <div className='flex flex-col gap-5 justify-center items-center'>
              <div className='flex items-center gap-8 justify-around'>
                <div className='w-36 h-36'>
                  <img src={localStorage.getItem('userImage') || ''} />
                </div>

                <ArrowLeftRight size={36} />

                <div className='w-36 h-36'>
                  {profileUpdate?.selectedType?.length > 0 ? (
                    <img
                      src={`https://api.dicebear.com/9.x/${profileUpdate?.selectedType}/svg?seed=${profileUpdate?.selectedAvtaar}&radius=50&backgroundColor=65c9ff,b6e3f4,ffdfbf,ffd5dc,d1d4f9,c0aede&backgroundType=gradientLinear,solid`}
                    />
                  ) : (
                    <div className='bg-[#858585] w-full h-full rounded-full'></div>
                  )}
                </div>
              </div>

              <div className='w-full'>
                <Label>Type</Label>
                <Select
                  onValueChange={(e) =>
                    setProfileUpdate((prev) => {
                      return { ...prev, selectedType: e };
                    })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a type' />
                  </SelectTrigger>
                  <SelectContent className='!z-[9999]'>
                    <SelectGroup>
                      {type?.map((type) => (
                        <SelectItem value={type}>{type}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className='w-full'>
                <Label>Avataar</Label>
                <Select
                  onValueChange={(e) =>
                    setProfileUpdate((prev) => {
                      return { ...prev, selectedAvtaar: e };
                    })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a Avataar' />
                  </SelectTrigger>
                  <SelectContent className='!z-[9999]'>
                    <SelectGroup>
                      {userAvatar.map((avataar) => (
                        <SelectItem value={avataar}>{avataar}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant='contained'
                sx={{ width: '100%' }}
                onClick={() => handleProfileUpdate()}
              >
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserProfile;
