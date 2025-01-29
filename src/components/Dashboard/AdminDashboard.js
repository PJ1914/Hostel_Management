import React, { useState, useEffect } from 'react';
import { getUsers, updateUserStatus } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    activeRooms: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getUsers();
      console.log('Students response:', response.data); // Debug log
      
      if (response.data && response.data.students) {
        const studentData = response.data.students;
        setStudents(studentData);
        setStats({
          total: studentData.length,
          activeRooms: studentData.filter(s => s.roomNumber && s.status === 'active').length,
          pendingPayments: studentData.filter(s => s.isFeePending).length
        });
      } else {
        setError('Invalid data format received from server');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err); // Debug log
      setError(err.response?.data?.message || 'Failed to fetch students');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (studentId, newStatus) => {
    try {
      await updateUserStatus(studentId, newStatus);
      // Refresh student list
      fetchStudents();
    } catch (err) {
      setError('Failed to update student status');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'pending') return matchesSearch && student.isFeePending;
    return matchesSearch && student.status === filterStatus;
  });

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-box">
            <h3>Total Students</h3>
            <p>{stats.total}</p>
          </div>
          <div className="stat-box">
            <h3>Active Rooms</h3>
            <p>{stats.activeRooms}</p>
          </div>
          <div className="stat-box">
            <h3>Pending Payments</h3>
            <p>{stats.pendingPayments}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Students</option>
          <option value="active">Active</option>
          <option value="pending">Fee Pending</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="students-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Room</th>
                <th>Joining Date</th>
                <th>Contact</th>
                <th>Fee Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student._id} className={student.status === 'inactive' ? 'inactive-row' : ''}>
                  <td>
                    <div className="student-name">
                      <span>{student.name}</span>
                      <small>{student.email}</small>
                    </div>
                  </td>
                  <td>{student.roomNumber || 'Not Assigned'}</td>
                  <td>{new Date(student.joiningDate).toLocaleDateString()}</td>
                  <td>
                    <div className="contact-info">
                      <div>{student.phoneNumber}</div>
                      <small>{student.parentPhoneNumber}</small>
                    </div>
                  </td>
                  <td>
                    <div className={`fee-status ${student.isFeePending ? 'overdue' : 'current'}`}>
                      {student.isFeePending ? 'Overdue' : 'Current'}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {student.status !== 'active' && (
                        <button 
                          onClick={() => handleStatusUpdate(student._id, 'active')}
                          className="action-btn approve"
                        >
                          Activate
                        </button>
                      )}
                      {student.status !== 'inactive' && (
                        <button 
                          onClick={() => handleStatusUpdate(student._id, 'inactive')}
                          className="action-btn reject"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 