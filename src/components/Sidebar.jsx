import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  AppWindow,

  Users,
  IdCardLanyard,
  ClipboardPenLine,
  NotebookPen,
  Newspaper,

  User,
} from 'lucide-react';

const Sidebar = ({ activeMenuItem = 'overview' }) => {
  const { user } = useAuth();

  // Define menu items for each role
  const getMenuItemsByRole = () => {
    const commonItems = [
      // { id: 'overview', label: 'Tổng quan', icon: Home },
    ];

    const memberItems = [
      { id: 'myassessment', label: 'Đánh giá của tôi', icon: FileText },
      { id: 'mycourse', label: 'Khóa học của tôi', icon: BookOpen },
      // { id: 'myappointment', label: 'Lịch hẹn của tôi', icon: Calendar },
      { id: 'mycampaign', label: 'Chương trình của tôi', icon: AppWindow },
    ];

    // Admin specific items
    const adminItems = [
      { id: 'overview', label: 'Tổng quan', icon: Home },
      { id: 'usermanagement', label: 'Quản lý người dùng', icon: Users },
      { id: 'consultantmanagement', label: 'Quản lý chuyên viên', icon: IdCardLanyard },
      { id: 'surveymanagement', label: 'Quản lý bài đánh giá', icon: ClipboardPenLine },
      { id: 'coursemanagement', label: 'Quản lý khóa học', icon: NotebookPen },
      { id: 'campaignmanagement', label: 'Quản lý chương trình', icon: AppWindow },
      { id: 'blogmanagement', label: 'Quản lý blog', icon: Newspaper },
    ];

    // Manager specific items
    const managerItems = [
      // { id: 'consultantmanagement', label: 'Quản lý chuyên viên', icon: IdCardLanyard },
      { id: 'surveymanagement', label: 'Quản lý bài đánh giá', icon: ClipboardPenLine },
      { id: 'coursemanagement', label: 'Quản lý khóa học', icon: NotebookPen },
      { id: 'campaignmanagement', label: 'Quản lý chương trình', icon: AppWindow },
    ];

    // Consultant specific items
    const consultantItems = [
      { id: 'blogmanagement', label: 'Quản lý blog', icon: Newspaper },
    ];

    // Return menu items based on user role
    if (user?.roleName === 'Admin') {
      return [...commonItems, ...adminItems];
    }
    if (user?.roleName === 'Manager') {
      return [...commonItems, ...managerItems];
    }
    if (user?.roleName === 'Consultant') {
      return [...commonItems, ...consultantItems];
    }
    if (user?.roleName === 'Member') {
      return [...commonItems, ...memberItems];
    }
    // For other roles, only show common items
    return commonItems;
  };

  const menuItems = getMenuItemsByRole();

  const bottomItems = [
    // Chỉ hiển thị 'Hồ sơ' nếu không phải Admin
    ...(user?.roleName !== 'Admin' ? [{ id: 'profile', label: 'Hồ sơ', icon: User }] : []),
    // { id: 'settings', label: 'Cài đặt', icon: Settings },
    // { id: 'logout', label: 'Đăng xuất', icon: LogOut }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">

      <div className="p-6 border-b border-gray-200">
        <Link to="/home" className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Drug Prevention</Link>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let to = '#';
            switch (item.id) {
              case 'overview': to = '/dashboard'; break;

              case 'myassessment': to = '/myassessment'; break;
              case 'mycourse': to = '/mycourse'; break;
              // case 'myappointment': to = '/myappointment'; break;
              case 'mycampaign': to = '/mycampaign'; break;
              
              case 'usermanagement': to = '/usermanagement'; break;
              case 'consultantmanagement': to = '/consultantmanagement'; break;
              case 'surveymanagement': to = '/surveymanagement'; break;
              case 'coursemanagement': to = '/coursemanagement'; break;
              case 'campaignmanagement': to = '/campaignmanagement'; break;
              case 'blogmanagement': to = '/blogmanagement'; break;
              
              default: to = '#';
            }
            return (
              <li key={item.id}>
                <Link
                  to={to}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeMenuItem === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="px-4 py-6 border-t border-gray-200">
        <ul className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            let to = '#';
            switch (item.id) {
              case 'profile': to = '/profile'; break;
              // case 'settings': to = '/settings'; break;
              // case 'logout': to = '/logout'; break;
              default: to = '#';
            }
            return (
              <li key={item.id}>
                <Link
                  to={to}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeMenuItem === item.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;