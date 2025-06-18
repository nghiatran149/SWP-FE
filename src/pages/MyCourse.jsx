import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, User, Clock, Award } from 'lucide-react';

const MyCourse = () => {
  const [activeTab, setActiveTab] = useState('learning');
  const [searchTerm, setSearchTerm] = useState('');

  const courses = {
    learning: [
      {
        id: 1,
        title: "Hiểu biết về tác hại của ma túy",
        description: "Khóa học cung cấp kiến thức cơ bản về các loại ma túy và tác hại của chúng đối với sức khỏe và xã hội.",
        instructor: "TS. Nguyễn Văn A",
        duration: "8 tuần",
        progress: 75,
        totalLessons: 12,
        completedLessons: 9,
        lastAccessed: "2 ngày trước",
        level: "Cơ bản",
        image: "/api/placeholder/300/200"
      },
      {
        id: 2,
        title: "Kỹ năng từ chối ma túy",
        description: "Khóa học trang bị các kỹ năng thực tế để từ chối ma túy trong các tình huống áp lực từ bạn bè và xã hội.",
        instructor: "ThS. Trần Thị B",
        duration: "6 tuần",
        progress: 30,
        totalLessons: 10,
        completedLessons: 3,
        lastAccessed: "Hôm qua",
        level: "Trung cấp",
        image: "/api/placeholder/300/200"
      }
    ],
    completed: [
      {
        id: 3,
        title: "Nhận biết dấu hiệu sử dụng ma túy",
        description: "Khóa học giúp phụ huynh và giáo viên nhận biết các dấu hiệu sử dụng ma túy ở thanh thiếu niên.",
        instructor: "PGS.TS. Lê Văn C",
        duration: "4 tuần",
        progress: 100,
        totalLessons: 8,
        completedLessons: 8,
        completedDate: "15/04/2023",
        level: "Cơ bản",
        image: "/api/placeholder/300/200",
        certificate: true
      }
    ],
    published: [
      {
        id: 4,
        title: "Phục hồi sau cai nghiện",
        description: "Khóa học hỗ trợ quá trình phục hồi sau cai nghiện, tái hòa nhập cộng đồng và phòng ngừa tái nghiện.",
        instructor: "TS. Phạm Thị D",
        duration: "12 tuần",
        progress: 0,
        totalLessons: 15,
        completedLessons: 0,
        level: "Nâng cao",
        image: "/api/placeholder/300/200",
        status: "Đang ký"
      },
      {
        id: 5,
        title: "Hỗ trợ tâm lý cho người thân",
        description: "Khóa học cung cấp kiến thức và kỹ năng hỗ trợ tâm lý cho người thân của người sử dụng ma túy.",
        instructor: "ThS. Hoàng Văn E",
        duration: "6 tuần",
        progress: 0,
        totalLessons: 12,
        completedLessons: 0,
        level: "Trung cấp",
        image: "/api/placeholder/300/200",
        status: "Đang ký"
      }
    ]
  };

  const tabs = [
    { id: 'learning', label: 'Đang học', count: 2 },
    { id: 'completed', label: 'Đã hoàn thành', count: 1 },
    { id: 'published', label: 'Đề xuất', count: 2 }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Cơ bản': return 'bg-green-100 text-green-800';
      case 'Trung cấp': return 'bg-yellow-100 text-yellow-800';
      case 'Nâng cao': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusButton = (course, tab) => {
    if (tab === 'learning') {
      return (
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
          Tiếp tục học
        </button>
      );
    } else if (tab === 'completed') {
      return (
        <Link to="/certificate" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
          Xem chứng chỉ
        </Link>
      );
    } else {
      return (
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm">
          Đăng ký
        </button>
      );
    }
  };

  const filteredCourses = courses[activeTab].filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors">
              Lọc
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
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
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Course Image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Progress Bar (for learning courses) */}
                {activeTab === 'learning' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Tiến độ: {course.progress}%</span>
                      <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Course Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Giảng viên: {course.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Thời lượng: {course.duration}</span>
                  </div>
                  {course.lastAccessed && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Truy cập gần nhất: {course.lastAccessed}</span>
                    </div>
                  )}
                  {course.completedDate && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      <span>Hoàn thành: {course.completedDate}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <Link to="/mycoursedetail" className="text-gray-600 text-sm hover:text-gray-900 transition-colors">
                    Xem chi tiết
                  </Link>
                  {getStatusButton(course, activeTab)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
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
        )}
      </div>
    </div>
  );
};

export default MyCourse;