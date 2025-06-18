import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Search, ArrowLeft, Plus } from 'lucide-react';
import axios from 'axios';

// const BASE_URL = 'https://drugpreventionsystem-hwgecaa9ekasgngf.southeastasia-01.azurewebsites.net/api';
const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

const QuestionDetail = () => {
    const { questionId, surveyId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [addingOption, setAddingOption] = useState(false);
    const [addForm, setAddForm] = useState({
        optionText: '',
        scoreValue: 0,
    });
    const [editingOption, setEditingOption] = useState(null);
    const [editForm, setEditForm] = useState({
        optionText: '',
        scoreValue: 0,
    });

    useEffect(() => {
        const fetchQuestionAndOptions = async () => {
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

                // Fetch question details
                const questionResponse = await axios.get(`${BASE_URL}/SurveyQuestion/${questionId}`, { headers });
                if (questionResponse.data && questionResponse.data.data) {
                    setQuestion(questionResponse.data.data);
                }

                // Fetch options
                const optionsResponse = await axios.get(`${BASE_URL}/SurveyOption/${questionId}/Options`, { headers });
                if (optionsResponse.data) {
                    setOptions(Array.isArray(optionsResponse.data) ? optionsResponse.data : []);
                }
            } catch (err) {
                console.error('Error fetching question details:', err);
                setError('Lỗi khi tải dữ liệu câu hỏi. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        if (questionId) {
            fetchQuestionAndOptions();
        } else {
            navigate(`/surveydetail/${surveyId}`);
        }
    }, [questionId, surveyId, navigate]);

    useEffect(() => {
        // Filter options based on search term
        const filtered = options.filter(option =>
            option.optionText?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOptions(filtered);
    }, [options, searchTerm]);

    const handleAddNewOptionClick = () => {
        setAddingOption(true);
        setAddForm({
            optionText: '',
            scoreValue: 0,
        });
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddForm((prev) => ({
            ...prev,
            [name]: name === 'scoreValue' ? Number(value) : value,
        }));
    };

    const handleAddOptionSave = async () => {
        if (!addForm.optionText.trim()) {
            setError('Vui lòng nhập nội dung đáp án');
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
                questionId: questionId,
                optionText: addForm.optionText.trim(),
                scoreValue: Number(addForm.scoreValue)
            };

            const response = await axios.post(`${BASE_URL}/SurveyOption`, requestBody, { headers });
            console.log('Add option res:', response.data);

            if (response.data) {
                // Refresh the options list
                const optionsResponse = await axios.get(`${BASE_URL}/SurveyOption/${questionId}/Options`, { headers });
                if (optionsResponse.data) {
                    setOptions(Array.isArray(optionsResponse.data) ? optionsResponse.data : []);
                }
                setAddingOption(false);
                setAddForm({
                    optionText: '',
                    scoreValue: 0,
                });
            } else {
                setError('Lỗi khi thêm đáp án');
            }
        } catch (err) {
            console.error('Error creating option:', err);
            setError('Lỗi khi thêm đáp án. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCancel = () => {
        setAddingOption(false);
        setError(null);
    };

    const handleEditClick = (option) => {
        setEditingOption(option);
        setEditForm({
            optionText: option.optionText,
            scoreValue: option.scoreValue,
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: name === 'scoreValue' ? Number(value) : value,
        }));
    };

    const handleEditSave = async () => {
        if (!editingOption) return;
        if (!editForm.optionText.trim()) {
            setError('Vui lòng nhập nội dung đáp án');
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
                optionText: editForm.optionText.trim(),
                scoreValue: Number(editForm.scoreValue)
            };

            const response = await axios.put(
                `${BASE_URL}/SurveyOption/${editingOption.optionId}`,
                requestBody,
                { headers }
            );

            if (response.data) {
                // Refresh the options list
                const optionsResponse = await axios.get(`${BASE_URL}/SurveyOption/${questionId}/Options`, { headers });
                if (optionsResponse.data) {
                    setOptions(Array.isArray(optionsResponse.data) ? optionsResponse.data : []);
                }
                setEditingOption(null);
                setEditForm({
                    optionText: '',
                    scoreValue: 0,
                });
            } else {
                setError('Lỗi khi cập nhật đáp án');
            }
        } catch (err) {
            console.error('Error updating option:', err);
            setError('Lỗi khi cập nhật đáp án. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCancel = () => {
        setEditingOption(null);
        setError(null);
    };

    const handleDeleteOption = async (optionId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đáp án này?')) return;

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

            await axios.delete(`${BASE_URL}/SurveyOption/${optionId}`, { headers });

            // Refresh the options list after successful deletion
            const optionsResponse = await axios.get(`${BASE_URL}/SurveyOption/${questionId}/Options`, { headers });
            if (optionsResponse.data) {
                setOptions(Array.isArray(optionsResponse.data) ? optionsResponse.data : []);
            }
        } catch (err) {
            console.error('Error deleting option:', err);
            setError('Lỗi khi xóa đáp án. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-center">
                    <div className="flex-1 pr-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {question ? question.questionText : 'Chi tiết câu hỏi'}
                        </h1>
                        <p className="text-gray-600 mt-1 max-w-5xl">
                            {/* {question ? `Loại câu hỏi: ${
                                question.questionType === 'SINGLE_CHOICE' ? 'Chọn một đáp án' :
                                question.questionType === 'MULTIPLE_CHOICE' ? 'Chọn nhiều đáp án' :
                                question.questionType === 'TEXT' ? 'Câu trả lời tự do' :
                                question.questionType === 'SCALE' ? 'Thang đo' : 'Câu trả lời tự do'
                            }` : 'Quản lý các đáp án của câu hỏi'} */}
                            {question ? `Loại câu hỏi: ${question.questionType}` : 'Quản lý các đáp án của câu hỏi'}
                        </p>
                    </div>
                    <Link to={`/surveydetail/${surveyId}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0">
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
                            placeholder="Tìm kiếm đáp án..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Add Option Button */}
                    <button
                        onClick={handleAddNewOptionClick}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm đáp án
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
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Option Content</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredOptions.map((option) => (
                                    <tr key={option.optionId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900">{option.optionText}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{option.scoreValue}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="p-2 rounded hover:bg-amber-50 text-amber-500"
                                                    title="Sửa đáp án"
                                                    onClick={() => handleEditClick(option)}
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    className="p-2 rounded hover:bg-red-50 text-red-500"
                                                    title="Xóa đáp án"
                                                    onClick={() => handleDeleteOption(option.optionId)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOptions.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Không có đáp án nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal thêm đáp án */}
            {addingOption && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Thêm đáp án mới</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung đáp án</label>
                                <textarea
                                    name="optionText"
                                    value={addForm.optionText}
                                    onChange={handleAddFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung đáp án"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Điểm số</label>
                                <input
                                    type="number"
                                    name="scoreValue"
                                    value={addForm.scoreValue}
                                    onChange={handleAddFormChange}
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
                                onClick={handleAddOptionSave}
                                disabled={loading}
                            >
                                {loading ? 'Đang thêm...' : 'Thêm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chỉnh sửa đáp án */}
            {editingOption && (
                <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa đáp án</h2>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nội dung đáp án</label>
                                <textarea
                                    name="optionText"
                                    value={editForm.optionText}
                                    onChange={handleEditFormChange}
                                    className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập nội dung đáp án"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Điểm số</label>
                                <input
                                    type="number"
                                    name="scoreValue"
                                    value={editForm.scoreValue}
                                    onChange={handleEditFormChange}
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

export default QuestionDetail;
