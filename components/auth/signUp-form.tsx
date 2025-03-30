'use client';

import { CardWrapper } from "./card-wrapper";
import {useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from "@/components/ui/form"
import {  RegisterSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";
import { signup } from "@/actions/auth/signup";
import { FormError } from "../form-error";

const SignupForm = ()=> {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            name: "",
            email:"",
            password:"",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>)=>{
        setError('');
        setSuccess('');

        startTransition(() => {
            signup(values)
                .then((data) => {
                    setSuccess(data.error);
                    setError(data.success);
                })
        });
    }


    return (
        <CardWrapper
        headerLabel="Create an Account"
        backButtonLabel="Sign in"
        backButtonHref="/auth/sign-in"
        showSocial
        backButtonNote="Already have an account?"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name = "name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel> Name </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Your Name"
                                            type="text"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name = "email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel> Email </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="email@example.com"
                                            type="email"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name = "password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel> Password </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            type="password"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormSuccess message={error}/>
                    <FormError message={success}/>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                        variant={"harvest"}
                    >
                        Create an Account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export default SignupForm;