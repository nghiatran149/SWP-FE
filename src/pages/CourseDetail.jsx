import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { Users, Clock, CheckCircle, BookOpen, BookmarkPlus, ArrowRight, SquareCheckBig } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TABS = [
  { id: 'content', label: 'Nội dung khóa học' },
  { id: 'requirements', label: 'Yêu cầu' },
  { id: 'instructor', label: 'Giảng viên' },
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentCheckLoading, setEnrollmentCheckLoading] = useState(true);

  // State cho nội dung tuần/bài học
  const [weeks, setWeeks] = useState([]);
  const [weeksLoading, setWeeksLoading] = useState(false);
  const [weeksError, setWeeksError] = useState(null);

  // State cho requirements
  const [requirements, setRequirements] = useState([]);
  const [requirementsLoading, setRequirementsLoading] = useState(false);
  const [requirementsError, setRequirementsError] = useState(null);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user) {
        setEnrollmentCheckLoading(false);
        return;
      }
      setEnrollmentCheckLoading(true);
      try {
        const response = await api.get(`/UserCourseEnrollment/${courseId}/enrollment-status?userId=${user.userId}`);
        if (response.data && response.data.data) {
          setIsEnrolled(!!response.data.data.isEnrolled);
        } else {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error('Failed to check enrollment status', err);
        setIsEnrolled(false);
      } finally {
        setEnrollmentCheckLoading(false);
      }
    };

    checkEnrollment();
  }, [user, courseId]);

  const handleEnroll = async () => {
    if (!user) {
      alert('Bạn cần đăng nhập để đăng ký khóa học.');
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await api.post('/UserCourseEnrollment', {
        userId: user.userId,
        courseId: courseId,
      });

      if (response.data && response.data.resultStatus === 'Success') {
        alert('Đăng ký khóa học thành công!');
        setIsEnrolled(true);
        // Optionally, disable the button or change its text
      } else {
        throw new Error(response.data.messages?.join(', ') || 'Đăng ký thất bại.');
      }
    } catch (err) {
      console.error('Enrollment error:', err);
      const errorMessage =
        err.response?.data?.messages?.join(', ') || err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      alert(`Đăng ký không thành công: ${errorMessage}`);
    } finally {
      setIsEnrolling(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/Course/${courseId}`);
        if (res.data && res.data.data) {
          const data = res.data.data;
          setCourse({
            ...data,
            requirements: data.requirements ? data.requirements.split(';').map(r => r.trim()).filter(Boolean) : [],
          });
        } else {
          setCourse(null);
        }
      } catch (err) {
        setError('Không thể tải thông tin khóa học.');
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  // Fetch weeks/lessons khi vào tab content hoặc khi courseId đổi
  useEffect(() => {
    if (activeTab !== 'content') return;
    setWeeksLoading(true);
    setWeeksError(null);
    setWeeks([]);
    api.get(`/Course/${courseId}/weeks-with-lessons`)
      .then(res => {
        if (res.data && res.data.data && Array.isArray(res.data.data.courseWeeks)) {
          setWeeks(res.data.data.courseWeeks);
        } else {
          setWeeks([]);
        }
      })
      .catch(() => setWeeksError('Không thể tải nội dung khóa học.'))
      .finally(() => setWeeksLoading(false));
  }, [activeTab, courseId]);

  // Fetch requirements khi vào tab requirements hoặc khi courseId đổi
  useEffect(() => {
    if (activeTab !== 'requirements') return;
    setRequirementsLoading(true);
    setRequirementsError(null);
    setRequirements([]);
    api.get(`/Course/${courseId}/requirements`)
      .then(res => {
        if (res.data && Array.isArray(res.data.data)) {
          setRequirements(res.data.data);
        } else {
          setRequirements([]);
        }
      })
      .catch(() => setRequirementsError('Không thể tải yêu cầu khóa học.'))
      .finally(() => setRequirementsLoading(false));
  }, [activeTab, courseId]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-6">
            {loading ? (
              <div className="text-gray-500 py-8">Đang tải...</div>
            ) : error ? (
              <div className="text-red-500 py-8">{error}</div>
            ) : course ? (
              <>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {course.ageGroup}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                    {course.totalDuration} tuần
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-700 mb-4 max-w-3xl">
                  {course.description}
                </p>
                <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen size={18} />
                    <span>{course.lessonCount} bài học</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={18} />
                    <span>{course.studentCount} học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Giảng viên:</span>
                    <span className="font-medium text-gray-900">{course.instructorName}</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="border-b border-gray-200 flex">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 focus:outline-none transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900 bg-gray-50'
                      : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {weeksLoading ? (
                    <div className="text-gray-500">Đang tải nội dung...</div>
                  ) : weeksError ? (
                    <div className="text-red-500">{weeksError}</div>
                  ) : Array.isArray(weeks) && weeks.length > 0 ? (
                    weeks.map((week, i) => (
                      <div key={week.courseWeekId || i} className="mb-6">
                        <div className="font-semibold text-gray-900 mb-2">{week.title}</div>
                        <div className="divide-y divide-gray-100">
                          {Array.isArray(week.lessons) && week.lessons.length > 0 ? (
                            week.lessons.map((lesson, idx) => (
                              <div
                                key={lesson.lessonId || idx}
                                className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="w-5 h-5 text-gray-500" />
                                  <span className="text-gray-900">{lesson.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">{lesson.durationMinutes} phút</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500 px-2 py-2">Chưa có bài học</div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">Chưa có nội dung khóa học</div>
                  )}
                </div>
              )}
              {activeTab === 'requirements' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Yêu cầu tham gia khóa học</h3>
                  {requirementsLoading ? (
                    <div className="text-gray-500">Đang tải yêu cầu...</div>
                  ) : requirementsError ? (
                    <div className="text-red-500">{requirementsError}</div>
                  ) : requirements.length > 0 ? (
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      {requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500">Chưa có yêu cầu cho khóa học này</div>
                  )}
                </div>
              )}
              {activeTab === 'instructor' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Giảng viên</h3>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                      {course?.instructorName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{course?.instructorName}</div>
                      <div className="text-sm text-gray-600">Chuyên gia phòng chống ma túy</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{course?.instructorName} đã có nhiều năm kinh nghiệm trong lĩnh vực giáo dục phòng chống ma túy cho học sinh, sinh viên.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-30">
            <h3 className="text-lg font-semibold mb-2">Đăng ký khóa học</h3>
            <div className="text-2xl font-bold text-green-600 mb-1">Miễn phí</div>
            <div className="text-gray-600 mb-4 text-sm">Khóa học hoàn toàn miễn phí cho tất cả học sinh</div>
            {enrollmentCheckLoading ? (
              <button
                disabled
                className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium cursor-not-allowed"
              >
                Đang tải...
              </button>
            ) : isEnrolled ? (
              <div className="space-y-3">
                <button
                  disabled
                  className="w-full bg-green-800 text-white py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <SquareCheckBig className="w-5 h-5" />
                  <span>Đã đăng ký</span>
                </button>
                <button
                  onClick={() => navigate(`/mycoursedetail?courseId=${courseId}`)}
                  className="w-full bg-white border-2 border-gray-900 text-gray-900 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <span>Đi đến khóa học</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors mb-3 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {isEnrolling ? 'Đang xử lý...' : 'Đăng ký ngay'}
              </button>
            )}

            {/* <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-4">
              <BookmarkPlus className="w-5 h-5 mr-1" />
              <span> Thêm vào danh sách quan tâm</span>
            </button> */}
            
            {/* <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-2 text-gray-900 text-sm">Khóa học này bao gồm:</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                {Array.isArray(course?.includes) && course.includes.length > 0 ? (
                  course.includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li>Chưa có thông tin</li>
                )}
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
