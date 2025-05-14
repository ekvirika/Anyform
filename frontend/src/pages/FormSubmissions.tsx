import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, FormSubmission } from '../types';
import api from '../services/api';

const FormSubmissions: React.FC = () => {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse, submissionsResponse] = await Promise.all([
          api.get<Form>(`/forms/${id}`),
          api.get<FormSubmission[]>(`/forms/${id}/submissions`),
        ]);
        setForm(formResponse.data);
        setSubmissions(submissionsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{form.title} - Submissions</h1>
        <p className="mt-2 text-gray-600">{form.description}</p>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-500">Share your form to start collecting responses!</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submission Date
                </th>
                {form.fields.map((field) => (
                  <th
                    key={field.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                  {form.fields.map((field) => (
                    <td
                      key={field.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {submission.data[field.id]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormSubmissions;
