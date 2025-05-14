import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from '../types';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Ensure forms have fields array
  const safeForms = forms.map(form => ({
    ...form,
    fields: form.fields || []
  }));

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await api.get<Form[]>('/forms');
        // Ensure each form has a fields array
        const formsWithFields = response.data.map(form => ({
          ...form,
          fields: form.fields || []
        }));
        setForms(formsWithFields);
      } catch (error) {
        console.error('Error fetching forms:', error);
        // Optionally handle the error in the UI
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/forms/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Form
        </Link>
      </div>

      {safeForms.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
          <p className="text-gray-500">Get started by creating a new form</p>
          <div className="mt-6">
            <Link
              to="/forms/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Form
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeForms.map((form) => (
            <div
              key={form.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {form.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {form.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {form.description || 'No description'}
                </p>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    {form.fields.length > 0 ? `${form.fields.length} fields` : 'No fields yet'}
                  </p>
                </div>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex space-x-3">
                  <Link
                    to={`/forms/${form.id}/edit`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/forms/${form.id}/submissions`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Submissions
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
