import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play, Download, FileText, FileImage, CheckCircle, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/api';
import axios from 'axios';

const TABS = [
    { id: 'content', label: 'Nội dung' },
    { id: 'exercise', label: 'Bài tập' },
    { id: 'material', label: 'Tài liệu' },
];

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const MyLessonDetail = () => {
    const query = useQuery();
    const lessonId = query.get('lessonId');
    const courseId = query.get('courseId');
    const { user } = useAuth();
    const userId = user?.userId;
    const navigate = useNavigate();
    const [lessonList, setLessonList] = useState([]);

    const [activeTab, setActiveTab] = useState('content');
    const [note, setNote] = useState('');
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizState, setQuizState] = useState({ loading: false, error: null, data: null });
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [markingComplete, setMarkingComplete] = useState(false);

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

    // Fetch quiz data ngay khi vào trang
    useEffect(() => {
        if (lessonId && userId) {
            setQuizState({ loading: true, error: null, data: null });
            api.get(`/Lesson/${lessonId}/initial-state?userId=${userId}`)
                .then(res => {
                    setQuizState({ loading: false, error: null, data: res.data.data });
                })
                .catch(() => setQuizState({ loading: false, error: 'Lỗi khi tải bài kiểm tra.', data: null }));
        }
    }, [lessonId, userId]);

    useEffect(() => {
        if (courseId && userId) {
            api.get(`/Course/${courseId}/lesson-progress-details?userId=${userId}`)
                .then(res => {
                    // Flatten all lessons from all weeks
                    const weeks = res.data?.data?.courseWeeks || [];
                    const allLessons = weeks.flatMap(w => w.lessons || []);
                    setLessonList(allLessons);
                });
        }
    }, [courseId, userId]);

    const currentIndex = lessonList.findIndex(l => l.lessonId === lessonId);
    const prevLesson = currentIndex > 0 ? lessonList[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex < lessonList.length - 1 ? lessonList[currentIndex + 1] : null;

    // Handle answer selection
    const handleSelectOption = (questionId, optionId) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: optionId }));
    };

    // Handle quiz submit (call API submit)
    const handleSubmitQuiz = async () => {
        if (!quizState.data?.quizAttemptData || !userId) return;
        const quizId = quizState.data.quizAttemptData.quizId;
        const answers = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({ questionId, selectedOptionId }));
        if (answers.length !== quizState.data.quizAttemptData.questions.length) {
            alert('Bạn cần trả lời tất cả các câu hỏi!');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/Lesson/submit', {
                quizId,
                userId,
                answers
            });
            // Sau khi submit, reload lại quizState để hiển thị kết quả
            setQuizState({ loading: true, error: null, data: null });
            api.get(`/Lesson/${lessonId}/initial-state?userId=${userId}`)
                .then(res => {
                    setQuizState({ loading: false, error: null, data: res.data.data });
                })
                .catch(() => setQuizState({ loading: false, error: 'Lỗi khi tải bài kiểm tra.', data: null }));
        } catch (err) {
            alert('Có lỗi khi nộp bài.');
        } finally {
            setSubmitting(false);
        }
    };

    // Đánh dấu hoàn thành bài học
    const handleMarkComplete = async () => {
        if (!userId || !lessonId) return;
        setMarkingComplete(true);
        try {
            await api.post('/Lesson/complete', {
                userId,
                lessonId
            });
            // Gọi lại API lấy chi tiết bài học để cập nhật trạng thái hoàn thành
            const res = await api.get(`/Lesson/${lessonId}/details?userId=${userId}`);
            if (res.data && res.data.data) {
                setLesson(res.data.data);
            }
            // Có thể hiển thị thông báo thành công nếu muốn
            // alert('Đã đánh dấu hoàn thành bài học!');
        } catch (err) {
            alert('Có lỗi khi đánh dấu hoàn thành.');
        } finally {
            setMarkingComplete(false);
        }
    };

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
                        <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                            {lesson.durationMinutes && (
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">⏱ {lesson.durationMinutes} phút</span>
                            )}
                        </div>
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
                                    <h3 className="text-lg text-blue-600 font-bold  mb-4">Nội dung bài học</h3>
                                    {lesson.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                                    ) : (
                                    <p>Chưa có nội dung chi tiết cho bài học này.</p>
                                    )}
                                </div>
                            )}
                            {activeTab === 'exercise' && (
                                <div>
                                    <h3 className="text-lg text-blue-600 font-bold mb-4">Bài tập kiểm tra</h3>
                                    {quizState.loading ? (
                                        <div className="text-gray-500">Đang tải bài kiểm tra...</div>
                                    ) : quizState.error ? (
                                        <div className="text-red-500">{quizState.error}</div>
                                    ) : quizState.data ? (
                                        quizState.data.displayMode === 'AttemptQuiz' && quizState.data.quizAttemptData ? (
                                            <div>
                                                <div className="mb-4">
                                                    <div className="font-semibold text-lg mb-1">{quizState.data.quizAttemptData.title}</div>
                                                    <div className="text-gray-600 mb-2">{quizState.data.quizAttemptData.description}</div>
                                                    <div className="font-semibold text-gray-500">Tổng số câu hỏi: {quizState.data.quizAttemptData.totalQuestions} | Điểm cần để đạt: {quizState.data.quizAttemptData.passingScore}</div>
                                                </div>
                                                <form onSubmit={e => { e.preventDefault(); handleSubmitQuiz(); }}>
                                                    {quizState.data.quizAttemptData.questions.map(q => (
                                                        <div key={q.questionId} className="mb-6">
                                                            <div className="font-medium mb-2">Câu {q.sequence}: {q.questionText}</div>
                                                            <div className="space-y-2">
                                                                {q.options.map(opt => (
                                                                    <label key={opt.optionId} className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${selectedAnswers[q.questionId] === opt.optionId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                                                        <input
                                                                            type="radio"
                                                                            name={`question_${q.questionId}`}
                                                                            value={opt.optionId}
                                                                            checked={selectedAnswers[q.questionId] === opt.optionId}
                                                                            onChange={() => handleSelectOption(q.questionId, opt.optionId)}
                                                                            className="accent-blue-600"
                                                                        />
                                                                        <span>{opt.optionText}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors" disabled={submitting}>
                                                        {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
                                                    </button>
                                                </form>
                                            </div>
                                        ) : quizState.data.displayMode === 'ViewResult' && quizState.data.latestQuizResultData ? (
                                            <div>
                                                <div className="mb-4">
                                                    <div className="font-semibold text-lg mb-1">{quizState.data.latestQuizResultData.quizTitle}</div>
                                                    <div className="text-gray-600 mb-2">Kết quả làm bài ngày: {new Date(quizState.data.latestQuizResultData.takenAt).toLocaleString()}</div>
                                                    <div className="font-semibold text-gray-500">Tổng số câu hỏi: {quizState.data.latestQuizResultData.totalQuestions} | Số câu đúng: {quizState.data.latestQuizResultData.correctCount} | Điểm: {quizState.data.latestQuizResultData.totalScore}</div>
                                                    <div className={`text-xl mt-2 font-bold ${quizState.data.latestQuizResultData.status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>{quizState.data.latestQuizResultData.status === 'passed' ? 'ĐẠT' : 'CHƯA ĐẠT'}</div>
                                                </div>

                                                <div className="space-y-4 mb-10">
                                                    {quizState.data.latestQuizResultData.questionsAttempted.map((q, idx) => (
                                                        <div key={q.questionId} className="p-4 rounded border bg-gray-50">
                                                            <div className="font-medium mb-1">Câu {idx + 1}: {q.questionText}</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${q.isUserAnswerCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{q.isUserAnswerCorrect ? 'Đúng' : 'Sai'}</span>
                                                                <span className="text-gray-700">Trả lời: {q.userSelectedOptionText}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button
                                                    className="mb-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                                    disabled={lesson?.isCompleted}
                                                    onClick={() => {
                                                        setQuizState({ loading: true, error: null, data: null });
                                                        setSelectedAnswers({});
                                                        api.get(`/Lesson/${lessonId}/initial-state?userId=${userId}&forceAttempt=true`)
                                                            .then(res => {
                                                                setQuizState({ loading: false, error: null, data: res.data.data });
                                                            })
                                                            .catch(() => setQuizState({ loading: false, error: 'Lỗi khi tải bài kiểm tra.', data: null }));
                                                    }}
                                                >
                                                    Làm lại bài
                                                </button>
                                            </div>
                                        ) : (
                                            <div>Không có dữ liệu bài kiểm tra.</div>
                                        )
                                    ) : (
                                        <div>Chưa có bài tập cho bài học này.</div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'material' && (
                                <div>
                                    <h3 className="text-lg text-blue-600 font-bold mb-4">Tài liệu học tập</h3>
                                    <p className="text-gray-600 mb-6">Các tài liệu bổ sung cho bài học này</p>
                                    {lesson.resources && lesson.resources.length > 0 ? (
                                        <ul className="space-y-4">
                                            {lesson.resources.map(resource => (
                                                <li key={resource.resourceId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    {resource.resourceType === 'pdf' && <FileText className="w-6 h-6 text-blue-500" />}
                                                    {resource.resourceType === 'image' && <FileImage className="w-6 h-6 text-green-500" />}
                                                    {resource.resourceType === 'video' && <Play className="w-6 h-6 text-red-500" />}
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-800">{resource.description || resource.resourceType}</div>
                                                        <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 text-sm hover:underline flex items-center gap-1 mt-1">
                                                            <Download className="w-4 h-4" />
                                                            <span>Xem & Tải về</span>
                                                        </a>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                    <p>Chưa có tài liệu cho bài học này.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút chuyển bài */}
                    <div className="flex justify-between mt-4 gap-4">
                        <button
                            className="bg-white border border-gray-300 px-6 py-3 rounded-lg text-gray-700 font-medium flex items-center gap-2 hover:bg-gray-100 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={!prevLesson}
                            onClick={() => {
                                if (prevLesson) {
                                    navigate(`/mylessondetail?lessonId=${prevLesson.lessonId}&courseId=${courseId}`);
                                }
                            }}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {prevLesson ? `Bài trước: ${prevLesson.title}` : 'Không có bài trước'}
                        </button>
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={!nextLesson}
                            onClick={() => {
                                if (nextLesson) {
                                    navigate(`/mylessondetail?lessonId=${nextLesson.lessonId}&courseId=${courseId}`);
                                }
                            }}
                        >
                            {nextLesson ? `Bài tiếp theo: ${nextLesson.title}` : 'Không có bài tiếp theo'}
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
                            <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{ width: `${lesson.courseProgressPercentage ?? 0}%` }}></div>
                        </div>
                        <Link
                            to={`/mycoursedetail?courseId=${lesson.courseId || courseId}`}
                            className="w-full inline-block text-center bg-white border border-gray-300 text-black py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                            Xem tổng quan khóa học
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl p-6 mt-6 shadow">
                        <h3 className="text-xl font-bold mb-2">Đánh dấu tiến độ</h3>
                        <p className="text-gray-600 text-base mb-4">Đánh dấu rằng bạn đã hoàn thành bài học này</p>
                        <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            onClick={handleMarkComplete}
                            disabled={
                                markingComplete ||
                                lesson?.isCompleted ||
                                !(
                                    quizState.data &&
                                    quizState.data.latestQuizResultData &&
                                    quizState.data.latestQuizResultData.status === 'passed'
                                )
                            }
                        >
                            <CheckCircle className="w-5 h-5" />
                            {lesson?.isCompleted ? 'Đã hoàn thành bài học này' : 'Đánh dấu đã hoàn thành'}
                        </button>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="text-xl font-bold mb-4">Mục tiêu bài học</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-base">
                                <Target className="w-5 h-5 text-blue-600 mt-1" />
                                <span>Chưa có mục tiêu cho bài học này.</span>
                            </li>
                        </ul>
                    </div>

                    {/* <div className="bg-white rounded-xl p-6 shadow">
                        <h3 className="text-xl font-bold mb-4">Ghi chú</h3>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px] mb-4"
                            placeholder="Ghi chú của bạn về bài học này..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                        <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">Lưu ghi chú</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default MyLessonDetail;
