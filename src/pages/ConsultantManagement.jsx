import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import api from '../api/api';

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingConsultant, setViewingConsultant] = useState(null);
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [editForm, setEditForm] = useState({
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: 0,
    qualifications: '',
    bio: '',
    consultationFee: 0,
    isAvailable: true,
    workingHours: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoString = localStorage.getItem('userInfo');
        let token = null;
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          token = userInfo.token;
        }

        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch both consultants and users in parallel
        const [consultantsRes, usersRes] = await Promise.all([
          fetch(`${BASE_URL}/Consultant`, { headers: headers }),
          fetch(`${BASE_URL}/User`, { headers: headers })
        ]);

        const consultantsData = await consultantsRes.json();
        const usersData = await usersRes.json();

        if (consultantsData.resultStatus === 'Success' && usersData.resultStatus === 'Success') {
          // Filter users to only get consultants by roleId 4
          const consultantUsers = usersData.data.filter(user => user.roleId === 4);
          
          // Create a map of consultant data for easy lookup
          const consultantMap = new Map(consultantsData.data.map(consultant => [consultant.userId, consultant]));
          
          // Combine user and consultant data - show ALL users with roleId 4
          const combinedData = consultantUsers.map(user => {
            const consultantData = consultantMap.get(user.userId);
            return {
              consultantId: consultantData?.consultantId || null,
              userId: user.userId,
              licenseNumber: consultantData?.licenseNumber || '',
              specialization: consultantData?.specialization || '',
              yearsOfExperience: consultantData?.yearsOfExperience || 0,
              qualifications: consultantData?.qualifications || '',
              bio: consultantData?.bio || '',
              consultationFee: consultantData?.consultationFee || 0,
              isAvailable: consultantData?.isAvailable ?? true,
              workingHours: consultantData?.workingHours || '',
              rating: consultantData?.rating || null,
              totalConsultations: consultantData?.totalConsultations || 0,
              createdAt: consultantData?.createdAt || null,
              userInfo: user
            };
          });

          setConsultants(combinedData);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewClick = async (consultantId, userId) => {
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
        Accept: 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // If consultantId is null, it means the user doesn't have a consultant record yet
      if (!consultantId) {
        // Find the user data from the current consultants list
        const consultant = consultants.find(c => c.userId === userId);
        if (consultant) {
          setViewingConsultant(consultant);
        } else {
          setError('Không tìm thấy thông tin chuyên viên.');
        }
        return;
      }

      const response = await api.get(`Consultant/${consultantId}`, { headers: headers });
      if (response.data && response.data.data) {
        setViewingConsultant(response.data.data);
      } else {
        setError('Không tìm thấy thông tin chuyên viên.');
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin chuyên viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClose = () => {
    setViewingConsultant(null);
  };

  const handleEditClick = (consultant) => {
    setEditingConsultant(consultant);
    setEditForm({
      licenseNumber: consultant.licenseNumber || '',
      specialization: consultant.specialization || '',
      yearsOfExperience: consultant.yearsOfExperience || 0,
      qualifications: consultant.qualifications || '',
      bio: consultant.bio || '',
      consultationFee: consultant.consultationFee || 0,
      isAvailable: consultant.isAvailable,
      workingHours: consultant.workingHours || ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : 
              value
    }));
  };

  const handleEditSave = async () => {
    if (!editingConsultant) return;
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
        Accept: 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let response;
      
      // If consultantId is null, create a new consultant record
      if (!editingConsultant.consultantId) {
        const newConsultantData = {
          ...editForm,
          userId: editingConsultant.userId
        };
        
        response = await api.post(
          'Consultant',
          newConsultantData,
          { headers: headers }
        );
      } else {
        // Update existing consultant record
        response = await api.put(
          `Consultant/${editingConsultant.consultantId}`,
          editForm,
          { headers: headers }
        );
      }

      if (response.data && response.data.data) {
        // Update the consultants list with the updated data
        setConsultants(prev => prev.map(c => 
          c.userId === editingConsultant.userId 
            ? { ...c, ...response.data.data, consultantId: response.data.data.consultantId }
            : c
        ));
        setEditingConsultant(null);
      } else {
        setError('Lỗi khi cập nhật thông tin chuyên viên.');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật thông tin chuyên viên.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingConsultant(null);
  };

  const handleDeleteConsultant = async (consultantId, userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chuyên viên này?')) return;
    
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
        Accept: 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // If consultantId is null, just remove from the list (no record to delete)
      if (!consultantId) {
        setConsultants(prev => prev.filter(c => c.userId !== userId));
        return;
      }

      await api.delete(`Consultant/${consultantId}`, { headers: headers });
      
      // Update the consultants list by removing the deleted consultant
      setConsultants(prev => prev.filter(c => c.consultantId !== consultantId));
    } catch (err) {
      setError('Lỗi khi xóa chuyên viên.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý chuyên viên</h1>
            <p className="text-gray-600 mt-1">Xem thông tin và quản lý tất cả chuyên viên trên hệ thống</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Về trang chủ
            </Link>
        </div>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">License Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qualifications</th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Consultation Fee</th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Working Hours</th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Consultations</th> */}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {consultants.map((consultant) => (
                <tr key={consultant.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.userInfo?.username || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.userInfo?.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.licenseNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.specialization || 'N/A'}</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-900">{consultant.yearsOfExperience || 'N/A'}</td> */}
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.qualifications || 'N/A'}</td>
                  {/* <td className="px-6 py-4 text-sm text-gray-900">{consultant.consultationFee || 'N/A'}</td> */}
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${consultant.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {consultant.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 text-sm text-gray-900">{consultant.workingHours || 'N/A'}</td> */}
                  {/* <td className="px-6 py-4 text-sm text-gray-900">{consultant.rating || 'N/A'}</td> */}
                  {/* <td className="px-6 py-4 text-sm text-gray-900">{consultant.totalConsultations}</td> */}
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${consultant.userInfo?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {consultant.userInfo?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="p-2 rounded hover:bg-blue-50 text-blue-600" 
                        title="View details"
                        onClick={() => handleViewClick(consultant.consultantId, consultant.userId)}
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 rounded hover:bg-amber-50 text-amber-500" 
                        title="Edit"
                        onClick={() => handleEditClick(consultant)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        className="p-2 rounded hover:bg-red-50 text-red-500" 
                        title="Delete"
                        onClick={() => handleDeleteConsultant(consultant.consultantId, consultant.userId)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xem chi tiết consultant */}
      {viewingConsultant && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Thông tin chuyên viên</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Consultant ID:</strong> {viewingConsultant.consultantId || 'Chưa có (cần tạo thông tin chuyên viên)'}</p>
              <p><strong>User ID:</strong> {viewingConsultant.userId}</p>
              <p><strong>Username:</strong> {viewingConsultant.userInfo?.username}</p>
              <p><strong>Email:</strong> {viewingConsultant.userInfo?.email}</p>
              <p><strong>License Number:</strong> {viewingConsultant.licenseNumber || 'Chưa có'}</p>
              <p><strong>Specialization:</strong> {viewingConsultant.specialization || 'Chưa có'}</p>
              <p><strong>Years of Experience:</strong> {viewingConsultant.yearsOfExperience || 'Chưa có'}</p>
              <p><strong>Qualifications:</strong> {viewingConsultant.qualifications || 'Chưa có'}</p>
              <p><strong>Bio:</strong> {viewingConsultant.bio || 'Chưa có'}</p>
              <p><strong>Consultation Fee:</strong> {viewingConsultant.consultationFee || 'Chưa có'}</p>
              <p><strong>Status:</strong> {viewingConsultant.isAvailable ? 'Available' : 'Unavailable'}</p>
              <p><strong>Working Hours:</strong> {viewingConsultant.workingHours || 'Chưa có'}</p>
              <p><strong>Rating:</strong> {viewingConsultant.rating || 'N/A'}</p>
              <p><strong>Total Consultations:</strong> {viewingConsultant.totalConsultations}</p>
              <p><strong>Account Status:</strong> {viewingConsultant.userInfo?.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Created At:</strong> {viewingConsultant.createdAt ? new Date(viewingConsultant.createdAt).toLocaleString() : '-'}</p>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" 
                onClick={handleViewClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa consultant */}
      {editingConsultant && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4">
              {editingConsultant.consultantId ? 'Chỉnh sửa thông tin chuyên viên' : 'Tạo thông tin chuyên viên mới'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={editForm.licenseNumber}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={editForm.specialization}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={editForm.yearsOfExperience}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Qualifications</label>
                  <input
                    type="text"
                    name="qualifications"
                    value={editForm.qualifications}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Consultation Fee</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={editForm.consultationFee}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Working Hours</label>
                  <input
                    type="text"
                    name="workingHours"
                    value={editForm.workingHours}
                    onChange={handleEditFormChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={editForm.isAvailable}
                      onChange={handleEditFormChange}
                    />
                    Available
                  </label>
                </div>
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
              >
                {editingConsultant.consultantId ? 'Lưu' : 'Tạo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultantManagement;