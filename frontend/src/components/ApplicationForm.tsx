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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { apiFetch } from '@/lib/apiFetch';

const statusOptions = ['applied', 'interviewing', 'rejected'] as const;

const formSchema = z.object({
  title: z.string(),
  company: z.string(),
  link: z.url({
    protocol: /^https?$/,
    hostname: z.regexes.domain,
  }),
  status: z.enum(statusOptions),
  nextStep: z.string(),
});

type ApplicationFormProps = {
  onSuccess: () => void;
  application?: {
    _id: string;
    status: 'applied' | 'interviewing' | 'rejected';
    nextStep: string;
    jobDetails: {
      title: string;
      company: string;
      link: string;
    };
  };
};

export function ApplicationForm({ onSuccess, application }: ApplicationFormProps) {
  const isEditing = !!application;
  const [isLoading, setIsLoading] = useState(false);
  const [extractionWarning, setExtractionWarning] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: application
      ? {
          title: application.jobDetails.title,
          company: application.jobDetails.company,
          status: application.status,
          nextStep: application.nextStep,
          link: application.jobDetails.link,
        }
      : undefined,
  });

  const { user, dispatch } = useAuthContext();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      console.error('You must be logged in.');
      return;
    }
    const { title, company, link, status, nextStep } = values;

    const url = isEditing ? `/api/applications/${application._id}` : '/api/applications/';
    const method = isEditing ? 'PUT' : 'POST';

    setIsLoading(true);
    const response = await apiFetch(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ title, company, link, status, nextStep }),
      },
      dispatch
    );
    setIsLoading(false);

    if (response.status === 409) {
      form.setError('link', { message: 'An application with that link already exists.' });
      return;
    }

    if (response.ok) {
      if (response.headers.get('X-AI-Extraction') === 'failed') {
        setExtractionWarning(true);
        setTimeout(() => {
          setExtractionWarning(false);
          form.reset();
          onSuccess();
        }, 3000);
      } else {
        form.reset();
        onSuccess();
      }
    }
  };

  return (
    <div className="p-4 pt-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input disabled={isEditing} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextStep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Step</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {extractionWarning && (
            <p className="text-sm text-yellow-600">
              Application saved, but we couldn't extract info from that URL.
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Save Application and Extract Info'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
