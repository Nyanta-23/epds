import { useState, useEffect } from 'react';
import { emsifaService, Region } from '@/services/emsifa';

export function useRegion() {
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(true);
      try {
        const data = await emsifaService.getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Gagal memuat provinsi", error);
      } finally {
        setLoading(false);
      }
    };
    loadProvinces();
  }, []);

  const onProvinceChange = async (provinceId: string) => {
    setCities([]);
    setDistricts([]);
    setVillages([]);
    
    if (!provinceId) return;

    setLoading(true);
    try {
      const data = await emsifaService.getRegencies(provinceId);
      setCities(data);
    } finally {
      setLoading(false);
    }
  };

  const onCityChange = async (cityId: string) => {
    setDistricts([]);
    setVillages([]);

    if (!cityId) return;

    setLoading(true);
    try {
      const data = await emsifaService.getDistricts(cityId);
      setDistricts(data);
    } finally {
      setLoading(false);
    }
  };

  const onDistrictChange = async (districtId: string) => {
    setVillages([]);

    if (!districtId) return;

    setLoading(true);
    try {
      const data = await emsifaService.getVillages(districtId);
      setVillages(data);
    } finally {
      setLoading(false);
    }
  };

  return {
    regions: { provinces, cities, districts, villages },
    handlers: { onProvinceChange, onCityChange, onDistrictChange },
    loading
  };
}