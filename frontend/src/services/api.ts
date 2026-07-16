const API_URL = 'http://localhost:3000/api';

export const mergePdfs = async (files: File[]): Promise<Blob> => {
  const formData = new FormData();
  files.forEach(file => formData.append('pdfs', file));

  const response = await fetch(`${API_URL}/pdf/merge`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Gagal menggabungkan PDF');
  return await response.blob();
};

export const splitPdf = async (file: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch(`${API_URL}/pdf/split`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Gagal memisahkan PDF');
  return await response.blob();
};

export const resizeImage = async (file: File, width: number, format: string): Promise<Blob> => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('width', width.toString());
  formData.append('format', format);

  const response = await fetch(`${API_URL}/image/resize`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Gagal memproses gambar');
  return await response.blob();
};

export const convertDocument = async (file: File, type: 'word-to-pdf' | 'pdf-to-word'): Promise<Blob> => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await fetch(`${API_URL}/convert/${type}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Gagal mengkonversi dokumen');
  }
  return await response.blob();
};

export const securePdf = async (file: File, password: string, action: 'encrypt' | 'decrypt'): Promise<Blob> => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('password', password);

  const response = await fetch(`${API_URL}/pdf/${action}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || `Gagal melakukan ${action}`);
  }
  return await response.blob();
};