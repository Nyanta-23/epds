import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectLocationProps {
  value: {
    province: string;
    province_id?: string;
    city_or_district: string;
    city_or_district_id?: string;
    subdistrict: string;
    subdistrict_id?: string;
    village: string;
    village_id?: string;
  }
  onChange: (value: SelectLocationProps["value"]) => void;
  errors?: Record<string, string | undefined>;
  identityErrorClassName?: (field: string) => string;
}

export default function SelectLocationApi({
  value,
  onChange,
  errors = {},
  identityErrorClassName = () => "",
}: SelectLocationProps) {
  const apiLocation = import.meta.env.VITE_API_LOCATION

  const [provinces, setProvinces] = useState<any[]>([])
  const [regencies, setRegencies] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])

  const [loading, setLoading] = useState({
    provinces: false,
    regencies: false,
    districts: false,
    villages: false,
  })

  // Fetch provinces
  useEffect(() => {
    setLoading((p) => ({ ...p, provinces: true }))
    fetch(`${apiLocation}/provinces.json`)
      .then((res) => res.json())
      .then(setProvinces)
      .finally(() => setLoading((p) => ({ ...p, provinces: false })))
  }, [])

  // Fetch regencies
  useEffect(() => {
    if (!value.province_id) {
      setRegencies([])
      return
    }
    setLoading((p) => ({ ...p, regencies: true }))
    fetch(`${apiLocation}/regencies/${value.province_id}.json`)
      .then((res) => res.json())
      .then(setRegencies)
      .finally(() => setLoading((p) => ({ ...p, regencies: false })))
  }, [value.province_id])

  // Fetch districts
  useEffect(() => {
    if (!value.city_or_district_id) {
      setDistricts([])
      return
    }
    setLoading((p) => ({ ...p, districts: true }))
    fetch(`${apiLocation}/districts/${value.city_or_district_id}.json`)
      .then((res) => res.json())
      .then(setDistricts)
      .finally(() => setLoading((p) => ({ ...p, districts: false })))
  }, [value.city_or_district_id])

  // Fetch villages
  useEffect(() => {
    if (!value.subdistrict_id) {
      setVillages([])
      return
    }
    setLoading((p) => ({ ...p, villages: true }))
    fetch(`${apiLocation}/villages/${value.subdistrict_id}.json`)
      .then((res) => res.json())
      .then(setVillages)
      .finally(() => setLoading((p) => ({ ...p, villages: false })))
  }, [value.subdistrict_id])

  // Handlers
  function handleProvinceChange(id: string) {
    const province = provinces.find((p) => p.id === id)
    onChange({
      province_id: id,
      province: province?.name || "",
      city_or_district_id: "",
      city_or_district: "",
      subdistrict_id: "",
      subdistrict: "",
      village_id: "",
      village: "",
    })
  }

  function handleRegencyChange(id: string) {
    const regency = regencies.find((r) => r.id === id)
    onChange({
      ...value,
      city_or_district_id: id,
      city_or_district: regency?.name || "",
      subdistrict_id: "",
      subdistrict: "",
      village_id: "",
      village: "",
    })
  }

  function handleDistrictChange(id: string) {
    const district = districts.find((d) => d.id === id)
    onChange({
      ...value,
      subdistrict_id: id,
      subdistrict: district?.name || "",
      village_id: "",
      village: "",
    })
  }

  function handleVillageChange(id: string) {
    const village = villages.find((v) => v.id === id)
    onChange({
      ...value,
      village_id: id,
      village: village?.name || "",
    })
  }

  return (
    <div className="grid gap-4">
      {/* Provinsi */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Provinsi <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={handleProvinceChange}
          value={value.province_id || ""}
          disabled={loading.provinces}
        >
          <SelectTrigger className={`${identityErrorClassName("province")} cursor-pointer`}>
            <SelectValue placeholder="Pilih provinsi" />
          </SelectTrigger>
          <SelectContent>
            {provinces.map((p) => (
              <SelectItem className={"cursor-pointer"} key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.province && (
          <p className="mt-1 text-sm text-red-500">{errors.province}</p>
        )}
      </div>

      {/* Kabupaten / Kota */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Kabupaten / Kota <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={handleRegencyChange}
          value={value.city_or_district_id || ""}
          disabled={!value.province_id || loading.regencies}
        >
          <SelectTrigger className={`${identityErrorClassName("city_or_district")} cursor-pointer`}>
            <SelectValue placeholder="Pilih kabupaten / kota" />
          </SelectTrigger>
          <SelectContent>
            {regencies.map((r) => (
              <SelectItem className={"cursor-pointer"} key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.city_or_district && (
          <p className="mt-1 text-sm text-red-500">{errors.city_or_district}</p>
        )}
      </div>

      {/* Kecamatan */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Kecamatan <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={handleDistrictChange}
          value={value.subdistrict_id || ""}
          disabled={!value.city_or_district_id || loading.districts}
        >
          <SelectTrigger className={`${identityErrorClassName("subdistrict")} cursor-pointer`}>
            <SelectValue placeholder="Pilih kecamatan" />
          </SelectTrigger>
          <SelectContent>
            {districts.map((d) => (
              <SelectItem className={"cursor-pointer"} key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.subdistrict && (
          <p className="mt-1 text-sm text-red-500">{errors.subdistrict}</p>
        )}
      </div>

      {/* Desa / Kelurahan */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Desa / Kelurahan <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={handleVillageChange}
          value={value.village_id || ""}
          disabled={!value.subdistrict_id || loading.villages}
        >
          <SelectTrigger className={`${identityErrorClassName("village")} cursor-pointer`}>
            <SelectValue placeholder="Pilih desa / kelurahan" />
          </SelectTrigger>
          <SelectContent>
            {villages.map((v) => (
              <SelectItem className={"cursor-pointer"} key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.village && (
          <p className="mt-1 text-sm text-red-500">{errors.village}</p>
        )}
      </div>
    </div>
  )
}
