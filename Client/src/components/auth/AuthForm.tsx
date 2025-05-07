import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: any) => void;
  loading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (type === 'register' && !formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (type === 'register' && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (type === 'login') {
      onSubmit({
        email: formData.email,
        password: formData.password
      });
    } else {
      onSubmit({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    }
  };

  return (
    <div className="bg-white sm:rounded-xl sm:shadow-sm sm:border border-gray-200 w-full max-w-sm mx-auto overflow-hidden">
      <div className="px-8 pt-8 pb-6">
        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900">
          {type === 'login' ? 'Welcome back!' : 'Create your account'}
        </h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'register' && (
            <div>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Full name"
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  formErrors.name ? 'border-red-300' : 'border-gray-200'
                } focus:outline-none focus:border-gray-400 focus:ring-0 text-gray-900`}
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
          )}
          
          <div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              required
              className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                formErrors.email ? 'border-red-300' : 'border-gray-200'
              } focus:outline-none focus:border-gray-400 focus:ring-0 text-gray-900`}
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete={type === 'login' ? 'current-password' : 'new-password'}
                required
                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                  formErrors.password ? 'border-red-300' : 'border-gray-200'
                } focus:outline-none focus:border-gray-400 focus:ring-0 text-gray-900`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>
          
          {type === 'register' && (
            <div>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  required
                  className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                    formErrors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                  } focus:outline-none focus:border-gray-400 focus:ring-0 text-gray-900`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>{type === 'login' ? 'Sign in' : 'Sign up'}</span>
            )}
          </button>
          
          {type === 'login' && (
            <div className="text-center">
              <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                Forgot password?
              </Link>
            </div>
          )}
        </form>
      </div>
      
      <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <Link 
            to={type === 'login' ? '/register' : '/login'} 
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            {type === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;