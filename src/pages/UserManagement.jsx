import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2, Search, Plus } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://drugpreventionsystem.somee.com/api';

const ROLE_OPTIONS = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Manager' },
  { value: 3, label: 'Staff' },
  { value: 4, label: 'Consultant' },
  { value: 5, label: 'Member' },
];

const ADD_USER_ROLE_OPTIONS = ROLE_OPTIONS.filter(role => role.value !== 1); // Exclude Admin for adding new users

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    password: '',
    isActive: true,
    emailVerified: true,
    roleId: 3,
  });
  const [viewingUser, setViewingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [addForm, setAddForm] = useState({
    username: '',
    email: '',
    password: '',
    roleName: 'Member', // Default role
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfoString = localStorage.getItem('userInfo');
        let token = null;
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          token = userInfo.token;
        }

        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.get(`${BASE_URL}/User`, { headers: headers });
        const data = response.data;
        if (data && data.data) {
          // setUsers(data.data);
          setUsers(data.data.filter(user => user.roleId !== 1));
        } else {
          setUsers([]);
        }
      } catch (err) {
        setError('Lỗi khi tải dữ liệu người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters whenever users, searchTerm, roleFilter, or activeFilter changes
    // First sort users by createdAt and updatedAt
    const sortedUsers = [...users].sort((a, b) => {
      // Convert dates to timestamps for comparison
      const aDate = new Date(a.updatedAt || a.createdAt).getTime();
      const bDate = new Date(b.updatedAt || b.createdAt).getTime();
      // Sort in descending order (newest first)
      return bDate - aDate;
    });

    // Then apply filters
    const filtered = sortedUsers.filter(user => {
      const matchesSearch =
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        roleFilter === 'all' ? true :
          user.roleId === Number(roleFilter);

      const matchesActive =
        activeFilter === 'all' ? true :
          activeFilter === 'active' ? user.isActive :
            !user.isActive;

      return matchesSearch && matchesRole && matchesActive;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, activeFilter]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    setLoading(true);
    setError(null);
    try {
      const userInfoString = localStorage.getItem('userInfo');
      let token = null;
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        token = userInfo.token;
      }

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await axios.delete(`${BASE_URL}/User/${userId}`, { headers: headers });
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err) {
      setError('Lỗi khi xóa người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      password: '',
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      roleId: user.roleId,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setLoading(true);
    setError(null);
    try {
      const userInfoString = localStorage.getItem('userInfo');
      let token = null;
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        token = userInfo.token;
      }

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const body = {
        ...editForm,
        roleId: Number(editForm.roleId),
      };

      if (!body.password) delete body.password;
      const res = await axios.put(`${BASE_URL}/User/${editingUser.userId}`, body, { headers: headers });

      setUsers((prev) => prev.map((u) => u.userId === editingUser.userId ? res.data.data : u));
      setEditingUser(null);
    } catch (err) {
      setError('Lỗi khi cập nhật người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingUser(null);
  };

  const handleViewClick = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const userInfoString = localStorage.getItem('userInfo');
      let token = null;
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        token = userInfo.token;
      }

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`${BASE_URL}/User/${userId}`, { headers: headers });
      if (response.data && response.data.data) {
        setViewingUser(response.data.data);
      } else {
        setError('Không tìm thấy thông tin người dùng.');
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClose = () => {
    setViewingUser(null);
  };

  const handleAddNewUserClick = () => {
    setAddingUser(true);
    setAddForm({
      username: '',
      email: '',
      password: '',
      roleName: 'Member',
    });
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddUserSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const userInfoString = localStorage.getItem('userInfo');
      let token = null;
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        token = userInfo.token;
      }

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await axios.post(`${BASE_URL}/User/admin/Create-user`, addForm, { headers: headers });
      if (res.data && res.data.data) {
        const response = await axios.get(`${BASE_URL}/User`, { headers: headers }); // Re-fetch all users after adding
        if (response.data && response.data.data) {
          setUsers(response.data.data);
        }
      } else {
        setError(res.data.messages?.[0] || 'Lỗi khi thêm người dùng.');
      }
      setAddingUser(false);
    } catch (err) {
      setError('Lỗi khi thêm người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCancel = () => {
    setAddingUser(false);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600 mt-1">Xem thông tin và quản lý tất cả người dùng trên hệ thống</p>
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
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-34 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả vai trò</option>
              {/* {ROLE_OPTIONS.map(role => ( */}
              {ROLE_OPTIONS.filter(role => role.value !== 1).map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            {/* Active Status Filter */}
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="block w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNewUserClick}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm người dùng
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email Verified</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated At</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ROLE_OPTIONS.find(r => r.value === user.roleId)?.label || user.roleName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.isActive ? '✔️' : '❌'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.emailVerified ? '✔️' : '❌'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 rounded hover:bg-blue-50 text-blue-600" title="Xem thông tin" onClick={() => handleViewClick(user.userId)}>
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded hover:bg-amber-50 text-amber-500" title="Sửa thông tin" onClick={() => handleEditClick(user)}>
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded hover:bg-red-50 text-red-500" title="Xóa người dùng" onClick={() => handleDeleteUser(user.userId)}>
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

      {/* Form chỉnh sửa user */}
      {editingUser && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input type="text" name="username" value={editForm.username} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value={editForm.email} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password (để trống nếu không đổi)</label>
                <input type="password" name="password" value={editForm.password} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select name="roleId" value={editForm.roleId} onChange={handleEditFormChange} className="w-full border rounded px-3 py-2">
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isActive" checked={editForm.isActive} onChange={handleEditFormChange} /> Active
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="emailVerified" checked={editForm.emailVerified} onChange={handleEditFormChange} /> Email Verified
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleEditCancel}>Hủy</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleEditSave}>Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết user */}
      {viewingUser && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Thông tin người dùng</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>User ID:</strong> {viewingUser.userId}</p>
              <p><strong>Username:</strong> {viewingUser.username}</p>
              <p><strong>Email:</strong> {viewingUser.email}</p>
              <p><strong>Role:</strong> {ROLE_OPTIONS.find(r => r.value === viewingUser.roleId)?.label || viewingUser.roleName}</p>
              <p><strong>Active:</strong> {viewingUser.isActive ? '✔️' : '❌'}</p>
              <p><strong>Email Verified:</strong> {viewingUser.emailVerified ? '✔️' : '❌'}</p>
              <p><strong>Created At:</strong> {viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleString() : '-'}</p>
              <p><strong>Updated At:</strong> {viewingUser.updatedAt ? new Date(viewingUser.updatedAt).toLocaleString() : '-'}</p>
              <p><strong>Last Login:</strong> {viewingUser.lastLogin ? new Date(viewingUser.lastLogin).toLocaleString() : '-'}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleViewClose}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm người dùng */}
      {addingUser && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 to-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm người dùng mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input type="text" name="username" value={addForm.username} onChange={handleAddFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value={addForm.email} onChange={handleAddFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input type="password" name="password" value={addForm.password} onChange={handleAddFormChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select name="roleName" value={addForm.roleName} onChange={handleAddFormChange} className="w-full border rounded px-3 py-2">
                  {ADD_USER_ROLE_OPTIONS.map((role) => (
                    <option key={role.value} value={role.label}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={handleAddCancel}>Hủy</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleAddUserSave}>Thêm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;