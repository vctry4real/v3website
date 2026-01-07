import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Login successful!');
        onLoginSuccess();
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 translate-y-1/2"></div>
      </div>

      <div className="bg-surface-elevated/10 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-purple-500/5 rounded-2xl pointer-events-none"></div>
        <div className="text-center">
          <div className="w-16 h-16 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border/50">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-text">Admin Login</h2>
          <p className="text-text-muted mt-2">Sign in to access the admin panel</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...form.register('email')}
              className="w-full px-4 py-3 bg-surface-muted border border-border-muted rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="admin@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-error text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...form.register('password')}
                className="w-full px-4 py-3 bg-surface-muted border border-border-muted rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 transition-all duration-200"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-error text-sm mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3"
            variant="primary"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-text-muted text-sm">
            Don't have an account? Contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
}; 