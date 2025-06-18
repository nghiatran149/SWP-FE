import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

const SurveyManagement = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [addingSurvey, setAddingSurvey] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    description: '',
  });
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
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

        const response = await axios.get(`${BASE_URL}/Survey`, { headers });
        if (response.data && response.data.data) {
          setSurveys(response.data.data);
        } else {
          setSurveys([]);
        }
      } catch (err) {
        console.error('Error fetching surveys:', err);
        setError('Lỗi khi tải dữ liệu khảo sát. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  useEffect(() => {
    // Apply filters whenever surveys or searchTerm changes
    const sortedSurveys = [...surveys].sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt).getTime();
      return bDate - aDate;
    });

    const filtered = sortedSurveys.filter(survey => {
      const matchesSearch =
        survey.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    setFilteredSurveys(filtered);
  }, [surveys, searchTerm]);

  const handleAddNewSurveyClick = () => {
    setAddingSurvey(true);
    setAddForm({
      name: '',
      description: '',
    });
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSurveySave = async () => {
    if (!addForm.name.trim()) {
      setError('Vui lòng nhập tên khảo sát');
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

      const currentDate = new Date().toISOString();
      const requestBody = {
        ...addForm,
        createdAt: currentDate,
        updatedAt: currentDate
      };

      const response = await axios.post(`${BASE_URL}/Survey`, requestBody, { headers });
      
      if (response.data && response.data.data) {
        // Refresh the survey list
        const updatedResponse = await axios.get(`${BASE_URL}/Survey`, { headers });
        if (updatedResponse.data && updatedResponse.data.data) {
          setSurveys(updatedResponse.data.data);
        }
        setAddingSurvey(false);
      } else {
        setError(response.data.messages?.[0] || 'Lỗi khi thêm khảo sát');
      }
    } catch (err) {
      console.error('Error creating survey:', err);
      setError('Lỗi khi thêm khảo sát. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCancel = () => {
    setAddingSurvey(false);
    setError(null);
  };

  const handleEditClick = (survey) => {
    setEditingSurvey(survey);
    setEditForm({
      name: survey.name,
      description: survey.description,
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
    if (!editingSurvey) return;
    if (!editForm.name.trim()) {
      setError('Vui lòng nhập tên khảo sát');
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

      const currentDate = new Date().toISOString();
      const requestBody = {
        ...editForm,
        createdAt: editingSurvey.createdAt, // Keep original createdAt
        updatedAt: currentDate // Update the updatedAt
      };

      const response = await axios.put(
        `${BASE_URL}/Survey/${editingSurvey.surveyId}`,
        requestBody,
        { headers }
      );

      if (response.data && response.data.data) {
        // Refresh the survey list
        const updatedResponse = await axios.get(`${BASE_URL}/Survey`, { headers });
        if (updatedResponse.data && updatedResponse.data.data) {
          setSurveys(updatedResponse.data.data);
        }
        setEditingSurvey(null);
      } else {
        setError(response.data.messages?.[0] || 'Lỗi khi cập nhật khảo sát');
      }
    } catch (err) {
      console.error('Error updating survey:', err);
      setError('Lỗi khi cập nhật khảo sát. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingSurvey(null);
    setError(null);
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khảo sát này?')) return;
    
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

      await axios.delete(`${BASE_URL}/Survey/${surveyId}`, { headers });
      
      // Refresh the survey list after successful deletion
      const updatedResponse = await axios.get(`${BASE_URL}/Survey`, { headers });
      if (updatedResponse.data && updatedResponse.data.data) {
        setSurveys(updatedResponse.data.data);
      }
    } catch (err) {
      console.error('Error deleting survey:', err);
      setError('Lỗi khi xóa khảo sát. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (surveyId) => {
    navigate(`/surveydetail/${surveyId}`);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý khảo sát</h1>
            <p className="text-gray-600 mt-1">Xem thông tin và quản lý tất cả các bài khảo sát trên hệ thống</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
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
              placeholder="Tìm kiếm theo tên, mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Update Add Button */}
          <button
            onClick={handleAddNewSurveyClick}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm khảo sát
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
                  {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Survey ID</th> */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated At</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredSurveys.map((survey) => (
                  <tr key={survey.surveyId} className="hover:bg-gray-50 transition-colors">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{survey.surveyId}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{survey.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{survey.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{survey.createdAt ? new Date(survey.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{survey.updatedAt ? new Date(survey.updatedAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-2 rounded hover:bg-blue-50 text-blue-600" 
                          title="Xem chi tiết"
                          onClick={() => handleViewClick(survey.surveyId)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 rounded hover:bg-amber-50 text-amber-500" 
                          title="Sửa thông tin"
                          onClick={() => handleEditClick(survey)}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 rounded hover:bg-red-50 text-red-500" 
                          title="Xóa khảo sát"
                          onClick={() => handleDeleteSurvey(survey.surveyId)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal thêm khảo sát */}
      {addingSurvey && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm khảo sát mới</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khảo sát</label>
                <input
                  type="text"
                  name="name"
                  value={addForm.name}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên khảo sát"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={addForm.description}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả khảo sát"
                  rows="4"
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
                onClick={handleAddSurveySave}
                disabled={loading}
              >
                {loading ? 'Đang thêm...' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa khảo sát */}
      {editingSurvey && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa khảo sát</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khảo sát</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên khảo sát"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả khảo sát"
                  rows="4"
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

export default SurveyManagement;
