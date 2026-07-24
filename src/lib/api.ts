const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth
  login: (data: { username: string; password: string }) =>
    fetch(`${API_BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json()),

  setup: () =>
    fetch(`${API_BASE}/admin/setup`, { method: 'POST' }).then(r => r.json()),

  // Hero
  getHero: () => fetch(`${API_BASE}/hero`).then(r => r.json()),
  updateHero: (formData: FormData, token: string) =>
    fetch(`${API_BASE}/hero`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),

  // Projects
  getProjects: () => fetch(`${API_BASE}/projects`).then(r => r.json()),
  createProject: (formData: FormData, token: string) =>
    fetch(`${API_BASE}/projects`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),
  updateProject: (id: number, formData: FormData, token: string) =>
    fetch(`${API_BASE}/projects/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),
  deleteProject: (id: number, token: string) =>
    fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),

  // Experiences
  getExperiences: () => fetch(`${API_BASE}/experiences`).then(r => r.json()),
  createExperience: (formData: FormData, token: string) =>
    fetch(`${API_BASE}/experiences`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),
  updateExperience: (id: number, formData: FormData, token: string) =>
    fetch(`${API_BASE}/experiences/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),
  deleteExperience: (id: number, token: string) =>
    fetch(`${API_BASE}/experiences/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),

  // Skills
  getSkills: () => fetch(`${API_BASE}/skills`).then(r => r.json()),
  createSkill: (data: object, token: string) =>
    fetch(`${API_BASE}/skills`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }).then(r => r.json()),
  updateSkill: (id: number, data: object, token: string) =>
    fetch(`${API_BASE}/skills/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteSkill: (id: number, token: string) =>
    fetch(`${API_BASE}/skills/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),

  // Certifications
  getCertifications: () => fetch(`${API_BASE}/certifications`).then(r => r.json()),
  createCertification: (formData: FormData, token: string) =>
    fetch(`${API_BASE}/certifications`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),
  updateCertification: (id: number, formData: FormData, token: string) =>
    fetch(`${API_BASE}/certifications/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),
  deleteCertification: (id: number, token: string) =>
    fetch(`${API_BASE}/certifications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),

  // Custom Sections
  getCustomSections: () => fetch(`${API_BASE}/custom-sections`).then(r => r.json()),
  createCustomSection: (data: object, token: string) =>
    fetch(`${API_BASE}/custom-sections`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }).then(r => r.json()),
  updateCustomSection: (id: number, data: object, token: string) =>
    fetch(`${API_BASE}/custom-sections/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) }).then(r => r.json()),
  deleteCustomSection: (id: number, token: string) =>
    fetch(`${API_BASE}/custom-sections/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),

  // Upload
  uploadImage: (formData: FormData, token: string) =>
    fetch(`${API_BASE}/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }).then(r => r.json()),
};

export const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
