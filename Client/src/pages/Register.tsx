import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const Register: React.FC = () => {
  const { register, currentUser, loading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(error);
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  const handleRegister = async (data: { name: string; email: string; password: string }) => {
    try {
      await register(data.name, data.email, data.password);
      navigate('/');
    } catch (error) {
      setAuthError((error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <h1 className="text-center text-4xl font-bold text-gray-900">Penned</h1>
        <p className="mt-3 text-center text-gray-600 text-lg">
          Join our community of storytellers
        </p>
      </div>

      <AuthForm 
        type="register" 
        onSubmit={handleRegister} 
        loading={loading} 
        error={authError} 
      />
    </div>
  );
};

export default Register;