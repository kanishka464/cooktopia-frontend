import { useToast } from '@/hooks/use-toast';
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

  const { toast } = useToast();

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
          <div className='text-2xl font-semibold'>Community Discussion</div>

          <div
            className='bg-[#202124] text-white rounded-lg px-3 py-2 cursor-pointer'
            onClick={() => setOpen(true)}
          >
            New Post
          </div>
        </div>
      </div>

      {/* POST LISTING */}
      <div className='grid grid-cols-3 gap-5 w-[97%] mx-auto'>
          {posts?.map((post: any) => (
            <div className='bg-white w-full p-3 rounded-lg shadow-lg'>
              <div className='font-bold'>{post?.postTitle}</div>
              <div className='text-sm font-light text-slate-400 pl-2'>{post?.postText}</div>
              <div className='text-xs font-light text-slate-400 flex place-content-end'>
                written by: {post?.postedBy?.name}
              </div>
            </div>
          ))}
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
