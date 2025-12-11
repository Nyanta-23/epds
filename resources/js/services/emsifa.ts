import axios from 'axios';

const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export interface Region {
  id: string;
  name: string;
}

export const emsifaService = {
  getProvinces: async (): Promise<Region[]> => {
    const response = await axios.get<Region[]>(`${BASE_URL}/provinces.json`);
    return response.data;
  },

  getRegencies: async (provinceId: string): Promise<Region[]> => {
    const response = await axios.get<Region[]>(`${BASE_URL}/regencies/${provinceId}.json`);
    return response.data;
  },

  getDistricts: async (regencyId: string): Promise<Region[]> => {
    const response = await axios.get<Region[]>(`${BASE_URL}/districts/${regencyId}.json`);
    return response.data;
  },

  getVillages: async (districtId: string): Promise<Region[]> => {
    const response = await axios.get<Region[]>(`${BASE_URL}/villages/${districtId}.json`);
    return response.data;
  }
};