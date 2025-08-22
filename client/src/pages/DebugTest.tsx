import React, { useState } from 'react';
import axiosInstance from '../utils/axios';

const DebugTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/health');
      setResult(`Health Check 성공: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`Health Check 실패: ${error.message} - ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      setResult(`로그인 성공: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`로그인 실패: ${error.message} - ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        username: 'debuguser',
        email: 'debug@example.com',
        password: 'password123'
      });
      setResult(`회원가입 성공: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`회원가입 실패: ${error.message} - ${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Test Page</h1>
      
      <div className="space-y-4 mb-8">
        <button 
          onClick={testHealthCheck}
          disabled={loading}
          className="btn btn-primary mr-4"
        >
          Health Check 테스트
        </button>
        
        <button 
          onClick={testLogin}
          disabled={loading}
          className="btn btn-secondary mr-4"
        >
          로그인 테스트 (test@example.com)
        </button>
        
        <button 
          onClick={testRegister}
          disabled={loading}
          className="btn btn-accent"
        >
          회원가입 테스트 (debug@example.com)
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">결과:</h3>
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default DebugTest;