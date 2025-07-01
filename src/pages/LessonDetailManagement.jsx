import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, FileText, FileImage, FileVideo } from 'lucide-react';
import api from '../api/api';

const LessonDetailManagement = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('content');
    const [quiz, setQuiz] = useState(null);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            setError(null);
            try {
                const userInfoString = localStorage.getItem('userInfo');
                let token = null;
                if (userInfoString) {
                    const userInfo = JSON.parse(userInfoString);
                    token = userInfo.token;
                }
                const headers = {
                    'Content-Type': 'application/json',
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const res = await api.get(`/Lesson/${lessonId}`, { headers });
                if (res.data && res.data.data) {
                    setLesson(res.data.data);
                } else {
                    setLesson(null);
                    setError('Không tìm thấy thông tin bài học.');
                }
            } catch (err) {
                setError('Không thể tải thông tin bài học.');
            } finally {
                setLoading(false);
            }
        };
        if (lessonId) fetchLesson();
    }, [lessonId]);

    // Fetch quiz when tab is exercise
    useEffect(() => {
        const fetchQuiz = async () => {
            if (activeTab !== 'exercise') return;
            setQuizLoading(true);
            setQuizError(null);
            try {
                const res = await api.get(`/Quiz/lesson/${lessonId}`);
                if (res.data && res.data.data) {
                    setQuiz(res.data.data);
                } else {
                    setQuiz(null);
                    setQuizError('Không tìm thấy bài tập cho bài học này.');
                }
            } catch (err) {
                setQuiz(null);
                setQuizError('Không thể tải bài tập.');
            } finally {
                setQuizLoading(false);
            }
        };
        fetchQuiz();
    }, [activeTab, lessonId]);

    return (
        <>
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Link to="/coursemanagement" className="hover:underline">Quản lý khóa học</Link>
                    <span>/</span>
                    <Link to={-1} className="hover:underline">Chi tiết khóa học</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">
                        {loading ? 'Đang tải...' : lesson ? lesson.title : 'Không tìm thấy bài học'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex-1 pr-4">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-4 flex-wrap">
                            {loading ? 'Đang tải...' : lesson ? lesson.title : 'Không tìm thấy bài học'}
                            {!loading && lesson && (
                                <>
                                    <span className="flex items-center gap-1 text-base font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        <Clock className="w-4 h-4" />
                                        {lesson.durationMinutes} phút
                                    </span>
                                </>
                            )}
                        </h1>
                        <p className="text-gray-600 mt-1 max-w-5xl">
                            {/* Nội dung chi tiết bài học sẽ hiển thị ở đây */}
                        </p>
                    </div>
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại</span>
                    </button>
                </div>
            </div>
            <div className="px-8 pb-8 mt-4">
                {/* Tab bar */}
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'content' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Nội dung
                    </button>
                    <button
                        onClick={() => setActiveTab('resources')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'resources' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Tài liệu
                    </button>
                    <button
                        onClick={() => setActiveTab('exercise')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'exercise' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Bài tập
                    </button>
                </div>
                {/* Tab content */}
                {loading && <div className="text-gray-500">Đang tải thông tin bài học...</div>}
                {error && <div className="text-red-500">{error}</div>}
                {!loading && !error && lesson && (
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-xl border border-gray-300 shadow-lg p-6">
                            {activeTab === 'content' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Nội dung bài học</h3>
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content || '<i>Không có nội dung</i>' }} />
                                </div>
                            )}
                            {activeTab === 'resources' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold mb-4">Tài liệu học tập</h3>
                                    {lesson.resources && lesson.resources.length > 0 ? lesson.resources.map(resource => {
                                        let icon = null;
                                        if (resource.resourceType === 'pdf') {
                                            icon = <FileText className="w-6 h-6 text-red-500" />;
                                        } else if (resource.resourceType === 'video') {
                                            icon = <FileVideo className="w-6 h-6 text-blue-500" />;
                                        } else if (resource.resourceType === 'png' || resource.resourceType === 'jpg' || resource.resourceType === 'jpeg' || resource.resourceType === 'image') {
                                            icon = <FileImage className="w-6 h-6 text-blue-500" />;
                                        }
                                        return (
                                            <div key={resource.resourceId} className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg">
                                                {icon}
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{resource.description || 'Tài liệu'}</div>
                                                    <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                                        Xem tài liệu
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="text-gray-500">Không có tài liệu</div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'exercise' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Bài tập</h3>
                                    {quizLoading && <div className="text-gray-500">Đang tải bài tập...</div>}
                                    {quizError && <div className="text-red-500">{quizError}</div>}
                                    {!quizLoading && !quizError && quiz && (
                                        <div>
                                            <div className="mb-2 font-bold text-blue-700 text-lg">{quiz.title}</div>
                                            <div className="mb-2 text-gray-700">{quiz.description}</div>
                                            <div className="mb-2 text-sm text-gray-500">Điểm đạt: {quiz.passingScore}</div>
                                            <div className="space-y-6 mt-6">
                                                {quiz.questions && quiz.questions.length > 0 ? quiz.questions.map((q, idx) => (
                                                    <div key={q.questionId} className="mb-4">
                                                        <div className="font-medium mb-2">Câu {idx + 1}: {q.questionText}</div>
                                                        <div className="space-y-2 ml-4">
                                                            {q.options.map(opt => (
                                                                <div key={opt.optionId} className={`px-4 py-2 rounded border ${opt.isCorrect ? 'bg-green-50 border-green-400 text-green-700 font-semibold' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                                                                    {opt.optionText}
                                                                    {opt.isCorrect && <span className="ml-2 text-green-600 font-bold">(Đáp án đúng)</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )) : <div className="text-gray-500">Không có câu hỏi nào.</div>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default LessonDetailManagement;
