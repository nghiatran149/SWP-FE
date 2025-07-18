import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  BookOpen, 
  Calendar, 
  FileText,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';

import api from '../api/api';


const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-10 min-h-[220px] flex items-center justify-between shadow-md">
      <div>
        <p className="text-lg font-semibold text-gray-600 mb-2">{title}</p>
        <p className="text-5xl font-extrabold text-gray-900 mb-2">{value}</p>
        <p className="text-base text-gray-500">{subtitle}</p>
      </div>
      <div className={`p-5 rounded-xl ${colorClasses[color]}`}>
        <Icon className="h-10 w-10" />
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
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/AdminAnalytics/summary');
        if (res.data && res.data.data) {
          setSummary(res.data.data);
        } else {
          setError('Không lấy được dữ liệu tổng quan.');
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu tổng quan.');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

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
          {loading ? (
            <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8 max-w-4xl mx-auto">
              <StatsCard
                title="Tổng số người dùng"
                value={summary?.totalUsers ?? '-'}
                subtitle="Tổng số tài khoản đã đăng ký"
                icon={BookOpen}
                color="blue"
              />
              <StatsCard
                title="Tổng lượt ghi danh khóa học"
                value={summary?.totalCourseEnrollments ?? '-'}
                subtitle="Tổng số lượt đăng ký học"
                icon={Calendar}
                color="green"
              />
              <StatsCard
                title="Bài khảo sát đã hoàn thành"
                value={summary?.totalCompletedSurveys ?? '-'}
                subtitle="Tổng số bài khảo sát đã làm"
                icon={FileText}
                color="purple"
              />
              <StatsCard
                title="Lượt tham gia chương trình"
                value={summary?.totalProgramParticipations ?? '-'}
                subtitle="Tổng số lượt tham gia chương trình"
                icon={TrendingUp}
                color="orange"
              />
            </div>
          )}
        </div>
    </>
  );
};

export default Dashboard;