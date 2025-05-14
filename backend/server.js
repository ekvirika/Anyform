const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;

// In-memory storage for forms (in a real app, use a database)
let forms = [];

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  console.log('Register request:', req.body);
  // TODO: Add actual registration logic
  res.status(201).json({ message: 'User registered successfully' });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  // TODO: Add actual login logic
  res.json({ token: 'sample-jwt-token', user: { id: '1', email: req.body.email } });
});

// Form routes
app.get('/api/forms', (req, res) => {
  res.json(forms);
});

app.get('/api/forms/:id', (req, res) => {
  const form = forms.find(f => f.id === req.params.id);
  if (!form) {
    return res.status(404).json({ message: 'Form not found' });
  }
  res.json(form);
});

app.post('/api/forms', (req, res) => {
  const newForm = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  forms.push(newForm);
  res.status(201).json(newForm);
});

app.put('/api/forms/:id', (req, res) => {
  const index = forms.findIndex(f => f.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Form not found' });
  }
  
  const updatedForm = {
    ...forms[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  
  forms[index] = updatedForm;
  res.json(updatedForm);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
