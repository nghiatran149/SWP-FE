import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play, Download, FileText, FileImage, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';

const TABS = [
    { id: 'content', label: 'Nội dung' },
    { id: 'exercise', label: 'Bài tập' },
    { id: 'material', label: 'Tài liệu' },
];

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const LessonDetail = () => {
    const query = useQuery();
    const lessonId = query.get('lessonId');
    const courseId = query.get('courseId');
    const { user } = useAuth();
    const userId = user?.userId;

    const [activeTab, setActiveTab] = useState('content');
    const [note, setNote] = useState('');
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lessonId || !userId) return;
        setLoading(true);
        setError(null);
        api.get(`/Lesson/${lessonId}/details?userId=${userId}`)
            .then(res => {
                if (res.data && res.data.data) {
                    setLesson(res.data.data);
                } else {
                    setError('Không tìm thấy thông tin bài học.');
                }
            })
            .catch(() => setError('Lỗi khi tải chi tiết bài học.'))
            .finally(() => setLoading(false));
    }, [lessonId, userId]);

    if (loading) return <div className="text-center py-12 text-gray-500">Đang tải chi tiết bài học...</div>;
    if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
    if (!lesson) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Link to="/mycourse" className="hover:underline">Khóa học</Link>
                    <span>/</span>
                    {lesson.courseTitle && lesson.courseId ? (
                        <Link to={`/mycoursedetail?courseId=${lesson.courseId}`} className="hover:underline">{lesson.courseTitle}</Link>
                    ) : (
                        <span>{lesson.courseTitle || '...'}</span>
                    )}
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">{lesson.title}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                        <p className="text-gray-600 mt-1">{lesson.description}</p>
                    </div>
                    <Link to={`/mycoursedetail?courseId=${lesson.courseId || courseId}`} className="flex min-w-max ml-10 items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại chi tiết khóa học</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-[1500px] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl mb-4 flex flex-col justify-between min-h-[350px] relative shadow">
                        <div className="flex-1 flex items-center justify-center relative">
                            {lesson.videoUrl ? (
                                <video controls className="w-full h-full max-h-[500px] rounded-t-xl">
                                    <source src={lesson.videoUrl} type="video/mp4" />
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>
                            ) : (
                                <button className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg text-lg absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg">
                                    <Play className="w-5 h-5" />
                                    <span>Xem video bài giảng</span>
                                </button>
                            )}
                        </div>
                        <div className="px-6 py-6">
                            <h2 className="text-2xl font-bold mb-1">{lesson.title}</h2>
                            <p className="text-gray-600 text-base">{lesson.description}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl mb-4 shadow-sm">
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'content'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Nội dung
                                </button>
                                <button
                                    onClick={() => setActiveTab('exercise')}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'exercise'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Bài tập
                                </button>
                                <button
                                    onClick={() => setActiveTab('material')}
                                    className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === 'material'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Tài liệu
                                </button>
                            </nav>
                        </div>
                        <div className="p-6">
                            {activeTab === 'content' && (
                                <div className="prose max-w-none text-gray-800 whitespace-pre-line">
                                    <h3 className="text-lg font-semibold mb-4">Nội dung bài học</h3>
                                    {/* lesson.content hoặc nội dung khác nếu có */}
                                    <p>Chưa có nội dung chi tiết cho bài học này.</p>
                                </div>
                            )}
                            {activeTab === 'exercise' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Bài tập kiểm tra</h3>
                                    <p className="text-gray-600 mb-6">Hãy hoàn thành bài tập sau để kiểm tra kiến thức của bạn</p>
                                    {/* Hiện tại chưa có bài tập từ API, có thể mock nếu cần */}
                                    <p>Chưa có bài tập cho bài học này.</p>
                                </div>
                            )}
                            {activeTab === 'material' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Tài liệu học tập</h3>
                                    <p className="text-gray-600 mb-6">Các tài liệu bổ sung cho bài học này</p>
                                    {/* Hiện tại chưa có tài liệu từ API, có thể mock nếu cần */}
                                    <p>Chưa có tài liệu cho bài học này.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút chuyển bài */}
                    <div className="flex justify-between mt-4 gap-4">
                        <button className="bg-white border border-gray-300 px-6 py-3 rounded-lg text-gray-700 font-medium flex items-center gap-2 hover:bg-gray-100 shadow-sm">
                            <ArrowLeft className="w-5 h-5" />
                            Bài trước: Hậu quả xã hội của việc sử dụng ma túy
                        </button>
                        <button className="bg-black text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 shadow-sm">
                            Bài tiếp theo: Kỹ năng từ chối và đối phó với áp lực
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="text-xl font-bold mb-2">Tiến độ khóa học</h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-base font-medium text-gray-700">Hoàn thành: {lesson.courseProgressPercentage ?? 0}%</span>
                            {/* <span className="text-base text-gray-600">--/-- bài học</span> */}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${lesson.courseProgressPercentage ?? 0}%` }}></div>
                        </div>
                        <Link
                            to={`/mycoursedetail?courseId=${lesson.courseId || courseId}`}
                            className="w-full inline-block text-center bg-white border border-gray-300 text-black py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                            Xem tổng quan khóa học
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl p-6 mt-6 shadow">
                        <h3 className="text-xl font-bold mb-4">Đánh dấu tiến độ</h3>
                        <button className="w-full  bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                            <CheckCircle className="w-5 h-5" />
                            Đánh dấu đã hoàn thành
                        </button>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="text-xl font-bold mb-4">Mục tiêu bài học</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-base">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                                <span>Chưa có mục tiêu cho bài học này.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="text-xl font-bold mb-4">Ghi chú</h3>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] mb-4"
                            placeholder="Ghi chú của bạn về bài học này..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                        <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">Lưu ghi chú</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;
