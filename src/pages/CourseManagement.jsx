import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import api from '../api/api';

const AGE_GROUP_FILTERS = [
  { value: 'all', label: 'Tất cả nhóm tuổi' },
  { value: 'Học sinh', label: 'Học sinh' },
  { value: 'Thanh thiếu niên', label: 'Thanh thiếu niên' },
  { value: 'Phụ huynh', label: 'Phụ huynh' },
  { value: 'Giáo viên', label: 'Giáo viên' },
  { value: 'Khác', label: 'Khác' },
];

function getTabByAgeGroup(ageGroup) {
  if (!ageGroup) return 'Khác';
  if (ageGroup.includes('Học sinh')) return 'Học sinh';
  if (ageGroup.includes('Thanh thiếu niên')) return 'Thanh thiếu niên';
  if (ageGroup.includes('Phụ huynh')) return 'Phụ huynh';
  if (ageGroup.includes('Giáo viên')) return 'Giáo viên';
  return 'Khác';
}

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [addingCourse, setAddingCourse] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    ageGroup: '',
    requirements: '',
    instructorId: '',
    thumbnailUrl: '',
    isActive: true,
  });
  const [instructors, setInstructors] = useState([]);
  const [ageGroupFilter, setAgeGroupFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    ageGroup: '',
    requirements: '',
    instructorId: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchCourses = async () => {
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
        const response = await api.get('/Course', { headers });
        if (response.data && response.data.data) {
          setCourses(response.data.data);
        } else {
          setCourses([]);
        }
        // Fetch instructors for filter if not loaded
        if (!instructors || instructors.length === 0) {
          fetchInstructors();
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu khóa học. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    // Sắp xếp và lọc theo searchTerm, ageGroupFilter, instructorFilter
    const sortedCourses = [...courses].sort((a, b) => {
      const aDate = new Date(a.updatedAt || a.createdAt).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt).getTime();
      return bDate - aDate;
    });
    const filtered = sortedCourses.filter(course => {
      const matchesSearch =
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructorName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAgeGroup =
        ageGroupFilter === 'all' ? true : getTabByAgeGroup(course.ageGroup) === ageGroupFilter;
      const matchesInstructor =
        instructorFilter === 'all' ? true : course.instructorName === instructorFilter;
      return matchesSearch && matchesAgeGroup && matchesInstructor;
    });
    setFilteredCourses(filtered);
  }, [courses, searchTerm, ageGroupFilter, instructorFilter]);

  const fetchInstructors = async () => {
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
      const response = await api.get('/Instructor', { headers });
      if (response.data && response.data.data) {
        setInstructors(response.data.data);
      } else {
        setInstructors([]);
      }
    } catch (err) {
      setInstructors([]);
    }
  };

  const handleAddNewCourseClick = () => {
    setAddingCourse(true);
    setAddForm({
      title: '',
      description: '',
      ageGroup: '',
      requirements: '',
      instructorId: '',
      thumbnailUrl: '',
      isActive: true,
    });
    fetchInstructors();
  };

  const handleAddFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddCourseSave = async () => {
    if (!addForm.title.trim()) {
      setError('Vui lòng nhập tên khóa học');
      return;
    }
    if (!addForm.instructorId) {
      setError('Vui lòng chọn giảng viên');
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
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const requestBody = {
        title: addForm.title,
        description: addForm.description,
        ageGroup: addForm.ageGroup,
        isActive: addForm.isActive,
        instructorId: addForm.instructorId,
        thumbnailUrl: addForm.thumbnailUrl,
        requirements: addForm.requirements,
      };
      const response = await api.post('/Course', requestBody, { headers });
      if (response.data && response.data.data) {
        // Refresh course list
        const updatedResponse = await api.get('/Course', { headers });
        if (updatedResponse.data && updatedResponse.data.data) {
          setCourses(updatedResponse.data.data);
        }
        setAddingCourse(false);
      } else {
        setError(response.data.messages?.[0] || 'Lỗi khi thêm khóa học');
      }
    } catch (err) {
      setError('Lỗi khi thêm khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course);
    setEditForm({
      title: course.title || '',
      description: course.description || '',
      ageGroup: course.ageGroup || '',
      requirements: course.requirements || '',
      instructorId: course.instructorId || '',
      isActive: course.isActive ?? true,
    });
    fetchInstructors();
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSave = async () => {
    if (!editingCourse) return;
    if (!editForm.title.trim()) {
      setError('Vui lòng nhập tên khóa học');
      return;
    }
    if (!editForm.instructorId) {
      setError('Vui lòng chọn giảng viên');
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
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const requestBody = {
        title: editForm.title,
        description: editForm.description,
        ageGroup: editForm.ageGroup,
        isActive: editForm.isActive,
        instructorId: editForm.instructorId,
        requirements: editForm.requirements,
      };
      const response = await api.put(`/Course/${editingCourse.courseId}`, requestBody, { headers });
      if (response.data && response.data.data) {
        // Refresh course list
        const updatedResponse = await api.get('/Course', { headers });
        if (updatedResponse.data && updatedResponse.data.data) {
          setCourses(updatedResponse.data.data);
        }
        setEditingCourse(null);
      } else {
        setError(response.data.messages?.[0] || 'Lỗi khi cập nhật khóa học');
      }
    } catch (err) {
      setError('Lỗi khi cập nhật khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingCourse(null);
    setError(null);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
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
      await api.delete(`/Course/${courseId}`, { headers });
      // Refresh course list
      const updatedResponse = await api.get('/Course', { headers });
      if (updatedResponse.data && updatedResponse.data.data) {
        setCourses(updatedResponse.data.data);
      }
    } catch (err) {
      // Nếu lỗi nhưng status là 204 thì vẫn reload danh sách và không báo lỗi
      if (err.response && err.response.status === 204) {
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
          const updatedResponse = await api.get('/Course', { headers });
          if (updatedResponse.data && updatedResponse.data.data) {
            setCourses(updatedResponse.data.data);
          }
        } catch (reloadErr) {
          setError('Lỗi khi tải lại danh sách sau khi xóa.');
        }
        setError(null);
        setLoading(false);
        return;
      }
      // Log chi tiết lỗi nếu không phải 204
      if (err.response) {
        console.error('Delete error:', err.response.status, err.response.data);
      } else {
        console.error('Delete error:', err);
      }
      setError('Lỗi khi xóa khóa học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
            <p className="text-gray-600 mt-1">Xem thông tin và quản lý tất cả các khóa học trên hệ thống</p>
          </div>
          <Link to="/home" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
      <div className="px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4 flex-1">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mô tả, giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* AgeGroup Filter */}
            <select
              value={ageGroupFilter}
              onChange={e => setAgeGroupFilter(e.target.value)}
              className="block w-44 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {AGE_GROUP_FILTERS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Instructor Filter */}
            <select
              value={instructorFilter}
              onChange={e => setInstructorFilter(e.target.value)}
              className="block w-44 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả giảng viên</option>
              {instructors.map(ins => (
                <option key={ins.instructorId} value={ins.fullName}>{ins.fullName}</option>
              ))}
            </select>
          </div>
          {/* Add Course Button */}
          <button
            onClick={handleAddNewCourseClick}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm khóa học
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th> */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Age Group</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated At</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCourses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{course.title}</td>
                    {/* <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{course.description}</td> */}
                    <td className="px-6 py-4 text-sm text-gray-900">{course.instructorName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{course.ageGroup}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{course.createdAt ? new Date(course.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{course.updatedAt ? new Date(course.updatedAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-2 rounded hover:bg-blue-50 text-blue-600" 
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 rounded hover:bg-amber-50 text-amber-500" 
                          title="Sửa thông tin"
                          onClick={() => handleEditClick(course)}
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 rounded hover:bg-red-50 text-red-500" 
                          title="Xóa khóa học"
                          onClick={() => handleDeleteCourse(course.courseId)}
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

      {/* Modal thêm khóa học */}
      {addingCourse && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm khóa học mới</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khóa học</label>
                <input
                  type="text"
                  name="title"
                  value={addForm.title}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên khóa học"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={addForm.description}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả khóa học"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nhóm tuổi</label>
                <input
                  type="text"
                  name="ageGroup"
                  value={addForm.ageGroup}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhóm tuổi phù hợp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yêu cầu</label>
                <input
                  type="text"
                  name="requirements"
                  value={addForm.requirements}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Yêu cầu tham gia khóa học"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giảng viên</label>
                <select
                  name="instructorId"
                  value={addForm.instructorId}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn giảng viên --</option>
                  {instructors.map((ins) => (
                    <option key={ins.instructorId} value={ins.instructorId}>{ins.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnailUrl"
                  value={addForm.thumbnailUrl}
                  onChange={handleAddFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Link ảnh thumbnail (nếu có)"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={addForm.isActive}
                  onChange={handleAddFormChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  id="isActiveCheckbox"
                />
                <label htmlFor="isActiveCheckbox" className="text-sm font-medium">Kích hoạt khóa học</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => { setAddingCourse(false); setError(null); }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAddCourseSave}
                disabled={loading}
              >
                {loading ? 'Đang thêm...' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa khóa học */}
      {editingCourse && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa khóa học</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên khóa học</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên khóa học"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập mô tả khóa học"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nhóm tuổi</label>
                <input
                  type="text"
                  name="ageGroup"
                  value={editForm.ageGroup}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhóm tuổi phù hợp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Yêu cầu</label>
                <input
                  type="text"
                  name="requirements"
                  value={editForm.requirements}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Yêu cầu tham gia khóa học"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Giảng viên</label>
                <select
                  name="instructorId"
                  value={editForm.instructorId}
                  onChange={handleEditFormChange}
                  className="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Chọn giảng viên --</option>
                  {instructors.map((ins) => (
                    <option key={ins.instructorId} value={ins.instructorId}>{ins.fullName}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={editForm.isActive}
                  onChange={handleEditFormChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  id="isActiveCheckboxEdit"
                />
                <label htmlFor="isActiveCheckboxEdit" className="text-sm font-medium">Kích hoạt khóa học</label>
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

export default CourseManagement;
