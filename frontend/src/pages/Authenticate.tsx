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
          ctx.addIssue({ code: 'custom', path: ['name'], message: 'Name must be at least 2 characters' });
        }
      }),
    ),
  });
  const { signup, error: signupError, isLoading: signupLoading } = useSignup();
  const { signin, error: signinError, isLoading: signinLoading } = useSignin();
  const navigate = useNavigate();

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
    <div className="flex h-full items-center justify-between gap-8 overflow-auto bg-neutral-800 px-10 text-white">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex max-w-lg flex-col gap-4">
          <span className="text-4xl font-medium">AI-powered job tracking made simple</span>
          <span className="text-lg">
            Centralize, summarize, and follow up — all with the help of intelligent automation.
          </span>
        </div>
      </div>
      <div className="flex h-full flex-1 items-center justify-center py-8">
        <div
          className="w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-8 text-black shadow-sm"
          style={{ maxHeight: 'calc(100vh - 8rem)' }}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => onSubmit(values, authMode))}
              className="mx-auto w-full max-w-md space-y-8"
            >
              <div>
                <span className="text-3xl font-medium">
                  {authMode === 'signup' ? 'Sign up now!' : 'Welcome back!'}
                </span>
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
              {authMode === 'signup' && (
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
              )}
              <div className="flex items-center justify-center gap-4">
                <Button type="submit" disabled={isLoading}>
                  {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
                </Button>
                <span>
                  {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <span className="ml-1 cursor-pointer underline" onClick={switchAuthMode}>
                    {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                  </span>
                </span>
              </div>
              {error && (
                <div className="flex items-center justify-center text-red-500">{error}</div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
