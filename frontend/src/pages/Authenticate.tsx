import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '@/hooks/useSignup';
import { useSignin } from '@/hooks/useSignin';
import { useRef, useState } from 'react';
import { GridPattern } from '@/components/ui/grid-pattern';
import { AnimatePresence, motion } from 'motion/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

const formSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export function Authenticate() {
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signin');
  const authModeRef = useRef(authMode);
  authModeRef.current = authMode;

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: '', password: '', name: '' },
    resolver: zodResolver(
      formSchema.superRefine((data, ctx) => {
        if (authModeRef.current === 'signup' && (!data.name || data.name.length < 2)) {
          ctx.addIssue({
            code: 'custom',
            path: ['name'],
            message: 'Name must be at least 2 characters',
          });
        }
      })
    ),
  });
  const { signup, error: signupError, isLoading: signupLoading } = useSignup();
  const { signin, error: signinError, isLoading: signinLoading } = useSignin();
  const { googleAuth, isLoading: googleLoading } = useGoogleAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      const success = await googleAuth(access_token);
      if (success) navigate('/dashboard');
    },
    onError: () => console.log('Login Failed'),
  });

  const error = authMode === 'signup' ? signupError : signinError;
  const isLoading = authMode === 'signup' ? signupLoading : signinLoading;

  const switchAuthMode = () => {
    form.reset();
    setAuthMode((prevMode) => (prevMode === 'signup' ? 'signin' : 'signup'));
  };

  async function onSubmit(values: z.infer<typeof formSchema>, authMode: string) {
    if (authMode === 'signup') {
      const success = await signup(values.name!, values.email, values.password);
      if (success) {
        navigate('/dashboard');
      }
    } else {
      const success = await signin(values.email, values.password);
      if (success) {
        navigate('/dashboard');
      }
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel — grid pattern + hero text */}
      <div className="flex-2 relative hidden overflow-hidden text-neutral-900 lg:flex lg:items-center lg:justify-center">
        <GridPattern />
        <motion.div
          className="relative z-10 flex max-w-lg flex-col gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-5xl font-semibold leading-tight">
            AI-powered job tracking made simple
          </span>
          <span className="text-lg">
            Centralize, summarize, and follow up — all with the help of intelligent automation.
          </span>
          <DotLottieReact
            src="https://lottie.host/bdf05385-e606-435a-b04c-243d7322845e/fUb4wVPwFD.lottie"
            loop
            autoplay
          />
        </motion.div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto border-x bg-white px-8 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => onSubmit(values, authMode))}
              className="space-y-8"
            >
              <div className="overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={authMode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="block text-3xl font-semibold text-neutral-900"
                  >
                    {authMode === 'signup' ? 'Sign up now!' : 'Welcome back!'}
                  </motion.span>
                </AnimatePresence>
                <p className="mt-1 text-sm text-neutral-500">
                  {authMode === 'signup'
                    ? 'Create an account to get started.'
                    : 'Sign in to your account to continue.'}
                </p>
              </div>
              <Button type="button" className="w-full" disabled={googleLoading} onClick={() => googleLogin()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
                  />
                  <path
                    fill="#FF3D00"
                    d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
                  />
                </svg>
                {googleLoading ? 'Continuing with Google...' : 'Continue with Google'}
              </Button>
              <div className="flex items-center gap-3">
                <hr className="flex-1 border-neutral-200" />
                <span className="text-sm text-neutral-400">OR</span>
                <hr className="flex-1 border-neutral-200" />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <motion.div
                initial={false}
                animate={{
                  height: authMode === 'signup' ? 'auto' : 0,
                  opacity: authMode === 'signup' ? 1 : 0,
                  marginBottom: authMode === 'signup' ? '2rem' : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {!isLoading && authMode === 'signup'
                    ? 'Sign Up'
                    : !isLoading && authMode === 'signin'
                      ? 'Sign In'
                      : isLoading && authMode === 'signup'
                        ? 'Signing Up...'
                        : 'Signing In...'}
                </Button>
                <p className="text-center text-sm text-neutral-500">
                  {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <span
                    className="ml-1 cursor-pointer font-medium text-neutral-900 underline underline-offset-2"
                    onClick={switchAuthMode}
                  >
                    {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                  </span>
                </p>
              </div>
              {error && (
                <div className="flex items-center justify-center text-sm text-red-500">{error}</div>
              )}
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
