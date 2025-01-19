import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = (props:any) => {
    const { setSelectedMethod } = props;

    const { toast } = useToast();

    const [form, setForm] = useState({username:'', email:'', password:'', confirmPassword:''});
    const [error, setError] = useState({username:false, email:false, password:false});

    const navigate = useNavigate();

    const handleForm = (e:any) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value,
        })
        setError({...error, [e.target.name]: Boolean(e.target.value)})
        console.log(Boolean(e.target.value));
    }

    const checkEmptyFields = () => {
        if(form.username.length <= 0) {
            setError({...error, username:true});
        } else if(form.email.length <= 0) {
            setError({...error, email:true});
        } else if(form.password.length <= 0) {
            setError({...error, password:true});
        }
    }

    const handleRegister = async () => {
        checkEmptyFields()

        if((form?.password !== form?.confirmPassword)) {
            toast({
                title:'Password mismatch',
                description: "Password and confirm password enter not matches"
            });
            return;
        }

        try {
            const payload = {
                name: form.username,
                email:form.email,
                password: form.password
            }
            const response = await axios.post('http://localhost:4000/api/users/add', payload);
            if(response?.data?.success) {
                toast({
                    title:'User Registered successfully',
                    description:'Please login to continue with cooktopia'
                })
                setSelectedMethod('login');
            }
        } catch (err) { 
            console.log(err);
        }
    }

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="w-full">
                <Label htmlFor="username">Username</Label>
                <Input type="text" id="username" placeholder="Username" name="username" onChange={(e) => handleForm(e)}/>
                {
                    error.username && <div className="text-red-600 font-bold text-xs">Username is required field.</div>
                }
            </div>

            <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="Email" name="email" onChange={(e) => handleForm(e)}/>
            </div>

            <div>
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" placeholder="Password" name="password" onChange={(e) => handleForm(e)}/>
            </div>

            <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input type="password" id="confirm-password" placeholder="Confirm Password" name="confirmPassword" onChange={(e) => handleForm(e)}/>
            </div>

            <div className="flex justify-center bg-[#202124] py-2 text-white rounded-lg cursor-pointer" onClick={() => handleRegister()}>
                Register
            </div>
        </div>
    )
}

export default RegisterForm;