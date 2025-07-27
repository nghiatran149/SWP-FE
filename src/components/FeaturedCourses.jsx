import React, { useState, useEffect } from 'react';
import { ArrowRight, Book, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top courses data
  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        const response = await api.get('/Course/top-courses?top=3');
        if (response.data.resultStatus === 'Success') {
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching top courses:', error);
        // Keep empty array if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchTopCourses();
  }, []);

  // Helper function to format duration
  const formatDuration = (totalMinutes) => {
    if (totalMinutes < 60) {
      return `${totalMinutes} phút`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (minutes === 0) {
      return `${hours} giờ`;
    }
    return `${hours}h ${minutes}m`;
  };
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
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex gap-4 mb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            courses.map((course, index) => (
              <div key={course.courseId || index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{course.ageGroup}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.totalDuration)}</span>
                    </div> */}
                  </div>

                  {/* Additional Info */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{course.lessonCount} bài học</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.totalDuration} tuần</span>
                    </div>
                    {/* <span>{course.studentCount} học viên</span> */}
                  </div>

                  {/* CTA Button */}
                  <Link 
                    to={`/coursedetail/${course.courseId}`}
                    className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Mobile View All Button */}
        <div className="md:hidden text-center mt-8">
          <Link to="/courses" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 mx-auto">
            Xem tất cả khóa học
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;