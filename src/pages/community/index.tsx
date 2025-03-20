import { useToast } from '@/hooks/use-toast';
import { calculateDifference } from '@/utils/helper';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const Community = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [postData, setPostData] = useState<any>({
    postTitle: '',
    postText: '',
    metaTags: '',
  });
  const [posts, setPosts] = useState<any>([]);
  const [recentDiscussions, setRecentDiscussion] = useState<any>([]);

  const { toast } = useToast();

  const getRecentDiscussions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/community/recent-posts`
      );
      setRecentDiscussion(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/community/list-post`
      );
      setPosts(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
    getRecentDiscussions();
  }, []);

  const submitPost = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        ...postData,
        user_id: localStorage.getItem('user_id'),
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/community/post`,
        payload
      );

      if (response?.data?.success) {
        toast({
          title: 'Post Created',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className='flex flex-col gap-4 bg-slate-200 h-full'>
      {/* COMMUNITY HEADER */}
      <div className='flex mx-auto w-[97%] bg-white rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] my-2'>
        <div className='flex w-full justify-between items-center py-4 px-8'>
          <div className='text-lg lg:text-2xl font-semibold'>Community Discussion</div>

          <div
            className='bg-[#202124] text-white rounded-lg px-2 lg:px-3 py-1 lg:py-2 cursor-pointer text-sm'
            onClick={() => setOpen(true)}
          >
            New Post
          </div>
        </div>
      </div>

      {/* POST LISTING */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-5 w-[97%] mx-auto'>
        {posts?.map((post: any) => (
          <div className='bg-white w-full p-3 rounded-lg shadow-lg'>
            <div className='font-bold'>{post?.postTitle}</div>
            <div className='text-sm font-light text-slate-400 pl-2'>
              {post?.postText}
            </div>
            <div className='text-xs font-light text-slate-400 flex place-content-end'>
              written by: {post?.postedBy?.name}
            </div>
          </div>
        ))}
      </div>

      {/* RECENT DISCUSSION */}
      <div className='w-[97%] mx-auto bg-white shadow-lg rounded-lg p-5 flex flex-col gap-5'>
        <div className='text-xl font-semibold'>
          Recent Discussions
        </div>
        <div className='flex flex-col gap-6'>
          {
            recentDiscussions?.map((discussion:any) => (
              <div className='flex gap-3 items-start hover:bg-fuchsia-100 py-2 px-3 rounded-lg cursor-pointer'>
                <div className='w-12 h-12'>
                  {discussion?.postedBy?.picture ? <img src={discussion?.postedBy?.picture}/> : <div className='w-12 h-12 rounded-full bg-slate-100'></div>}
                </div>

                <div className='flex flex-col gap-1'>
                  <div className='flex gap-3 items-center'>
                    <div className='text-sm'>
                      {discussion?.postTitle}
                    </div>
                    <div className='flex gap-2'>
                      {discussion?.metaTags[0]?.split(' ')?.map((tag:string) => <div className='text-xs text-[#858585] bg-slate-100 py-1 px-3 rounded-lg'>{tag}</div>)}
                    </div>
                  </div>
                  <div className='text-xs text-[#858585]'>
                    {discussion?.postText}
                  </div>

                  <div className='flex gap-5 pt-2 pl-2'>
                    <div className='text-xs text-[#858585]'>{`by ${discussion?.postedBy?.name}`}</div>
                    <div className='text-xs text-[#858585]'>{calculateDifference(discussion?.created_at)}</div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      {open && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth='md'
        >
          <DialogTitle>Create a new post</DialogTitle>

          <DialogContent>
            <Box
              sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                variant='outlined'
                label='Post Title'
                onChange={(e) =>
                  setPostData((prev: any) => {
                    return { ...prev, postTitle: e.target.value };
                  })
                }
              />
              <TextField
                variant='outlined'
                label='Post Description'
                onChange={(e) =>
                  setPostData((prev: any) => {
                    return { ...prev, postText: e.target.value };
                  })
                }
              />
              <TextField
                variant='outlined'
                label='Post Tags'
                onChange={(e) =>
                  setPostData((prev: any) => {
                    return { ...prev, metaTags: e.target.value };
                  })
                }
              />

              <Button
                variant='contained'
                color='primary'
                onClick={(e) => submitPost(e)}
              >
                Create Post
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Community;
