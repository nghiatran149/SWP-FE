import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, FileText, FileImage, FileVideo, Plus, Eye, Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
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
    const [quizNotFound, setQuizNotFound] = useState(false);
    const [showAddResource, setShowAddResource] = useState(false);
    const [addResourceForm, setAddResourceForm] = useState({ resourceType: 'pdf', resourceUrl: '', description: '' });
    const [addResourceLoading, setAddResourceLoading] = useState(false);
    const [addResourceError, setAddResourceError] = useState(null);
    const [editResource, setEditResource] = useState(null);
    const [editResourceForm, setEditResourceForm] = useState({ resourceType: 'pdf', resourceUrl: '', description: '' });
    const [editResourceLoading, setEditResourceLoading] = useState(false);
    const [editResourceError, setEditResourceError] = useState(null);
    const [showAddQuiz, setShowAddQuiz] = useState(false);
    const [addQuizForm, setAddQuizForm] = useState({ title: '', description: '', passingScore: 10 });
    const [addQuizLoading, setAddQuizLoading] = useState(false);
    const [addQuizError, setAddQuizError] = useState(null);
    const [showEditQuiz, setShowEditQuiz] = useState(false);
    const [editQuizForm, setEditQuizForm] = useState({ title: '', description: '', passingScore: 10 });
    const [editQuizLoading, setEditQuizLoading] = useState(false);
    const [editQuizError, setEditQuizError] = useState(null);
    const [openQuestionIds, setOpenQuestionIds] = useState([]);
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [addQuestionForm, setAddQuestionForm] = useState({ questionText: '', questionType: 'single_choice', sequence: 1 });
    const [addQuestionLoading, setAddQuestionLoading] = useState(false);
    const [addQuestionError, setAddQuestionError] = useState(null);
    const [showEditQuestion, setShowEditQuestion] = useState(false);
    const [editQuestionForm, setEditQuestionForm] = useState({ questionText: '', questionType: 'single_choice', sequence: 1, questionId: null });
    const [editQuestionLoading, setEditQuestionLoading] = useState(false);
    const [editQuestionError, setEditQuestionError] = useState(null);

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
            setQuizNotFound(false);
            try {
                const res = await api.get(`/Quiz/lesson/${lessonId}`);
                if (res.data && res.data.data) {
                    setQuiz(res.data.data);
                } else if (res.data && res.data.resultStatus === 'NotFound') {
                    setQuiz(null);
                    setQuizNotFound(true);
                } else {
                    setQuiz(null);
                    setQuizError('Không tìm thấy bài tập cho bài học này.');
                }
            } catch (err) {
                setQuiz(null);
                if (err.response && err.response.status === 404) {
                    setQuizNotFound(true);
                } else {
                    setQuizError('Không thể tải bài tập.');
                }
            } finally {
                setQuizLoading(false);
            }
        };
        fetchQuiz();
    }, [activeTab, lessonId]);

    const handleAddResourceChange = (e) => {
        const { name, value } = e.target;
        setAddResourceForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddResourceSubmit = async (e) => {
        e.preventDefault();
        setAddResourceLoading(true);
        setAddResourceError(null);
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
            await api.post('/LessonResource', {
                lessonId: lesson.lessonId,
                resourceType: addResourceForm.resourceType,
                resourceUrl: addResourceForm.resourceUrl,
                description: addResourceForm.description
            }, { headers });
            setShowAddResource(false);
            setAddResourceForm({ resourceType: 'pdf', resourceUrl: '', description: '' });
            // Reload lesson data
            const res = await api.get(`/Lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setLesson(res.data.data);
            }
        } catch (err) {
            setAddResourceError('Không thể thêm tài liệu.');
        } finally {
            setAddResourceLoading(false);
        }
    };

    const handleEditResourceClick = (resource) => {
        setEditResource(resource);
        setEditResourceForm({
            resourceType: resource.resourceType,
            resourceUrl: resource.resourceUrl,
            description: resource.description || ''
        });
    };

    const handleEditResourceChange = (e) => {
        const { name, value } = e.target;
        setEditResourceForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditResourceSubmit = async (e) => {
        e.preventDefault();
        setEditResourceLoading(true);
        setEditResourceError(null);
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
            await api.put(`/LessonResource/${editResource.resourceId}`, {
                lessonId: lesson.lessonId,
                resourceType: editResourceForm.resourceType,
                resourceUrl: editResourceForm.resourceUrl,
                description: editResourceForm.description
            }, { headers });
            setEditResource(null);
            // Reload lesson data
            const res = await api.get(`/Lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setLesson(res.data.data);
            }
        } catch (err) {
            setEditResourceError('Không thể cập nhật tài liệu.');
        } finally {
            setEditResourceLoading(false);
        }
    };

    const handleDeleteResource = async (resource) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
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
            await api.delete(`/LessonResource/${resource.resourceId}`, { headers });
            // Reload lesson data
            const res = await api.get(`/Lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setLesson(res.data.data);
            }
        } catch (err) {
            alert('Không thể xóa tài liệu.');
        }
    };

    const handleAddQuizChange = (e) => {
        const { name, value } = e.target;
        setAddQuizForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddQuizSubmit = async (e) => {
        e.preventDefault();
        setAddQuizLoading(true);
        setAddQuizError(null);
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
            await api.post('/Quiz', {
                lessonId: lesson.lessonId,
                title: addQuizForm.title,
                description: addQuizForm.description,
                passingScore: Number(addQuizForm.passingScore)
            }, { headers });
            setShowAddQuiz(false);
            setAddQuizForm({ title: '', description: '', passingScore: 10 });
            // Reload quiz
            setQuizLoading(true);
            setQuizError(null);
            setQuizNotFound(false);
            const res = await api.get(`/Quiz/lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setQuiz(res.data.data);
            } else if (res.data && res.data.resultStatus === 'NotFound') {
                setQuiz(null);
                setQuizNotFound(true);
            } else {
                setQuiz(null);
                setQuizError('Không tìm thấy bài tập cho bài học này.');
            }
            setQuizLoading(false);
        } catch (err) {
            setAddQuizError('Không thể tạo bài tập.');
            setAddQuizLoading(false);
        }
    };

    const handleEditQuizClick = () => {
        setEditQuizForm({
            title: quiz.title || '',
            description: quiz.description || '',
            passingScore: quiz.passingScore || 10
        });
        setShowEditQuiz(true);
    };

    const handleEditQuizChange = (e) => {
        const { name, value } = e.target;
        setEditQuizForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditQuizSubmit = async (e) => {
        e.preventDefault();
        setEditQuizLoading(true);
        setEditQuizError(null);
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
            await api.put(`/Quiz/${quiz.quizId}`, {
                title: editQuizForm.title,
                description: editQuizForm.description,
                passingScore: Number(editQuizForm.passingScore)
            }, { headers });
            setShowEditQuiz(false);
            // Reload quiz
            setQuizLoading(true);
            setQuizError(null);
            setQuizNotFound(false);
            const res = await api.get(`/Quiz/lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setQuiz(res.data.data);
            } else if (res.data && res.data.resultStatus === 'NotFound') {
                setQuiz(null);
                setQuizNotFound(true);
            } else {
                setQuiz(null);
                setQuizError('Không tìm thấy bài tập cho bài học này.');
            }
            setQuizLoading(false);
        } catch (err) {
            setEditQuizError('Không thể cập nhật bài tập.');
            setEditQuizLoading(false);
        }
    };

    const handleToggleQuestion = (questionId) => {
        setOpenQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleAddQuestionClick = () => {
        // Tìm sequence tiếp theo
        let nextSeq = 1;
        if (quiz && quiz.questions && quiz.questions.length > 0) {
            nextSeq = Math.max(...quiz.questions.map(q => q.sequence || 0)) + 1;
        }
        setAddQuestionForm({ questionText: '', questionType: 'single_choice', sequence: nextSeq });
        setAddQuestionLoading(false);
        setAddQuestionError(null);
        setShowAddQuestion(true);
    };

    const handleAddQuestionChange = (e) => {
        const { name, value } = e.target;
        setAddQuestionForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddQuestionSubmit = async (e) => {
        e.preventDefault();
        setAddQuestionLoading(true);
        setAddQuestionError(null);
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
            await api.post('/QuizQuestion', {
                quizId: quiz.quizId,
                questionText: addQuestionForm.questionText,
                questionType: 'single_choice',
                sequence: Number(addQuestionForm.sequence)
            }, { headers });
            setShowAddQuestion(false);
            setAddQuestionForm({ questionText: '', questionType: 'single_choice', sequence: 1 });
            // Reload quiz
            setQuizLoading(true);
            setQuizError(null);
            setQuizNotFound(false);
            const res = await api.get(`/Quiz/lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setQuiz(res.data.data);
            } else if (res.data && res.data.resultStatus === 'NotFound') {
                setQuiz(null);
                setQuizNotFound(true);
            } else {
                setQuiz(null);
                setQuizError('Không tìm thấy bài tập cho bài học này.');
            }
            setQuizLoading(false);
        } catch (err) {
            setAddQuestionError('Không thể tạo câu hỏi.');
            setAddQuestionLoading(false);
        }
    };

    const handleEditQuestionClick = (question) => {
        setEditQuestionForm({
            questionText: question.questionText || '',
            questionType: 'single_choice',
            sequence: question.sequence || 1,
            questionId: question.questionId
        });
        setShowEditQuestion(true);
    };

    const handleEditQuestionChange = (e) => {
        const { name, value } = e.target;
        setEditQuestionForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditQuestionSubmit = async (e) => {
        e.preventDefault();
        setEditQuestionLoading(true);
        setEditQuestionError(null);
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
            await api.put(`/QuizQuestion/${editQuestionForm.questionId}`, {
                questionText: editQuestionForm.questionText,
                questionType: 'single_choice',
                sequence: Number(editQuestionForm.sequence)
            }, { headers });
            setShowEditQuestion(false);
            // Reload quiz
            setQuizLoading(true);
            setQuizError(null);
            setQuizNotFound(false);
            const res = await api.get(`/Quiz/lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setQuiz(res.data.data);
            } else if (res.data && res.data.resultStatus === 'NotFound') {
                setQuiz(null);
                setQuizNotFound(true);
            } else {
                setQuiz(null);
                setQuizError('Không tìm thấy bài tập cho bài học này.');
            }
            setQuizLoading(false);
        } catch (err) {
            setEditQuestionError('Không thể cập nhật câu hỏi.');
            setEditQuestionLoading(false);
        }
    };

    const handleDeleteQuestion = async (question) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;
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
            await api.delete(`/QuizQuestion/${question.questionId}`, { headers });
            // Reload quiz
            setQuizLoading(true);
            setQuizError(null);
            setQuizNotFound(false);
            const res = await api.get(`/Quiz/lesson/${lesson.lessonId}`, { headers });
            if (res.data && res.data.data) {
                setQuiz(res.data.data);
            } else if (res.data && res.data.resultStatus === 'NotFound') {
                setQuiz(null);
                setQuizNotFound(true);
            } else {
                setQuiz(null);
                setQuizError('Không tìm thấy bài tập cho bài học này.');
            }
            setQuizLoading(false);
        } catch (err) {
            alert('Không thể xóa câu hỏi.');
        }
    };

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
                                    <div className="my-3">
                                        <button className="w-full flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setShowAddResource(true)}>
                                            <Plus className="w-5 h-5" />
                                            <span>Thêm tài liệu</span>
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {lesson.resources && lesson.resources.length > 0 ? lesson.resources.map(resource => {
                                            let icon = null;
                                            if (resource.resourceType === 'pdf') {
                                                icon = <FileText className="w-6 h-6 text-red-500" />;
                                            } else if (resource.resourceType === 'video') {
                                                icon = <FileVideo className="w-6 h-6 text-blue-500" />;
                                            } else if (["png", "jpg", "jpeg", "image"].includes(resource.resourceType)) {
                                                icon = <FileImage className="w-6 h-6 text-blue-500" />;
                                            }
                                            return (
                                                <div key={resource.resourceId} className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg bg-white shadow">
                                                    {icon}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">{resource.description || 'Tài liệu'}</div>
                                                        <a href={resource.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                                            Xem tài liệu
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <button className="p-2 rounded hover:bg-blue-50 text-blue-600" title="Xem tài liệu" onClick={() => window.open(resource.resourceUrl, '_blank')}>
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 rounded hover:bg-amber-50 text-amber-500" title="Sửa tài liệu" onClick={() => handleEditResourceClick(resource)}>
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 rounded hover:bg-red-50 text-red-500" title="Xóa tài liệu" onClick={() => handleDeleteResource(resource)}>
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }) : (
                                            <div className="text-gray-500 px-2 py-2">Không có tài liệu</div>
                                        )}
                                    </div>
                                    {showAddResource && (
                                        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                                            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                                                <h2 className="text-xl font-bold mb-4">Thêm tài liệu mới</h2>
                                                <form className="space-y-4" onSubmit={handleAddResourceSubmit}>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Loại tài liệu</label>
                                                        <select
                                                            name="resourceType"
                                                            value={addResourceForm.resourceType}
                                                            onChange={handleAddResourceChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        >
                                                            <option value="pdf">PDF</option>
                                                            <option value="video">Video</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Đường dẫn tài liệu</label>
                                                        <input
                                                            type="text"
                                                            name="resourceUrl"
                                                            value={addResourceForm.resourceUrl}
                                                            onChange={handleAddResourceChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Nhập URL tài liệu"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Mô tả</label>
                                                        <input
                                                            type="text"
                                                            name="description"
                                                            value={addResourceForm.description}
                                                            onChange={handleAddResourceChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Nhập mô tả tài liệu"
                                                            required
                                                        />
                                                    </div>
                                                    {addResourceError && <div className="text-red-500 text-sm">{addResourceError}</div>}
                                                    <div className="flex justify-end gap-2 mt-6">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                                            onClick={() => setShowAddResource(false)}
                                                            disabled={addResourceLoading}
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                                            disabled={addResourceLoading}
                                                        >
                                                            {addResourceLoading ? 'Đang lưu...' : 'Thêm'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                    {editResource && (
                                        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                                            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                                                <h2 className="text-xl font-bold mb-4">Chỉnh sửa tài liệu</h2>
                                                <form className="space-y-4" onSubmit={handleEditResourceSubmit}>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Loại tài liệu</label>
                                                        <select
                                                            name="resourceType"
                                                            value={editResourceForm.resourceType}
                                                            onChange={handleEditResourceChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        >
                                                            <option value="pdf">PDF</option>
                                                            <option value="video">Video</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Đường dẫn tài liệu</label>
                                                        <input
                                                            type="text"
                                                            name="resourceUrl"
                                                            value={editResourceForm.resourceUrl}
                                                            onChange={handleEditResourceChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Nhập URL tài liệu"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Mô tả</label>
                                                        <input
                                                            type="text"
                                                            name="description"
                                                            value={editResourceForm.description}
                                                            onChange={handleEditResourceChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Nhập mô tả tài liệu"
                                                            required
                                                        />
                                                    </div>
                                                    {editResourceError && <div className="text-red-500 text-sm">{editResourceError}</div>}
                                                    <div className="flex justify-end gap-2 mt-6">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                                            onClick={() => setEditResource(null)}
                                                            disabled={editResourceLoading}
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                                            disabled={editResourceLoading}
                                                        >
                                                            {editResourceLoading ? 'Đang lưu...' : 'Lưu'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'exercise' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Bài tập</h3>
                                    {quizNotFound && !quizLoading && (
                                        <>
                                            <div className="text-gray-600 text-base mb-2">Bài học này hiện chưa có bài tập</div>
                                            <div className="my-3">
                                                <button className="w-full flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setShowAddQuiz(true)}>
                                                    <Plus className="w-5 h-5" />
                                                    <span>Thêm bài tập</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {quizLoading && <div className="text-gray-500">Đang tải bài tập...</div>}
                                    {quizError && <div className="text-red-500">{quizError}</div>}
                                    {!quizLoading && !quizError && quiz && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-bold text-blue-700 text-lg">{quiz.title}</div>
                                                <button className="p-2 rounded hover:bg-yellow-50 text-yellow-600" title="Sửa bài tập" onClick={handleEditQuizClick}>
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="mb-2 text-gray-700">{quiz.description}</div>
                                            <div className="mb-2 text-sm text-gray-500">Điểm đạt: {quiz.passingScore}</div>
                                            <div className="my-3">
                                                <button className="w-full flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100" onClick={handleAddQuestionClick}>
                                                    <Plus className="w-5 h-5" />
                                                    <span>Thêm câu hỏi</span>
                                                </button>
                                            </div>
                                            {quiz.questions && quiz.questions.length === 0 && (
                                                <div className="text-gray-500 mb-4">Không có câu hỏi nào.</div>
                                            )}
                                            <div className="space-y-6 mt-6">
                                                {quiz.questions && quiz.questions.length > 0 ? quiz.questions.map((q, idx) => (
                                                    <div key={q.questionId} className="bg-white rounded-xl shadow border border-gray-200">
                                                        <div
                                                            className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
                                                            onClick={() => handleToggleQuestion(q.questionId)}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                {openQuestionIds.includes(q.questionId) ? (
                                                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                                                ) : (
                                                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                                                )}
                                                                <span className="font-medium text-gray-900">Câu {idx + 1}: {q.questionText}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                                                                <button className="p-2 rounded hover:bg-amber-50 text-amber-500" title="Sửa câu hỏi" onClick={e => { e.stopPropagation(); handleEditQuestionClick(q); }}>
                                                                    <Pencil className="w-5 h-5" />
                                                                </button>
                                                                <button className="p-2 rounded hover:bg-red-50 text-red-500" title="Xóa câu hỏi" onClick={e => { e.stopPropagation(); handleDeleteQuestion(q); }}>
                                                                    <Trash2 className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {openQuestionIds.includes(q.questionId) && (
                                                            <div className="bg-white border-t border-gray-100 px-8 pb-4 pt-2">
                                                                <div className="my-3">
                                                                    <button className="w-full flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => {/* TODO: handle add answer */}}>
                                                                        <Plus className="w-5 h-5" />
                                                                        <span>Thêm câu trả lời</span>
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-2 ml-4">
                                                                    {q.options.map(opt => (
                                                                        <div key={opt.optionId} className={`px-4 py-2 rounded border ${opt.isCorrect ? 'bg-green-50 border-green-400 text-green-700 font-semibold' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                                                                            {opt.optionText}
                                                                            {opt.isCorrect && <span className="ml-2 text-green-600 font-bold">(Đáp án đúng)</span>}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )) : null}
                                            </div>
                                        </div>
                                    )}
                                    {showAddQuiz && (
                                        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                                            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                                                <h2 className="text-xl font-bold mb-4">Tạo bài tập mới</h2>
                                                <form className="space-y-4" onSubmit={handleAddQuizSubmit}>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Tiêu đề bài tập</label>
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            value={addQuizForm.title}
                                                            onChange={handleAddQuizChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Nhập tiêu đề bài tập"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Mô tả</label>
                                                        <input
                                                            type="text"
                                                            name="description"
                                                            value={addQuizForm.description}
                                                            onChange={handleAddQuizChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Nhập mô tả bài tập"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Điểm đạt</label>
                                                        <input
                                                            type="number"
                                                            name="passingScore"
                                                            value={addQuizForm.passingScore}
                                                            onChange={handleAddQuizChange}
                                                            className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                                            min="1"
                                                            required
                                                        />
                                                    </div>
                                                    {addQuizError && <div className="text-red-500 text-sm">{addQuizError}</div>}
                                                    <div className="flex justify-end gap-2 mt-6">
                                                        <button
                                                            type="button"
                                                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                                            onClick={() => setShowAddQuiz(false)}
                                                            disabled={addQuizLoading}
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                                            disabled={addQuizLoading}
                                                        >
                                                            {addQuizLoading ? 'Đang lưu...' : 'Tạo'}
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {showEditQuiz && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa bài tập</h2>
                        <form className="space-y-4" onSubmit={handleEditQuizSubmit}>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tiêu đề bài tập</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editQuizForm.title}
                                    onChange={handleEditQuizChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tiêu đề bài tập"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mô tả</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={editQuizForm.description}
                                    onChange={handleEditQuizChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập mô tả bài tập"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Điểm đạt</label>
                                <input
                                    type="number"
                                    name="passingScore"
                                    value={editQuizForm.passingScore}
                                    onChange={handleEditQuizChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="1"
                                    required
                                />
                            </div>
                            {editQuizError && <div className="text-red-500 text-sm">{editQuizError}</div>}
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={() => setShowEditQuiz(false)}
                                    disabled={editQuizLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={editQuizLoading}
                                >
                                    {editQuizLoading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showAddQuestion && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Thêm câu hỏi mới</h2>
                        <form className="space-y-4" onSubmit={handleAddQuestionSubmit}>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                                <input
                                    type="text"
                                    name="questionText"
                                    value={addQuestionForm.questionText}
                                    onChange={handleAddQuestionChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung câu hỏi"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
                                <input
                                    type="text"
                                    name="questionType"
                                    value={addQuestionForm.questionType}
                                    disabled
                                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự</label>
                                <input
                                    type="number"
                                    name="sequence"
                                    value={addQuestionForm.sequence}
                                    onChange={handleAddQuestionChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="1"
                                    required
                                />
                            </div>
                            {addQuestionError && <div className="text-red-500 text-sm">{addQuestionError}</div>}
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={() => setShowAddQuestion(false)}
                                    disabled={addQuestionLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={addQuestionLoading}
                                >
                                    {addQuestionLoading ? 'Đang lưu...' : 'Tạo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showEditQuestion && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa câu hỏi</h2>
                        <form className="space-y-4" onSubmit={handleEditQuestionSubmit}>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                                <input
                                    type="text"
                                    name="questionText"
                                    value={editQuestionForm.questionText}
                                    onChange={handleEditQuestionChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung câu hỏi"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
                                <input
                                    type="text"
                                    name="questionType"
                                    value={editQuestionForm.questionType}
                                    disabled
                                    className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự</label>
                                <input
                                    type="number"
                                    name="sequence"
                                    value={editQuestionForm.sequence}
                                    onChange={handleEditQuestionChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="1"
                                    required
                                />
                            </div>
                            {editQuestionError && <div className="text-red-500 text-sm">{editQuestionError}</div>}
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                    onClick={() => setShowEditQuestion(false)}
                                    disabled={editQuestionLoading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={editQuestionLoading}
                                >
                                    {editQuestionLoading ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LessonDetailManagement;
