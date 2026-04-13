import axios from 'axios';

// URL base da sua API (ajuste conforme necessário)
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const syncService = {
  /**
   * Dispara a sincronização de uma playlist no backend
   */
  startSync: async (playlistUrl: string, targetDir: string = 'data/processed/HITS') => {
    try {
      const response = await api.post('/sync/start', {
        playlist_url: playlistUrl,
        target_dir: targetDir,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
      throw error;
    }
  },

  /**
   * Checa as diferenças (delta) entre o cliente e o servidor
   */
  getDelta: async (clientManifest: any) => {
    try {
      const response = await api.post('/sync/delta', clientManifest);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar delta:', error);
      throw error;
    }
  }
};
