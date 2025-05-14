import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, FormField } from '../types';
import api from '../services/api';

const FormBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    id: '',
    title: '',
    description: '',
    status: 'draft',
    fields: [], // Initialize with empty array
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  // Ensure form.fields is always an array
  useEffect(() => {
    if (form.fields === undefined) {
      setForm(prev => ({
        ...prev,
        fields: []
      }));
    }
  }, [form.fields]);

  useEffect(() => {
    if (id) {
      // Load existing form
      api.get<Form>(`/forms/${id}`).then((response) => {
        setForm(response.data);
      }).catch(error => {
        console.error('Error loading form:', error);
      });
    }
  }, [id]);

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
    };
    setForm({ ...form, fields: [...form.fields, newField] });
  };

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...form.fields];
    newFields[index] = { ...newFields[index], ...updates };
    setForm({ ...form, fields: newFields });
  };

  const removeField = (index: number) => {
    const newFields = form.fields.filter((_, i) => i !== index);
    setForm({ ...form, fields: newFields });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/forms/${id}`, form);
      } else {
        await api.post('/forms', form);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {id ? 'Edit Form' : 'Create New Form'}
          </h1>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Form Title
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Form Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Field
            </button>
          </div>

          {form.fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white shadow sm:rounded-lg p-4 space-y-4"
            >
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Label
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    value={field.type}
                    onChange={(e) => updateField(index, { type: e.target.value as any })}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="select">Select</option>
                    <option value="textarea">Text Area</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Required
                  </label>
                  <input
                    type="checkbox"
                    className="mt-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    checked={field.required}
                    onChange={(e) => updateField(index, { required: e.target.checked })}
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeField(index)}
                    className="mt-6 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;
