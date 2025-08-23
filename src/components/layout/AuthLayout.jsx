import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {children}
    </div>
  );
};

export { AuthLayout };