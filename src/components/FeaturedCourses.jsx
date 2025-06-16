import React from 'react';
import { ArrowRight, Book, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const courses = [
  {
    image: "/api/placeholder/400/300",
    title: "Nhận thức về ma túy cho học sinh",
    description: "Khóa học giúp học sinh hiểu về tác hại của ma túy và cách phòng tránh",
    category: "Học sinh",
    duration: "4 tuần",
    participants: "1.2k"
  },
  {
    image: "/api/placeholder/400/300",
    title: "Kỹ năng từ chối cho thanh thiếu niên",
    description: "Phát triển kỹ năng từ chối và đối phó với áp lực từ bạn bè",
    category: "Thanh thiếu niên",
    duration: "3 tuần",
    participants: "890"
  },
  {
    image: "/api/placeholder/400/300",
    title: "Hướng dẫn cho phụ huynh",
    description: "Giúp phụ huynh nhận biết dấu hiệu và cách trò chuyện với con về ma túy",
    category: "Phụ huynh",
    duration: "2 tuần",
    participants: "650"
  }
];

const FeaturedCourses = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khóa học nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Các khóa học được thiết kế phù hợp với từng đối tượng
            </p>
          </div>
          <Link to="/courses" className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
            Xem tất cả khóa học
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-blue-100 to-teal-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <Book className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {course.description}
                </p>

                {/* Course Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{course.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2">
                  Xem chi tiết
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden text-center mt-8">
          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 mx-auto">
            Xem tất cả khóa học
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;