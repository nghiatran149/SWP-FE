import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const BASE_URL = 'https://drugpreventionsystem-hwgecaa9ekasgngf.southeastasia-01.azurewebsites.net/api';

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          
          // Create a map of user data for easy lookup
          const userMap = new Map(consultantUsers.map(user => [user.userId, user]));
          
          // Combine consultant and user data
          const combinedData = consultantsData.data.map(consultant => ({
            ...consultant,
            userInfo: userMap.get(consultant.userId) || null
          }));

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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qualifications</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Consultation Fee</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Working Hours</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Consultations</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {consultants.map((consultant) => (
                <tr key={consultant.consultantId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.userInfo?.username || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.userInfo?.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.licenseNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.specialization || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.yearsOfExperience || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.qualifications || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.consultationFee || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${consultant.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {consultant.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.workingHours || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.rating || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.totalConsultations}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${consultant.userInfo?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {consultant.userInfo?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 rounded hover:bg-blue-50 text-blue-600" title="View details">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded hover:bg-amber-50 text-amber-500" title="Edit">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded hover:bg-red-50 text-red-500" title="Delete">
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
    </>
  );
};

export default ConsultantManagement;