import React, { useState } from 'react';
import { Users, Clock, ArrowRight, GraduationCap, Heart, Shield, BookOpen } from 'lucide-react';

const Course = () => {
  const [activeTab, setActiveTab] = useState('Học sinh');

  const tabs = ['Học sinh', 'Thanh thiếu niên', 'Phụ huynh', 'Giáo viên'];

  const courses = [
    {
      id: 1,
      title: "Nhận thức về ma túy cho học sinh tiểu học",
      description: "Khóa học giúp học sinh tiểu học hiểu về tác hại của ma túy và cách phòng tránh",
      image: "/api/placeholder/400/250",
      duration: "2 tuần",
      target: "Học sinh tiểu học",
      category: "Học sinh",
      icon: GraduationCap
    },
    {
      id: 2,
      title: "Nhận thức về ma túy cho học sinh THCS",
      description: "Khóa học giúp học sinh THCS hiểu về tác hại của ma túy và cách phòng tránh",
      image: "/api/placeholder/400/250",
      duration: "3 tuần",
      target: "Học sinh THCS",
      category: "Học sinh",
      icon: BookOpen
    },
    {
      id: 3,
      title: "Nhận thức về ma túy cho học sinh THPT",
      description: "Khóa học giúp học sinh THPT hiểu về tác hại của ma túy và cách phòng tránh",
      image: "/api/placeholder/400/250",
      duration: "4 tuần",
      target: "Học sinh THPT",
      category: "Học sinh",
      icon: Shield
    },
    {
      id: 4,
      title: "Nhận thức về ma túy cho thanh thiếu niên",
      description: "Khóa học giúp thanh thiếu niên hiểu về tác hại của ma túy và cách phòng tránh",
      image: "/api/placeholder/400/250",
      duration: "4 tuần",
      target: "Thanh thiếu niên",
      category: "Thanh thiếu niên",
      icon: Users
    },
    {
      id: 5,
      title: "Hướng dẫn phụ huynh phòng ngừa ma túy",
      description: "Khóa học giúp phụ huynh hiểu cách hỗ trợ con em phòng tránh ma túy",
      image: "/api/placeholder/400/250",
      duration: "3 tuần",
      target: "Phụ huynh",
      category: "Phụ huynh",
      icon: Heart
    },
    {
      id: 6,
      title: "Đào tạo giáo viên về phòng ngừa ma túy",
      description: "Khóa học giúp giáo viên có kiến thức và kỹ năng giáo dục phòng ngừa ma túy",
      image: "/api/placeholder/400/250",
      duration: "5 tuần",
      target: "Giáo viên",
      category: "Giáo viên",
      icon: GraduationCap
    }
  ];

  const filteredCourses = courses.filter(course => course.category === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Khóa học phòng ngừa sử dụng ma túy
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp các khóa học trực tuyến về phòng ngừa sử dụng ma túy cho 
            nhiều đối tượng khác nhau.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const IconComponent = course.icon;
            return (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Course Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <IconComponent size={64} className="text-blue-600 opacity-50" />
                  </div>
                  <div className="absolute top-4 left-4 bg-white rounded-full p-2">
                    <IconComponent size={20} className="text-blue-600" />
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{course.target}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {course.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2">
                    Xem chi tiết
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-600">
              Khóa học cho {activeTab} đang được cập nhật. Vui lòng quay lại sau.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;