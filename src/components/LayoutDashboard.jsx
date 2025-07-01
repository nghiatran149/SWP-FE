import React from 'react';
import Sidebar from './Sidebar';

const LayoutDashboard = ({ children, activeMenuItem = 'overview' }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenuItem={activeMenuItem} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default LayoutDashboard;