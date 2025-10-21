import React, { useState } from 'react';
import Shapes from '../../assets/svgs/startlink-shapes.svg';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { validateEmail, validatePassword } from '../../utils/validation';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || '',
        password: passwordError || '',
      });
      return;
    }

    // Clear errors
    setErrors({ email: '', password: '' });

    try {
      const user = await login(email, password);
      if (user) {
        addToast('Login successful', 'success');
        navigate('/');
      } else {
        addToast('Invalid email or password', 'error');
      }
    } catch (error) {
      addToast('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-surface to-neutral-100 overflow-hidden">
      {/* Decorative background shapes aligned like landing page */}
      <img
        src={Shapes}
        alt=""
        aria-hidden="true"
        className="hidden md:block pointer-events-none select-none opacity-30 absolute rotate-180 z-0 left-0 top-50 w-[160px] lg:w-[215px]"
      />
      <img
        src={Shapes}
        alt=""
        aria-hidden="true"
        className="hidden md:block pointer-events-none select-none opacity-30 absolute z-0 right-0 top-32 w-[160px] lg:w-[215px]"
      />
      

      <div className="relative z-10 max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/starlink-logo.png" 
            alt="Starlink" 
            className="h-20 mx-auto mb-3"
          />
        </div>
        
        <div className="bg-white/90 backdrop-blur rounded-lg shadow-lg p-8 relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          
          <Button type="submit" className="w-full" isLoading={isLoading} variant='secondary'  size='lg'>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p className="font-mono mt-1">sheharyaar.furqan@camp1.tkxel.com / Tkxel123$</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
