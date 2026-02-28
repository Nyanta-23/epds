import axios from 'axios';

const BASE_URL = '/region';

export interface Region {
    id: string;
    name: string;
}

interface WilayahResponse {
    data: { code: string; name: string }[];
}

const mapRegion = (item: { code: string; name: string }): Region => ({
    id: item.code,
    name: item.name,
});

export const emsifaService = {
    getProvinces: async (): Promise<Region[]> => {
        const response = await axios.get<WilayahResponse>(
            `${BASE_URL}/provinces`,
        );
        return response.data.data.map(mapRegion);
    },

    getRegencies: async (provinceId: string): Promise<Region[]> => {
        const response = await axios.get<WilayahResponse>(
            `${BASE_URL}/regencies/${provinceId}`,
        );
        return response.data.data.map(mapRegion);
    },

    getDistricts: async (regencyId: string): Promise<Region[]> => {
        const response = await axios.get<WilayahResponse>(
            `${BASE_URL}/districts/${regencyId}`,
        );
        return response.data.data.map(mapRegion);
    },

    getVillages: async (districtId: string): Promise<Region[]> => {
        const response = await axios.get<WilayahResponse>(
            `${BASE_URL}/villages/${districtId}`,
        );
        return response.data.data.map(mapRegion);
    },
};
