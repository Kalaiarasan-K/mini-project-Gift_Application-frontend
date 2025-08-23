// MainLayout.jsx  
import React from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 pt-16 p-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export { MainLayout };