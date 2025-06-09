import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseDetail = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [progress] = useState(75);

  const courseData = {
    title: "Hiểu biết về tác hại của ma túy",
    description: "Khóa học cung cấp kiến thức cơ bản về các loại ma túy và tác hại của chúng đối với sức khỏe và xã hội.",
    image: "https://tumorong.huyentumorong.kontum.gov.vn/upload/104974/fck/bientaptumorong/2024_06_24_02_00_551.jpg",
    instructor: {
      name: "TS. Nguyễn Văn A",
      title: "Tiến sĩ Tâm lý học, Đại học Y Hà Nội",
      experience: "Tiến sĩ Tâm lý học, chuyên gia về nghiện chất và phòng chống ma túy với hơn 15 năm kinh nghiệm."
    },
    stats: {
      duration: "8 tuần",
      students: 1245,
      rating: 4.8,
      lessons: "9/12 bài học"
    },
    dates: {
      registration: "01/03/2023",
      completion: "26/05/2023",
      nextAccess: "2 ngày trước"
    },
    schedule: [
      {
        title: "Chiến lược phòng ngừa hiệu quả",
        date: "Thứ 5, 15/05/2023 - 19:00",
        type: "Nhắc nhở"
      },
      {
        title: "Kỹ năng từ chối và đối phó với áp lực",
        date: "Thứ 7, 18/05/2023 - 10:00",
        type: "Nhắc nhở"
      }
    ]
  };

  const modules = [
    {
      id: 1,
      title: "Giới thiệu về ma túy và các chất gây nghiện",
      lessons: [
        { title: "Định nghĩa và phân loại ma túy", duration: "45 phút", completed: true },
        { title: "Lịch sử sử dụng ma túy trong xã hội", duration: "30 phút", completed: true },
        { title: "Tình hình sử dụng ma túy hiện nay", duration: "40 phút", completed: true }
      ]
    },
    {
      id: 2,
      title: "Tác động của ma túy đối với cơ thể",
      lessons: [
        { title: "Tác động đến hệ thần kinh trung ương", duration: "50 phút", completed: true },
        { title: "Tác động đến các cơ quan nội tạng", duration: "45 phút", completed: true },
        { title: "Tác động dài hạn và ngắn hạn", duration: "40 phút", completed: true }
      ]
    },
    {
      id: 3,
      title: "Tác động tâm lý và xã hội",
      lessons: [
        { title: "Ảnh hưởng đến sức khỏe tâm thần", duration: "55 phút", completed: true },
        { title: "Tác động đến môi quan hệ gia đình", duration: "50 phút", completed: true },
        { title: "Hậu quả xã hội của việc sử dụng ma túy", duration: "45 phút", completed: true }
      ]
    },
    {
      id: 4,
      title: "Phòng ngừa và can thiệp",
      lessons: [
        { title: "Chiến lược phòng ngừa hiệu quả", duration: "60 phút", completed: false },
        { title: "Kỹ năng từ chối và đối phó với áp lực", duration: "50 phút", completed: false },
        { title: "Nguồn lực hỗ trợ và can thiệp", duration: "45 phút", completed: false }
      ]
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <span>Khóa học</span>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{courseData.title}</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{courseData.title}</h1>
            <p className="text-gray-600 mt-1">{courseData.description}</p>
          </div>
          <Link to="/mycourses" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
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
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <img
                    src={courseData.image}
                    alt={courseData.title}
                    className="rounded-lg w-full mb-4 object-cover"
                    style={{ height: 360 }}
                  />
                  {/* <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {courseData.title}
                  </h1> */}
                  <div className="flex items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 mr-3">
                      {courseData.title}
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Cơ bản
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {courseData.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{courseData.stats.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{courseData.stats.students} học viên</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{courseData.stats.rating}/5</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tiến độ: {progress}%</span>
                      <span className="text-sm text-gray-600">{courseData.stats.lessons}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Ngày đăng ký:</span>
                      <div className="font-medium">{courseData.dates.registration}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Dự kiến hoàn thành:</span>
                      <div className="font-medium">{courseData.dates.completion}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Truy cập gần nhất:</span>
                      <div className="font-medium">{courseData.dates.nextAccess}</div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Play className="w-4 h-4" />
                  <span>Tiếp tục học</span>
                </button>
                <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <span>Xem chứng chỉ</span>
                </button>
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
                    {modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-semibold text-gray-900">
                            Module {module.id}: {module.title}
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {module.lessons.map((lesson, index) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                <CheckCircle
                                  className={`w-5 h-5 ${lesson.completed
                                      ? 'text-green-500'
                                      : 'text-gray-300'
                                    }`}
                                />
                                <span className={lesson.completed ? 'text-gray-900' : 'text-gray-600'}>
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-500">{lesson.duration}</span>
                                <button className="text-blue-600 hover:text-blue-800 text-sm">
                                  {lesson.completed ? 'Xem lại' : 'Học ngay'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
                  <span className="text-blue-600 font-semibold text-lg">T</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{courseData.instructor.name}</div>
                  <div className="text-sm text-gray-600">{courseData.instructor.title}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{courseData.instructor.experience}</p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Lịch học sắp tới</h3>
              <div className="space-y-4">
                {courseData.schedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                    </div>
                    <span className="text-xs text-gray-400">{item.type}</span>
                  </div>
                ))}
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

export default CourseDetail;