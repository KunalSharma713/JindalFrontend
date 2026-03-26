import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const TestAuth = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('Auth State:', { isAuthenticated, user, loading });
  }, [isAuthenticated, user, loading]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 font-mono">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-mono mb-4">Authentication State</h2>
      <pre className="text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-lg overflow-x-auto">
        {JSON.stringify({
          isAuthenticated,
          user,
          loading,
          localStorage: {
            accessToken: localStorage.getItem('accessToken') ? '***' : 'Not found',
            user: localStorage.getItem('user') ? '***' : 'Not found'
          }
        }, null, 2)}
      </pre>
    </div>
  );
};

export default TestAuth;
