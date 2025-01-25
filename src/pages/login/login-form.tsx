import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { userAvatar } from "@/utils/constants";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [form, setForm] = useState({email:'', password:''});

    const navigate = useNavigate();

    const handleForm = (e:any) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value,
        })
    }

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', form);
            console.log(response);
            if(response.data.success) {
                localStorage.setItem('token', response?.data?.data?.token);
                localStorage.setItem('user', response?.data?.data?.user?.name);
                localStorage.setItem('user_id', response?.data?.data?.user?._id);
                localStorage.setItem('userImage', userAvatar[Math.floor(Math.random()*userAvatar.length)])
                navigate('/dashboard');
                toast({
                    title: 'Welcome to CookTopia',
                    description: `Enjoy your journey ${response?.data?.data?.user?.name}`,
                })
            } else {
                toast({
                    title: 'Invaild Credentials',
                    description: "Please check details entered and try again",
                })
            }
        } catch (err) {
            toast({
                title: 'Invaild Credentials',
                description: "Please check details entered and try again",
            })
        }
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" placeholder="Email" onChange={(e) => handleForm(e)}/>
            </div>

            <div>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" name="password" placeholder="Password" onChange={(e) => handleForm(e)}/>
            </div>

            <div className="flex justify-center bg-[#202124] py-2 text-white rounded-lg cursor-pointer" onClick={() => handleLogin()}>
                Login
            </div>
        </div>
    )
}

export default LoginForm;