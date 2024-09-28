import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    check: '',
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/auth/register', formData);
      fetchUsers(); // Fetch users after successful registration
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Error registering user');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/auth/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
        setError('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
    <div className="container mx-auto">
      <h2 className="text-2xl font-login font-bold mb-4 text-center">Register User</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">First Name</label>
          <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="block w-[300px] mt-2 ml-4 p-2  rounded mb-4 focus:ring-darkgray border-1 focus:border-darkgray" />
        </div>

        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">Last Name</label>
          <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="block w-[300px] mt-2 ml-4 p-2 focus:ring-darkgray border-1 focus:border-darkgray rounded mb-4" />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">Email</label>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="block w-[300px] mt-2 ml-4 p-2 focus:ring-darkgray border-1 focus:border-darkgray rounded mb-4" />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">Password</label>
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="block w-[300px] mt-2 ml-4 p-2 focus:ring-darkgray border-1 focus:border-darkgray rounded mb-4" />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">Phone Number</label>
          <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="block w-[300px] mt-2 ml-4 p-2 focus:ring-darkgray border-1 focus:border-darkgray rounded mb-4" />
        </div>
        <div className="border-2 w-full sm:w-[500px] h-full rounded-lg mt-3 shadow-sm shadow-darkgray">
          <label className="block text-lg font-login ml-4 mt-4 text-gray-700">Check</label>
          <select name="check" value={formData.check} onChange={handleChange} required className="block w-[300px] mt-2 ml-4 p-2 focus:ring-darkgray border-1 focus:border-darkgray rounded mb-4">
            <option value="" disabled>Select an option</option>
            <option value="Account">Account</option>
            <option value="Grey">Grey</option>
            <option value="Heat">Heat</option>
            <option value="Process">Process</option>
            <option value="Finish">Finish</option>
            <option value="Dispatch">Dispatch</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="inline-flex mt-6 px-12 py-2 text-sm font-medium text-white bg-darkgray rounded-md hover:bg-white hover:text-darkgray outline">Register</button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <h2 className="text-2xl font-bold mt-8 mb-4">Registered Users</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.isArray(users) && users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.check}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default RegisterUser;
