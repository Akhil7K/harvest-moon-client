'use client';

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "../ui/button";

export const Social = ()=>{
    const handleClickFacebook = ()=>{
        console.log("login with facebook clicked");
        
    }
    const handleClickGoogle = ()=>{
        console.log("login with google clicked");
        
    }
    return (
        <div className="flex items-center w-full gap-x-2">
            <Button
                size={"sm"}
                variant={"outline"}
                className="w-full"
                onClick = {handleClickGoogle}
            >
                <FcGoogle className="h-5 w-5"/>
                Google
            </Button>
            <Button
                size={"sm"}
                variant={"outline"}
                className="w-full"
                onClick = {handleClickFacebook}
            >
                <FaFacebook className="h-5 w-5"/>
                Facebook
            </Button>
        </div>
    )
}