// import React from "react";

import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

const Login = () => {
    const [selectedMethod, setSelectedMethod] = useState<string>('login');
    return (
        <div className="flex justify-center items-center w-full h-[100vh]">
            <div className="p-5 bg-white flex flex-col gap-5 items-center w-1/4">
                <div className="flex flex-col items-center gap-1">
                    <div className="font-bold text-3xl">
                        CookTopia
                    </div>
                    <div className="text-sm text-[#858585]">
                        Share your culinary creations with the world
                    </div>
                </div>

                <div className="w-full flex gap-4">
                    {
                        ["Login", "Register"]?.map((method) => (
                            <div className={`${selectedMethod === method?.toLowerCase() ? 'bg-[#202124] text-white' : 'bg-[#cccccc] text-[#858585]'} flex justify-center py-2 w-1/2 cursor-pointer rounded-lg`} onClick={() => setSelectedMethod(method?.toLowerCase())}>
                                {method}
                            </div>
                        ))
                    }
                </div>

                <div className="w-full">
                    {
                        selectedMethod === 'login' ? <LoginForm/> : <RegisterForm setSelectedMethod={setSelectedMethod}/>
                    }
                </div>

                <div></div>
            </div>
        </div>
    )
}

export default Login;