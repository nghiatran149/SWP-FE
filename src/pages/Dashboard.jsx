import React from 'react';
import { Link } from 'react-router-dom';

import { 
  BookOpen, 
  Calendar, 
  FileText,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';


const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};


const CourseProgress = ({ title, subtitle, buttonText }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Nhận thức về ma túy cho học sinh THPT</span>
            <span className="font-medium">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Bài học tiếp theo: Bài 9: Quản lý stress và cảm xúc</p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Kỹ năng từ chối cho thanh thiếu niên</span>
            <span className="font-medium">40%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Bài học tiếp theo: Bài 5: Đối phó với áp lực từ bạn bè</p>
        </div>
      </div>

      <button className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
        {buttonText}
      </button>
    </div>
  );
};


const AppointmentList = () => {
  const appointments = [
    {
      date: '20/5/2023 - 10:00',
      title: 'TS. Nguyễn Văn A - Trực tuyến',
      status: 'pending',
      action: 'Chi tiết'
    },
    {
      date: '15/4/2023 - 14:00',
      title: 'ThS. Trần Thị B - Trực tiếp',
      status: 'completed',
      action: 'Đã hoàn thành'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lịch hẹn tư vấn</h3>
          <p className="text-sm text-gray-600">Lịch hẹn sắp tới và đã hoàn thành</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
          Đặt lịch mới
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                appointment.status === 'completed' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-orange-50 text-orange-600'
              }`}>
                {appointment.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Clock className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{appointment.date}</p>
                <p className="text-sm text-gray-600">{appointment.title}</p>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
              appointment.status === 'completed'
                ? 'bg-green-50 text-green-600'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}>
              {appointment.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


const Dashboard = () => {
  return (
    <>
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Xem thông tin và quản lý hoạt động của bạn trên hệ thống</p>
            </div>
            <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Khóa học đang học"
              value="2"
              subtitle="Tiến độ trung bình: 58%"
              icon={BookOpen}
              color="blue"
            />
            <StatsCard
              title="Lịch hẹn sắp tới"
              value="1"
              subtitle="Lịch hẹn tiếp theo: 2023-05-20"
              icon={Calendar}
              color="green"
            />
            <StatsCard
              title="Bài đánh giá đã làm"
              value="2"
              subtitle="Đánh giá gần nhất: ASSIST - Nguy cơ thấp"
              icon={FileText}
              color="purple"
            />
            <StatsCard
              title="Chương trình đã tham gia"
              value="3"
              subtitle="Chương trình gần nhất: Ngày hội phòng chống ma túy"
              icon={TrendingUp}
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <CourseProgress
              title="Khóa học của tôi"
              subtitle="Tiến độ học tập và bài học tiếp theo"
              buttonText="Tiếp tục học"
            />

            <AppointmentList />
          </div>
        </div>
    </>
  );
};

export default Dashboard;