import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, User, Clock, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

const MyCourse = () => {
  const [activeTab, setActiveTab] = useState('learning');
  const [searchTerm, setSearchTerm] = useState('');
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const formatLastAccessed = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(`/Course/my-courses?userId=${user.userId}`);
        if (res.data && Array.isArray(res.data.data)) {
          setMyCourses(res.data.data);
        } else {
          setMyCourses([]);
        }
      } catch (err) {
        setMyCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [user]);

  const tabs = [
    { id: 'learning', label: 'Đang học', count: myCourses.length },
    // Có thể bổ sung các tab khác nếu API trả về trạng thái hoàn thành hoặc đề xuất
  ];

  const filteredCourses = myCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Khóa học của tôi</h1>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi tiến độ các khóa học của bạn về phòng chống ma túy.</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>

      <div className="p-8">
        {/* Search Bar */}
        <div className="mb-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {/* <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors">
              Lọc
            </button> */}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <Link to="/courses" className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ml-4">
            Đăng ký khóa học mới
            <Plus className="h-4 w-4 ml-2" />
          </Link>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải khóa học...</div>
        ) : !user ? (
          <div className="text-center py-12 text-red-500">Vui lòng đăng nhập để xem các khóa học của bạn.</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy khóa học nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc chọn tab khác
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.courseId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Course Image */}
                <div className="relative h-48 bg-gray-200">
                  {course.thumbnailUrl && (
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-5 line-clamp-2">
                    {course.title}
                  </h3>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Tiến độ: {course.progressPercentage}%</span>
                      <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  {/* Course Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span>Giảng viên: {course.instructorName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Thời lượng: {course.durationWeeks} tuần</span>
                    </div>
                    {course.lastAccessed && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Truy cập gần nhất: {formatLastAccessed(course.lastAccessed)}</span>
                      </div>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <Link to={`/mycoursedetail?courseId=${course.courseId}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-md">
                      Xem chi tiết
                    </Link>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-md">
                      Tiếp tục học
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourse;