import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, ArrowLeft, Plus } from 'lucide-react';
import axios from 'axios';

// const BASE_URL = 'https://drugpreventionsystem-hwgecaa9ekasgngf.southeastasia-01.azurewebsites.net/api';
const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

const QUESTION_TYPE_OPTIONS = [
    { value: 'SINGLE_CHOICE', label: 'Chọn một đáp án' },
    { value: 'MULTIPLE_CHOICE', label: 'Chọn nhiều đáp án' },
    { value: 'TEXT', label: 'Tự luận' },
    // { value: 'string', label: 'string' },
];

const SurveyDetail = () => {
    const { surveyId } = useParams();
    const navigate = useNavigate();
    const [survey, setSurvey] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [addingQuestion, setAddingQuestion] = useState(false);
    const [addForm, setAddForm] = useState({
        questionText: '',
        questionType: 'SINGLE_CHOICE',
        sequence: 1,
    });
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [editForm, setEditForm] = useState({
        questionText: '',
        questionType: 'string',
        sequence: 1,
    });

    useEffect(() => {
        const fetchSurveyAndQuestions = async () => {
            try {
                const userInfoString = localStorage.getItem('userInfo');
                let token = null;
                if (userInfoString) {
                    const userInfo = JSON.parse(userInfoString);
                    token = userInfo.token;
                }

                const headers = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // Fetch survey details
                const surveyResponse = await axios.get(`${BASE_URL}/Survey/${surveyId}`, { headers });
                if (surveyResponse.data && surveyResponse.data.data) {
                    setSurvey(surveyResponse.data.data);
                }

                // Fetch questions
                const questionsResponse = await axios.get(`${BASE_URL}/SurveyQuestion/${surveyId}/questions`, { headers });
                if (questionsResponse.data && questionsResponse.data.data) {
                    // Sort questions by sequence
                    const sortedQuestions = [...questionsResponse.data.data].sort((a, b) => a.sequence - b.sequence);
                    setQuestions(sortedQuestions);
                }
            } catch (err) {
                console.error('Error fetching survey details:', err);
                setError('Lỗi khi tải dữ liệu khảo sát. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (surveyId) {
            fetchSurveyAndQuestions();
        } else {
            navigate('/surveymanagement');
        }
    }, [surveyId, navigate]);

    useEffect(() => {
        // Filter questions based on search term
        const filtered = questions.filter(question =>
            question.questionText?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuestions(filtered);
    }, [questions, searchTerm]);

    const handleAddNewQuestionClick = () => {
        // Set sequence to be the next number after the last question
        const nextSequence = questions.length > 0
            ? Math.max(...questions.map(q => q.sequence)) + 1
            : 1;

        setAddingQuestion(true);
        setAddForm({
            questionText: '',
            questionType: 'SINGLE_CHOICE',
            sequence: nextSequence,
        });
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddQuestionSave = async () => {
        if (!addForm.questionText.trim()) {
            setError('Vui lòng nhập nội dung câu hỏi');
            return;
        }

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
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const requestBody = {
                ...addForm,
                surveyId: surveyId,
            };

            const response = await axios.post(`${BASE_URL}/SurveyQuestion`, requestBody, { headers });

            if (response.data && response.data.data) {
                // Refresh the questions list
                const questionsResponse = await axios.get(`${BASE_URL}/SurveyQuestion/${surveyId}/questions`, { headers });
                if (questionsResponse.data && questionsResponse.data.data) {
                    const sortedQuestions = [...questionsResponse.data.data].sort((a, b) => a.sequence - b.sequence);
                    setQuestions(sortedQuestions);
                }
                setAddingQuestion(false);
            } else {
                setError(response.data.messages?.[0] || 'Lỗi khi thêm câu hỏi');
            }
        } catch (err) {
            console.error('Error creating question:', err);
            setError('Lỗi khi thêm câu hỏi. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCancel = () => {
        setAddingQuestion(false);
        setError(null);
    };

    const handleEditClick = (question) => {
        setEditingQuestion(question);
        setEditForm({
            questionText: question.questionText,
            questionType: question.questionType,
            sequence: question.sequence,
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSave = async () => {
        if (!editingQuestion) return;
        if (!editForm.questionText.trim()) {
            setError('Vui lòng nhập nội dung câu hỏi');
            return;
        }

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
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axios.put(
                `${BASE_URL}/SurveyQuestion/${editingQuestion.questionId}`,
                editForm,
                { headers }
            );

            if (response.data && response.data.data) {
                // Refresh the questions list
                const questionsResponse = await axios.get(`${BASE_URL}/SurveyQuestion/${surveyId}/questions`, { headers });
                if (questionsResponse.data && questionsResponse.data.data) {
                    const sortedQuestions = [...questionsResponse.data.data].sort((a, b) => a.sequence - b.sequence);
                    setQuestions(sortedQuestions);
                }
                setEditingQuestion(null);
            } else {
                setError(response.data.messages?.[0] || 'Lỗi khi cập nhật câu hỏi');
            }
        } catch (err) {
            console.error('Error updating question:', err);
            setError('Lỗi khi cập nhật câu hỏi. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCancel = () => {
        setEditingQuestion(null);
        setError(null);
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) return;

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
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            await axios.delete(`${BASE_URL}/SurveyQuestion/${questionId}`, { headers });

            // Refresh the questions list after successful deletion
            const questionsResponse = await axios.get(`${BASE_URL}/SurveyQuestion/${surveyId}/questions`, { headers });
            if (questionsResponse.data && questionsResponse.data.data) {
                const sortedQuestions = [...questionsResponse.data.data].sort((a, b) => a.sequence - b.sequence);
                setQuestions(sortedQuestions);
            }
        } catch (err) {
            console.error('Error deleting question:', err);
            setError('Lỗi khi xóa câu hỏi. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewQuestionDetail = (questionId) => {
        navigate(`/surveydetail/${surveyId}/questiondetail/${questionId}`);
    };

    return (
        <>
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-center">
                    <div className="flex-1 pr-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {survey ? survey.name : 'Chi tiết khảo sát'}
                        </h1>
                        <p className="text-gray-600 mt-1 max-w-5xl">
                            {survey ? survey.description : 'Quản lý các câu hỏi trong bài khảo sát'}
                        </p>
                    </div>
                    <Link to="/surveymanagement" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
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
                            placeholder="Tìm kiếm câu hỏi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Add Question Button */}
                    <button
                        onClick={handleAddNewQuestionClick}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm câu hỏi
                    </button>
                </div>
            </div>

            <div className="p-5">
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="p-6 text-center text-red-500">{error}</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">STT</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Question</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredQuestions.map((question) => (
                                    <tr key={question.questionId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.sequence}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{question.questionText}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {/* {question.questionType === 'SINGLE_CHOICE' && 'Chọn một đáp án'}
                                            {question.questionType === 'MULTIPLE_CHOICE' && 'Chọn nhiều đáp án'}
                                            {question.questionType === 'TEXT' && 'Tự luận'}
                                            {question.questionType === 'string' && 'string'} */}
                                            {question.questionType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    className="p-2 rounded hover:bg-blue-50 text-blue-600" 
                                                    title="Xem chi tiết"
                                                    onClick={() => handleViewQuestionDetail(question.questionId)}
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="p-2 rounded hover:bg-amber-50 text-amber-500"
                                                    title="Sửa câu hỏi"
                                                    onClick={() => handleEditClick(question)}
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="p-2 rounded hover:bg-red-50 text-red-500"
                                                    title="Xóa câu hỏi"
                                                    onClick={() => handleDeleteQuestion(question.questionId)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredQuestions.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Không có câu hỏi nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal thêm câu hỏi */}
            {addingQuestion && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Thêm câu hỏi mới</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                                <textarea
                                    name="questionText"
                                    value={addForm.questionText}
                                    onChange={handleAddFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung câu hỏi"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
                                <select
                                    name="questionType"
                                    value={addForm.questionType}
                                    onChange={handleAddFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {QUESTION_TYPE_OPTIONS.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự câu hỏi</label>
                                <input
                                    type="number"
                                    name="sequence"
                                    value={addForm.sequence}
                                    onChange={handleAddFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={handleAddCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleAddQuestionSave}
                                disabled={loading}
                            >
                                {loading ? 'Đang thêm...' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa câu hỏi */}
            {editingQuestion && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa câu hỏi</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung câu hỏi</label>
                                <textarea
                                    name="questionText"
                                    value={editForm.questionText}
                                    onChange={handleEditFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung câu hỏi"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Loại câu hỏi</label>
                                <select
                                    name="questionType"
                                    value={editForm.questionType}
                                    onChange={handleEditFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {QUESTION_TYPE_OPTIONS.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Thứ tự câu hỏi</label>
                                <input
                                    type="number"
                                    name="sequence"
                                    value={editForm.sequence}
                                    onChange={handleEditFormChange}
                                    min="1"
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                onClick={handleEditCancel}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                onClick={handleEditSave}
                                disabled={loading}
                            >
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SurveyDetail;
