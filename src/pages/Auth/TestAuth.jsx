import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const TestAuth = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log('Auth State:', { isAuthenticated, user, loading });
  }, [isAuthenticated, user, loading]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Authentication State</h2>
      <pre>
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
