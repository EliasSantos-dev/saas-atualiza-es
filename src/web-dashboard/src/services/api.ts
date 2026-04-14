import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  }
};

export const profileService = {
  list: async () => {
    const response = await api.get('/profiles/');
    return response.data;
  },
  update: async (id: string, data: { auto_update?: boolean; source_url?: string }) => {
    const response = await api.patch(`/profiles/${id}`, data);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/profiles/', data);
    return response.data;
  }
};

export const configService = {
  get: async (profileId: string) => {
    const response = await api.get(`/config/${profileId}`);
    return response.data;
  },
  update: async (profileId: string, data: any) => {
    const response = await api.put(`/config/${profileId}`, data);
    return response.data;
  }
};

export const snapshotService = {
  getLatest: async (profileId: string) => {
    const response = await api.get(`/snapshots/${profileId}/latest`);
    return response.data;
  },
  generateMaster: async () => {
    // Esse endpoint não existe formalmente ainda na API, 
    // mas vamos simular o disparo de um script ou rota administrativa
    const response = await api.post(`/snapshots/generate-master`);
    return response.data;
  }
};

export const engineService = {
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};
