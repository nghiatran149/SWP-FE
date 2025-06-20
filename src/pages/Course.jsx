import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Users, Clock, ArrowRight, GraduationCap, Heart, Shield, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const TABS = ['Học sinh', 'Thanh thiếu niên', 'Phụ huynh', 'Giáo viên', 'Khác'];
const ICONS = {
  'Học sinh tiểu học': GraduationCap,
  'Học sinh THPT': Shield,
  'Thanh thiếu niên': Users,
  'Phụ huynh': Heart,
  'Giáo viên tiểu học': GraduationCap,
  'Khác': BookOpen,
};

const getTabByAgeGroup = (ageGroup) => {
  if (!ageGroup) return 'Khác';
  if (ageGroup.includes('Học sinh')) return 'Học sinh';
  if (ageGroup.includes('Thanh thiếu niên')) return 'Thanh thiếu niên';
  if (ageGroup.includes('Phụ huynh')) return 'Phụ huynh';
  if (ageGroup.includes('Giáo viên')) return 'Giáo viên';
  return 'Khác';
};

const Course = () => {
  const [activeTab, setActiveTab] = useState('Học sinh');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/Course');
        if (res.data && res.data.data) {
          setCourses(res.data.data);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError('Không thể tải danh sách khóa học.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const tab = getTabByAgeGroup(course.ageGroup);
    return tab === activeTab;
  });

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
              {TABS.map((tab) => (
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

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => {
                const IconComponent = ICONS[course.ageGroup] || BookOpen;
                return (
                  <div key={course.courseId} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                          <span>{course.ageGroup}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{course.totalDuration} tuần</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {course.description}
                      </p>

                      <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2">
                        <Link to={`/coursedetail/${course.courseId}`} className="flex items-center gap-2 w-full h-full justify-center">
                          Xem chi tiết
                          <ArrowRight size={16} />
                        </Link>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Course;