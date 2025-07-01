import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Plus, Edit, Eye, Trash2, ChevronDown, ChevronRight, Clock, Pencil, BookOpen, Users } from 'lucide-react';
import api from '../api/api';

const CourseDetailManagement = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [addingWeek, setAddingWeek] = useState(false);
    const [expandedWeeks, setExpandedWeeks] = useState([]);
    const [addWeekForm, setAddWeekForm] = useState({ title: '', weekNumber: 1 });
    const [editingWeek, setEditingWeek] = useState(null);
    const [editWeekForm, setEditWeekForm] = useState({ title: '', weekNumber: 1 });
    const [addingLessonWeekId, setAddingLessonWeekId] = useState(null);
    const [addLessonForm, setAddLessonForm] = useState({ title: '', content: '', durationMinutes: 10, sequence: 1, hasQuiz: false, hasPractice: false });
    const [editingLesson, setEditingLesson] = useState(null);
    const [editLessonForm, setEditLessonForm] = useState({ title: '', content: '', durationMinutes: 10, sequence: 1, hasQuiz: false, hasPractice: false });

    useEffect(() => {
        const fetchCourse = async () => {
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
                const res = await api.get(`/Course/${courseId}/manager-content`, { headers });
                if (res.data && res.data.data) {
                    setCourse(res.data.data);
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

    const handleAddNewWeekClick = () => {
        let nextWeekNumber = 1;
        if (course?.courseWeeks?.length > 0) {
            nextWeekNumber = Math.max(...course.courseWeeks.map(w => w.weekNumber || 0)) + 1;
        }
        setAddWeekForm({ title: '', weekNumber: nextWeekNumber });
        setAddingWeek(true);
    };

    const handleAddWeekFormChange = (e) => {
        const { name, value } = e.target;
        setAddWeekForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddWeekSave = async () => {
        if (!addWeekForm.title.trim()) return;
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
            await api.post('/CourseWeek', {
                courseId: course.courseId,
                title: addWeekForm.title,
                weekNumber: Number(addWeekForm.weekNumber)
            }, { headers });
            // Refresh course data
            const res = await api.get(`/Course/${courseId}/manager-content`, { headers });
            if (res.data && res.data.data) {
                setCourse(res.data.data);
            }
            setAddingWeek(false);
        } catch (err) {
            alert('Lỗi khi thêm tuần mới.');
        }
    };

    const handleAddWeekCancel = () => {
        setAddingWeek(false);
    };

    const handleToggleWeek = (weekId) => {
        setExpandedWeeks((prev) =>
            prev.includes(weekId) ? prev.filter((id) => id !== weekId) : [...prev, weekId]
        );
    };

    const handleDeleteWeek = async (weekId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tuần này?')) return;
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
            await api.delete(`/CourseWeek/${weekId}`, { headers });
            // Refresh course data
            const res = await api.get(`/Course/${courseId}/manager-content`, { headers });
            if (res.data && res.data.data) {
                setCourse(res.data.data);
            }
        } catch (err) {
            alert('Lỗi khi xóa tuần.');
        }
    };

    const handleEditWeekClick = (week) => {
        setEditWeekForm({ title: week.title, weekNumber: week.weekNumber });
        setEditingWeek(week);
    };

    const handleEditWeekFormChange = (e) => {
        const { name, value } = e.target;
        setEditWeekForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditWeekSave = async () => {
        if (!editingWeek || !editWeekForm.title.trim()) return;
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
            await api.put(`/CourseWeek/${editingWeek.weekId}`, {
                courseId: editingWeek.courseId,
                title: editWeekForm.title,
                weekNumber: Number(editWeekForm.weekNumber)
            }, { headers });
            // Refresh course data
            const res = await api.get(`/Course/${courseId}/manager-content`, { headers });
            if (res.data && res.data.data) {
                setCourse(res.data.data);
            }
            setEditingWeek(null);
        } catch (err) {
            alert('Lỗi khi cập nhật tuần.');
        }
    };

    const handleEditWeekCancel = () => {
        setEditingWeek(null);
    };

    const handleAddLessonClick = (week) => {
        let nextSequence = 1;
        if (week.lessons && week.lessons.length > 0) {
            nextSequence = Math.max(...week.lessons.map(l => l.sequence || 0)) + 1;
        }
        setAddLessonForm({ title: '', content: '', durationMinutes: 10, sequence: nextSequence, hasQuiz: false, hasPractice: false });
        setAddingLessonWeekId(week.weekId);
    };

    const handleAddLessonFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddLessonForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddLessonSave = async () => {
        if (!addLessonForm.title.trim() || !addingLessonWeekId) return;
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
            await api.post('/Lesson', {
                weekId: addingLessonWeekId,
                title: addLessonForm.title,
                content: addLessonForm.content,
                durationMinutes: Number(addLessonForm.durationMinutes),
                sequence: Number(addLessonForm.sequence),
                hasQuiz: true,
                hasPractice: true
            }, { headers });
            // Refresh course data
            const res = await api.get(`/Course/${courseId}/manager-content`, { headers });
            if (res.data && res.data.data) {
                setCourse(res.data.data);
            }
            setAddingLessonWeekId(null);
        } catch (err) {
            alert('Lỗi khi thêm bài học.');
        }
    };

    const handleAddLessonCancel = () => {
        setAddingLessonWeekId(null);
    };

    const handleEditLessonClick = (lesson, weekId) => {
        setEditLessonForm({
            title: lesson.title,
            content: lesson.content || '',
            durationMinutes: lesson.durationMinutes,
            sequence: lesson.sequence,
            hasQuiz: !!lesson.hasQuiz,
            hasPractice: !!lesson.hasPractice,
            weekId: weekId
        });
        setEditingLesson({ ...lesson, weekId });
    };

    const handleEditLessonFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditLessonForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleEditLessonSave = async () => {
        if (!editingLesson || !editLessonForm.title.trim()) return;
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
            await api.put(`/Lesson/${editingLesson.lessonId}`, {
                weekId: editLessonForm.weekId,
                title: editLessonForm.title,
                content: editLessonForm.content,
                durationMinutes: Number(editLessonForm.durationMinutes),
                sequence: Number(editLessonForm.sequence),
                hasQuiz: true,
                hasPractice: true
            }, { headers });
            // Refresh course data
            const res = await api.get(`/Course/${courseId}/manager-content`, { headers });
            if (res.data && res.data.data) {
                setCourse(res.data.data);
            }
            setEditingLesson(null);
        } catch (err) {
            alert('Lỗi khi cập nhật bài học.');
        }
    };

    const handleEditLessonCancel = () => {
        setEditingLesson(null);
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) return;
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
            await api.delete(`/Lesson/${lessonId}`, { headers });
            // Refresh course data
            const res = await api.get(`/Course/${courseId}/manager-content`, { headers });
            if (res.data && res.data.data) {
                setCourse(res.data.data);
            }
        } catch (err) {
            alert('Lỗi khi xóa bài học.');
        }
    };

    // Filter weeks by search term
    const filteredWeeks = course?.courseWeeks?.filter(week =>
        week.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        week.lessons?.some(lesson => lesson.title.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    return (
        <>
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <Link to="/coursemanagement" className="hover:underline">Quản lý khóa học</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">{course ? course.title : ''}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex-1 pr-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {course ? course.title : 'Chi tiết khóa học'}
                        </h1>
                        <p className="text-gray-600 mt-1 max-w-5xl">
                            {course ? course.description : 'Quản lý các tuần trong khóa học'}
                        </p>
                        {course && (
                            <div className="flex flex-wrap items-center gap-6 text-gray-600 text-sm mt-4">
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{course.lessonCount} bài học</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{course.studentCount} học viên</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.totalDuration} tuần</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Pencil className="w-4 h-4" />
                                    <span>Giảng viên: <span className="font-medium text-gray-900">{course.instructorName}</span></span>
                                </div>
                            </div>
                        )}
                    </div>
                    <Link to="/coursemanagement" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Quay lại</span>
                    </Link>
                </div>
            </div>

            <div className="px-8 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm tuần..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Add Week Button */}
                    <button
                        onClick={handleAddNewWeekClick}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm tuần
                    </button>
                </div>
            </div>

            {/* Weeks & Lessons UI */}
            <div className="px-8 pb-8 mt-4">
                {loading ? (
                    <div className="text-center text-gray-500 py-8">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                ) : filteredWeeks.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">Không có tuần nào</div>
                ) : (
                    <div className="space-y-6">
                        {filteredWeeks.map((week, idx) => (
                            <div key={week.weekId} className="bg-white rounded-xl shadow border border-gray-200">
                                <div className="flex items-center justify-between px-6 py-4 cursor-pointer select-none" onClick={() => handleToggleWeek(week.weekId)}>
                                    <div className="flex items-center gap-2">
                                        {expandedWeeks.includes(week.weekId) ? (
                                            <ChevronDown className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-gray-500" />
                                        )}
                                        <span className="text-lg font-semibold text-gray-900">{week.title}</span>
                                        <span className="ml-4 text-gray-500 text-sm">{week.lessons?.length || 0} lessons</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 rounded hover:bg-amber-50 text-amber-500" title="Sửa tuần" onClick={() => handleEditWeekClick(week)}>
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 rounded hover:bg-red-50 text-red-500" title="Xóa tuần" onClick={() => handleDeleteWeek(week.weekId)}>
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                {expandedWeeks.includes(week.weekId) && (
                                    <div className="bg-white border-t border-gray-100 px-8 pb-4 pt-2">
                                        {/* Add New Lesson */}
                                        <div className="my-3">
                                            <button className="w-full flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => handleAddLessonClick(week)}>
                                                <Plus className="w-5 h-5" />
                                                <span>Thêm bài học mới</span>
                                            </button>
                                        </div>
                                        {/* Lessons List */}
                                        <div className="space-y-3">
                                            {week.lessons && week.lessons.length > 0 ? week.lessons.map((lesson, lidx) => (
                                                <div key={lesson.lessonId} className="flex items-center justify-between bg-white shadow rounded-lg px-4 py-3 border border-gray-300">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{lesson.title}</span>
                                                        <span className="ml-3 text-gray-500 text-sm flex items-center gap-1">
                                                            <Clock className="w-4 h-4 inline-block text-gray-400" />
                                                            {lesson.durationMinutes}min
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button className="p-2 rounded hover:bg-blue-50 text-blue-600" title="Xem chi tiết bài học" onClick={() => navigate(`/lessondetailmanagement/${lesson.lessonId}`)}>
                                                            <Eye className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 rounded hover:bg-amber-50 text-amber-500" title="Sửa bài học" onClick={() => handleEditLessonClick(lesson, week.weekId)}>
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button className="p-2 rounded hover:bg-red-50 text-red-500" title="Xóa bài học" onClick={() => handleDeleteLesson(lesson.lessonId)}>
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-gray-500 px-2 py-2">Chưa có bài học</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal thêm tuần */}
            {addingWeek && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Thêm tuần mới</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tiêu đề tuần</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={addWeekForm.title}
                                    onChange={handleAddWeekFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tiêu đề tuần"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Số thứ tự tuần</label>
                                <input
                                    type="number"
                                    name="weekNumber"
                                    value={addWeekForm.weekNumber}
                                    onChange={handleAddWeekFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={handleAddWeekCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleAddWeekSave}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa tuần */}
            {editingWeek && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa tuần</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tiêu đề tuần</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editWeekForm.title}
                                    onChange={handleEditWeekFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tiêu đề tuần"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Số thứ tự tuần</label>
                                <input
                                    type="number"
                                    name="weekNumber"
                                    value={editWeekForm.weekNumber}
                                    onChange={handleEditWeekFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={handleEditWeekCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleEditWeekSave}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thêm bài học */}
            {addingLessonWeekId && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Thêm bài học mới</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tiêu đề bài học</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={addLessonForm.title}
                                    onChange={handleAddLessonFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tiêu đề bài học"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung (tùy chọn)</label>
                                <textarea
                                    name="content"
                                    value={addLessonForm.content}
                                    onChange={handleAddLessonFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung bài học"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
                                <input
                                    type="number"
                                    name="durationMinutes"
                                    value={addLessonForm.durationMinutes}
                                    onChange={handleAddLessonFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự bài học</label>
                                <input
                                    type="number"
                                    name="sequence"
                                    value={addLessonForm.sequence}
                                    onChange={handleAddLessonFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={handleAddLessonCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleAddLessonSave}
                            >
                                Thêm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa bài học */}
            {editingLesson && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa bài học</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tiêu đề bài học</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={editLessonForm.title}
                                    onChange={handleEditLessonFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập tiêu đề bài học"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung (tùy chọn)</label>
                                <textarea
                                    name="content"
                                    value={editLessonForm.content}
                                    onChange={handleEditLessonFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung bài học"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thời lượng (phút)</label>
                                <input
                                    type="number"
                                    name="durationMinutes"
                                    value={editLessonForm.durationMinutes}
                                    onChange={handleEditLessonFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự bài học</label>
                                <input
                                    type="number"
                                    name="sequence"
                                    value={editLessonForm.sequence}
                                    onChange={handleEditLessonFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={handleEditLessonCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleEditLessonSave}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseDetailManagement;
