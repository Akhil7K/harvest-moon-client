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
import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import Link from "next/link";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";
import { login } from "@/actions/auth/login";
import {useRouter} from 'next/navigation';
import axios from "axios";
import { deleteCookie } from "@/lib/clientSession";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const LoginForm = ()=> {
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            email:"",
            password:"",
            code: '',
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>)=>{
        setError('');
        setSuccess('');

        startTransition(() => {
            login(values)
                .then(async (data) => {
                    if (data?.error) {
                        form.reset();
                        setError(data.error);
                    }

                    if (data?.success) {
                        // Merge guest cart after successfull login
                        const urlParams = new URLSearchParams(window.location.search);
                        const guestSessionId = urlParams.get('guestSession');

                        if (guestSessionId) {
                            try {
                                await axios.post('/api/cart/merge', {
                                    guestSessionId,
                                    strategy: 'PRIORITIZE_USER'
                                });

                                localStorage.removeItem('cart_session');
                                deleteCookie('guest_cart_session');
                            } catch (error) {
                                console.error("Merge failed: ", error);
                            }
                            
                        }
                        form.reset();
                        setSuccess(data.success);
                    }

                    // Handling redirect after successful login
                    const returnUrl = sessionStorage.getItem('returnUrl');

                    if (returnUrl) {
                        router.push(returnUrl || DEFAULT_LOGIN_REDIRECT);
                        sessionStorage.removeItem('returnUrl');
                        // router.push(returnUrl);
                    }

                    if (data?.twoFactor) {
                        setShowTwoFactor(true);
                    }
                })
                .catch(() => setError("Something went wrong"));
        });
    }


    return (
        <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="Sign up"
        backButtonHref="/auth/sign-up"
        backButtonNote="Don't have an account?"
        showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name = "code"
                                render={({field})=>(
                                    <FormItem>
                                        <FormLabel> Code </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="123456"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwoFactor && (
                            <>
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
                                            <Button
                                                size={'sm'}
                                                variant={'link'}
                                                asChild
                                                className="px-0"
                                            > 
                                                <Link href={'/auth/reset-password'}>
                                                    Forgot Password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    
                    <FormSuccess message={success}/>
                    <FormError message={error}/>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}