import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import {
  Play,
  Clock,
  Users,
  Star,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  FileImage,
  MessageCircle,
  HelpCircle,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Award,
} from 'lucide-react';

// const modules = [
//   {
//     id: 1,
//     title: "Giới thiệu về ma túy và các chất gây nghiện",
//     lessons: [
//       { title: "Định nghĩa và phân loại ma túy", duration: "45 phút", completed: true },
//       { title: "Lịch sử sử dụng ma túy trong xã hội", duration: "30 phút", completed: true },
//       { title: "Tình hình sử dụng ma túy hiện nay", duration: "40 phút", completed: true }
//     ]
//   },
//   {
//     id: 2,
//     title: "Tác động của ma túy đối với cơ thể",
//     lessons: [
//       { title: "Tác động đến hệ thần kinh trung ương", duration: "50 phút", completed: true },
//       { title: "Tác động đến các cơ quan nội tạng", duration: "45 phút", completed: true },
//       { title: "Tác động dài hạn và ngắn hạn", duration: "40 phút", completed: true }
//     ]
//   },
//   {
//     id: 3,
//     title: "Tác động tâm lý và xã hội",
//     lessons: [
//       { title: "Ảnh hưởng đến sức khỏe tâm thần", duration: "55 phút", completed: true },
//       { title: "Tác động đến môi quan hệ gia đình", duration: "50 phút", completed: true },
//       { title: "Hậu quả xã hội của việc sử dụng ma túy", duration: "45 phút", completed: true }
//     ]
//   },
//   {
//     id: 4,
//     title: "Phòng ngừa và can thiệp",
//     lessons: [
//       { title: "Chiến lược phòng ngừa hiệu quả", duration: "60 phút", completed: false },
//       { title: "Kỹ năng từ chối và đối phó với áp lực", duration: "50 phút", completed: false },
//       { title: "Nguồn lực hỗ trợ và can thiệp", duration: "45 phút", completed: false }
//     ]
//   }
// ];

const materials = [
  { title: "Sổ tay phòng chống ma túy", type: "PDF", size: "2.4 MB" },
  { title: "Infographic về tác hại của ma túy", type: "PNG", size: "1.8 MB" },
  { title: "Danh sách đường dây nóng hỗ trợ", type: "PDF", size: "0.5 MB" }
];

const objectives = [
  "Hiểu biết về các loại ma túy phổ biến và tác động của chúng",
  "Nhận biết các dấu hiệu sử dụng ma túy",
  "Hiểu rõ hậu quả sức khỏe và xã hội của việc sử dụng ma túy",
  "Nắm vững các chiến lược phòng ngừa hiệu quả"
];

const MyCourseDetail = () => {
  const location = useLocation();
  const { user, isAuthLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [weeks, setWeeks] = useState([]);
  const [weeksLoading, setWeeksLoading] = useState(false);
  const [weeksError, setWeeksError] = useState(null);
  const navigate = useNavigate();

  // Lấy courseId từ query param
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get('courseId');

  useEffect(() => {
    if (isAuthLoading) return; // Đợi load xong mới fetch
    if (!user || !courseId) {
      setError('Không tìm thấy thông tin khóa học hoặc người dùng.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchCourseDetail = async () => {
      try {
        const res = await api.get(`/Course/${courseId}/detail-for-user?userId=${user.userId}`);
        if (res.data && res.data.data) {
          setCourse(res.data.data);
        } else {
          setError('Không tìm thấy thông tin khóa học.');
        }
      } catch (err) {
        setError('Lỗi khi tải chi tiết khóa học.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [user, courseId, isAuthLoading]);

  // Fetch weeks/lessons khi vào tab content hoặc khi user/courseId đổi
  useEffect(() => {
    if (activeTab !== 'content') return;
    if (!user || !courseId) return;
    setWeeksLoading(true);
    setWeeksError(null);
    setWeeks([]);
    api.get(`/Course/${courseId}/lesson-progress-details?userId=${user.userId}`)
      .then(res => {
        if (res.data && res.data.data && Array.isArray(res.data.data.courseWeeks)) {
          setWeeks(res.data.data.courseWeeks);
        } else {
          setWeeks([]);
        }
      })
      .catch(() => setWeeksError('Không thể tải nội dung khóa học.'))
      .finally(() => setWeeksLoading(false));
  }, [activeTab, user, courseId]);

  // Flatten all lessons from all weeks
  const allLessons = weeks.flatMap(week => week.lessons || []);
  const upcomingLessons = allLessons.filter(lesson => !lesson.isCompleted).slice(0, 3);
  const firstUncompletedLesson = allLessons.find(lesson => !lesson.isCompleted);
  const firstLesson = allLessons[0];

  if (isAuthLoading || loading) return <div className="text-center py-12 text-gray-500">Đang tải chi tiết khóa học...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <Link to="/mycourse" className="hover:underline">Khóa học</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{course.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-1">{course.description}</p>
          </div>
          <Link to="/mycourse" className="flex min-w-max ml-10 items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại khóa học</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex-1">
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="rounded-lg w-full mb-4 object-cover"
                    style={{ height: 360 }}
                  />
                )}
                <div className="flex items-center mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 mr-3">
                    {course.title}
                  </h1>
                </div>
                <p className="text-gray-600 mb-4">
                  {course.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.durationWeeks} tuần</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Giảng viên: {course.instructorName}</span>
                  </div>
                  {/* <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>Chưa có đánh giá</span>
                  </div> */}
                </div>
                {/* Progress Bar */}
                <div className="mb-4">
                  {course.courseProgressPercentage === 100 ? (
                    <div className="text-center mb-2">
                      <p className="text-sm font-semibold text-green-600">Đã hoàn thành khóa học!</p>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tiến độ: {course.courseProgressPercentage}%</span>
                      <span className="text-sm text-gray-600">{course.completedLessonsByUser}/{course.totalLessonsInCourse} bài học</span>
                    </div>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        course.courseProgressPercentage === 100 ? 'bg-green-500' : 'bg-yellow-400'
                      }`}
                      style={{ width: `${course.courseProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-700 disabled:cursor-not-allowed"
                    disabled={course.courseProgressPercentage === 100}
                    onClick={() => {
                      if (firstUncompletedLesson) {
                        navigate(`/lessondetail?lessonId=${firstUncompletedLesson.lessonId}&courseId=${courseId}`);
                      } else if (firstLesson) {
                        navigate(`/lessondetail?lessonId=${firstLesson.lessonId}&courseId=${courseId}`);
                      }
                    }}
                  >
                    {course.courseProgressPercentage === 100 ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Bạn đã hoàn thành khóa học này</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Tiếp tục học</span>
                      </>
                    )}
                  </button>
                  {course.courseProgressPercentage === 100 ? (
                    <Link
                      to={`/certificate?courseId=${courseId}`}
                      className="flex items-center gap-2 border border-green-600 text-green-600 px-10 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      <span>Xem chứng chỉ</span>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-2 border border-gray-300 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      <Award className="w-4 h-4" />
                      <span className="text-sm text-center">Bạn chưa hoàn thành khóa học này</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'content'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Nội dung khóa học
                  </button>
                  <button
                    onClick={() => setActiveTab('materials')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'materials'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Tài liệu
                  </button>
                  <button
                    onClick={() => setActiveTab('objectives')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'objectives'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Mục tiêu
                  </button>
                </nav>
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
                                  className="flex items-center gap-4 py-3 px-2 hover:bg-gray-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <CheckCircle className={`w-5 h-5 ${lesson.isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                                    <span className="text-gray-900 truncate">{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-gray-500 w-20 text-left block">{lesson.durationMinutes} phút</span>
                                  {lesson.isCompleted ? (
                                    <Link
                                      to={`/lessondetail?lessonId=${lesson.lessonId}&courseId=${courseId}`}
                                      className="text-blue-600 hover:text-blue-800 text-sm w-20 text-left"
                                    >
                                      Xem lại
                                    </Link>
                                  ) : (
                                    <Link
                                      to={`/lessondetail?lessonId=${lesson.lessonId}&courseId=${courseId}`}
                                      className="text-green-600 hover:text-green-800 text-sm w-20 text-left"
                                    >
                                      Học ngay
                                    </Link>
                                  )}
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

                {activeTab === 'materials' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Tài liệu học tập</h3>
                    <p className="text-gray-600 mb-6">Các tài liệu bổ sung cho khóa học này</p>
                    <div className="space-y-4">
                      {materials.map((material, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            {material.type === 'PDF' ? (
                              <FileText className="w-6 h-6 text-red-500" />
                            ) : (
                              <FileImage className="w-6 h-6 text-blue-500" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{material.title}</div>
                              <div className="text-sm text-gray-500">{material.type} • {material.size}</div>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                            <Download className="w-4 h-4" />
                            <span>Tải xuống</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'objectives' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Mục tiêu khóa học</h3>
                    <p className="text-gray-600 mb-6">Sau khi hoàn thành khóa học này, bạn sẽ:</p>
                    <div className="space-y-3">
                      {objectives.map((objective, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Giảng viên</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">{course.instructorName?.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{course.instructorName}</div>
                  <div className="text-sm text-gray-600">Chuyên gia phòng chống ma túy</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Không có mô tả giảng viên.</p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Các bài học sắp tới</h3>
              <div className="space-y-4">
                {upcomingLessons.length === 0 ? (
                  <div className="text-gray-500 px-2 py-2">Bạn đã hoàn thành tất cả các bài học!</div>
                ) : (
                  upcomingLessons.map((lesson, idx) => (
                    <div key={lesson.lessonId || idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{lesson.title}</div>
                        {/* Có thể hiển thị thêm thông tin tuần hoặc thời lượng nếu muốn */}
                        {lesson.durationMinutes && (
                          <div className="text-xs text-gray-500 mt-1">Thời lượng: {lesson.durationMinutes} phút</div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">Chưa học</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
              <div className="space-y-3">
                <button className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Liên hệ giảng viên</span>
                </button>
                <button className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Hỏi đáp</span>
                </button>
                <button className="flex items-center gap-3 w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-700">Báo cáo vấn đề</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourseDetail;