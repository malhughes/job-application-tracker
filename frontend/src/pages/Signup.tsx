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
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '@/hooks/useSignup';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export function Signup() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await signup(values.name, values.email, values.password);
    if (success) {
      navigate('/dashboard');
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
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto w-full max-w-md space-y-8"
            >
              <div>
                <span className="text-3xl font-medium">Sign up now</span>
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center gap-4">
                <Button type="submit" disabled={isLoading}>
                  Sign Up
                </Button>
                <span>
                  Already have an account?
                  <Link to="/signin" className="ml-1 underline">
                    Sign In
                  </Link>
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
