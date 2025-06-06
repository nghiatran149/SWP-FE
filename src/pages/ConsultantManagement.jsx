import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const consultants = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    dob: '1990-01-01',
    certificate: 'Thạc sĩ Tâm lý học, Chứng chỉ Tư vấn nghiện chất gây nghiện',
    schedule: 'Thứ 2-6, 8:00-17:00',
    specialty: 'Tư vấn cá nhân, Liệu pháp nhóm',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    phone: '0987654321',
    dob: '1992-05-12',
    certificate: 'Chuyên viên phòng ngừa chất gây nghiện',
    schedule: 'Thứ 3-7, 9:00-18:00',
    specialty: 'Tư vấn cá nhân',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    phone: '0909123456',
    dob: '1988-09-23',
    certificate: 'Chuyên gia hỗ trợ cai nghiện cộng đồng',
    schedule: 'Thứ 2-6, 7:30-16:30',
    specialty: 'Liệu pháp nhóm',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    phone: '0934567890',
    dob: '1995-12-30',
    certificate: 'Thạc sĩ Tâm lý học, Chứng chỉ Tư vấn nghiện chất gây nghiện',
    schedule: 'Thứ 2-7, 8:00-17:00',
    specialty: 'Tư vấn cá nhân, Liệu pháp nhóm',
  },
];

const ConsultantManagement = () => {
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Họ và Tên</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SĐT</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày sinh</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider max-w-xl">Chứng chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Lịch làm việc</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chuyên môn</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {consultants.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.dob}</td>
                  <td className="px-6 py-4 max-w-xl text-sm text-gray-900 break-words">{consultant.certificate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.schedule}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{consultant.specialty}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 rounded hover:bg-blue-50 text-blue-600" title="Xem thông tin">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded hover:bg-amber-50 text-amber-500" title="Sửa thông tin">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button className="p-2 rounded hover:bg-red-50 text-red-500" title="Xóa người dùng">
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