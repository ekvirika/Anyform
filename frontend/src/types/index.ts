export interface User {
  id: string;
  email: string;
  name: string;
}

export type FormStatus = 'draft' | 'published' | 'archived';

export interface Form {
  id: string;
  title: string;
  description: string;
  status: FormStatus;
  fields: FormField[]; // Required, defaults to empty array
  createdAt: string;
  updatedAt: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea';
  label: string;
  required: boolean;
  options?: string[]; // For select fields
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
}
