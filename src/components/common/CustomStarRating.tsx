import { useToast } from '@/hooks/use-toast';
import { Button, Rating } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const CustomStarRating = (props: any) => {
  const { value } = props;
  const [rating, setRating] = useState<number | null>(value || 0);

  const { id } = useParams();
  const { toast } = useToast();

  const submitRating = async () => {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
        recipe_id: id,
        rating: rating,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/recipe/rate-recipe`,
        payload
      );

      if (response?.data?.success) {
        toast({ title: 'Recipe rated successfully' });
      }
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <Rating
        name='size-large'
        defaultValue={0}
        value={Boolean(value) ? value : rating}
        size='large'
        onChange={(_, value) => setRating(value)}
        disabled={Boolean(value)}
      />

      <Button
        variant='contained'
        color='success'
        sx={{ width: 'fit-content' }}
        onClick={() => submitRating()}
        disabled={Boolean(value)}
      >
        Rate
      </Button>
    </div>
  );
};
