import { ButtonConfirmation } from '@/components/button-confirmation';
import MainHeader from '@/components/main/main-header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableEmpty,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { emsifaService, Region } from '@/services/emsifa';
import { type BreadcrumbItem } from '@/types';
import { Facility, FacilityType } from '@/types/resource';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';

interface FacilityPageProps {
    facilities: Facility[];
    facility_types: FacilityType[];
}

type FacilityFields = {
    name: string;
    facility_type_id: string;
    parent_id: string;
    province_id: string;
    regency_id: string;
    district_id: string;
    village_id: string;
};

const emptyFacility: FacilityFields = {
    name: '',
    facility_type_id: '',
    parent_id: '',
    province_id: '',
    regency_id: '',
    district_id: '',
    village_id: '',
};

export default function FacilityPage({
    facilities,
    facility_types,
}: FacilityPageProps) {
    const [activeTab, setActiveTab] = useState<'facilities' | 'types'>(
        'facilities',
    );
    const [search, setSearch] = useState('');
    const [facilityDialogOpen, setFacilityDialogOpen] = useState(false);
    const [typeDialogOpen, setTypeDialogOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(
        null,
    );
    const [editingType, setEditingType] = useState<FacilityType | null>(null);
    const [regionError, setRegionError] = useState('');
    const [regions, setRegions] = useState<{
        provinces: Region[];
        regencies: Region[];
        districts: Region[];
        villages: Region[];
    }>({
        provinces: [],
        regencies: [],
        districts: [],
        villages: [],
    });
    const facilityForm = useForm<FacilityFields>(emptyFacility);
    const typeForm = useForm({ name: '' });
    const { errors: pageErrors } = usePage().props as {
        errors: Record<string, string>;
    };

    useEffect(() => {
        emsifaService
            .getProvinces()
            .then((provinces) =>
                setRegions((current) => ({ ...current, provinces })),
            )
            .catch(() =>
                setRegionError(
                    'Wilayah tidak dapat dimuat. Muat ulang halaman dan coba lagi.',
                ),
            );
    }, []);

    useEffect(() => {
        if (!editingFacility) return;
        let active = true;

        const loadRegions = async () => {
            try {
                const regencies = await emsifaService.getRegencies(
                    editingFacility.province_id,
                );
                const districts = await emsifaService.getDistricts(
                    editingFacility.regency_id,
                );
                const villages = await emsifaService.getVillages(
                    editingFacility.district_id,
                );
                if (active)
                    setRegions((current) => ({
                        ...current,
                        regencies,
                        districts,
                        villages,
                    }));
            } catch {
                if (active)
                    setRegionError(
                        'Wilayah fasilitas tidak dapat dimuat. Coba lagi.',
                    );
            }
        };

        loadRegions();
        return () => {
            active = false;
        };
    }, [editingFacility]);

    const filteredFacilities = useMemo(
        () =>
            facilities.filter((facility) =>
                `${facility.name} ${facility.facility_type?.name ?? ''} ${facility.village ?? ''}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [facilities, search],
    );
    const filteredTypes = useMemo(
        () =>
            facility_types.filter((type) =>
                type.name.toLowerCase().includes(search.toLowerCase()),
            ),
        [facility_types, search],
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Fasilitas', href: '/facility' },
    ];

    const openFacilityForm = (facility?: Facility) => {
        setEditingFacility(facility ?? null);
        setRegionError('');
        facilityForm.clearErrors();
        facilityForm.setData(
            facility
                ? {
                      name: facility.name,
                      facility_type_id: facility.facility_type_id,
                      parent_id: facility.parent_id ?? '',
                      province_id: String(facility.province_id),
                      regency_id: String(facility.regency_id),
                      district_id: String(facility.district_id),
                      village_id: String(facility.village_id),
                  }
                : emptyFacility,
        );
        setRegions((current) => ({
            ...current,
            regencies: [],
            districts: [],
            villages: [],
        }));
        setFacilityDialogOpen(true);
    };

    const submitFacility = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errors: Record<string, string> = {};
        if (!facilityForm.data.name.trim())
            errors.name = 'Nama fasilitas wajib diisi.';
        if (facilityForm.data.name.length > 200)
            errors.name = 'Nama maksimal 200 karakter.';
        if (!facilityForm.data.facility_type_id)
            errors.facility_type_id = 'Pilih jenis fasilitas.';
        if (
            !facilityForm.data.province_id ||
            !facilityForm.data.regency_id ||
            !facilityForm.data.district_id ||
            !facilityForm.data.village_id
        ) {
            errors.village_id =
                'Lengkapi pilihan wilayah sampai desa/kelurahan.';
        }
        if (Object.keys(errors).length) {
            facilityForm.setError(errors);
            return;
        }

        const options = {
            preserveScroll: true,
            onSuccess: () => setFacilityDialogOpen(false),
        };
        if (editingFacility)
            facilityForm.put(
                route('facility.update', editingFacility.id),
                options,
            );
        else facilityForm.post(route('facility.store'), options);
    };

    const submitType = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!typeForm.data.name.trim() || typeForm.data.name.length > 40) {
            typeForm.setError(
                'name',
                !typeForm.data.name.trim()
                    ? 'Nama jenis fasilitas wajib diisi.'
                    : 'Nama maksimal 40 karakter.',
            );
            return;
        }
        const options = {
            preserveScroll: true,
            onSuccess: () => setTypeDialogOpen(false),
        };
        if (editingType)
            typeForm.put(
                route('facility.type.update', editingType.id),
                options,
            );
        else typeForm.post(route('facility.type.store'), options);
    };

    const chooseProvince = async (province_id: string) => {
        facilityForm.setData((current) => ({
            ...current,
            province_id,
            regency_id: '',
            district_id: '',
            village_id: '',
        }));
        try {
            const regencies = province_id
                ? await emsifaService.getRegencies(province_id)
                : [];
            setRegions((current) => ({
                ...current,
                regencies,
                districts: [],
                villages: [],
            }));
            setRegionError('');
        } catch {
            setRegionError(
                'Kabupaten/kota tidak dapat dimuat. Coba pilih provinsi lagi.',
            );
        }
    };
    const chooseRegency = async (regency_id: string) => {
        facilityForm.setData((current) => ({
            ...current,
            regency_id,
            district_id: '',
            village_id: '',
        }));
        try {
            const districts = regency_id
                ? await emsifaService.getDistricts(regency_id)
                : [];
            setRegions((current) => ({ ...current, districts, villages: [] }));
            setRegionError('');
        } catch {
            setRegionError(
                'Kecamatan tidak dapat dimuat. Coba pilih kabupaten/kota lagi.',
            );
        }
    };
    const chooseDistrict = async (district_id: string) => {
        facilityForm.setData((current) => ({
            ...current,
            district_id,
            village_id: '',
        }));
        try {
            const villages = district_id
                ? await emsifaService.getVillages(district_id)
                : [];
            setRegions((current) => ({ ...current, villages }));
            setRegionError('');
        } catch {
            setRegionError(
                'Desa/kelurahan tidak dapat dimuat. Coba pilih kecamatan lagi.',
            );
        }
    };

    const title = 'Manajemen Fasilitas';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <MainHeader
                    subtitle={title}
                    desc="Kelola jenis dan data fasilitas layanan kesehatan."
                />
                {Object.entries(pageErrors ?? {}).map(([key, message]) => (
                    <p
                        key={key}
                        role="alert"
                        className="text-sm text-destructive"
                    >
                        {message}
                    </p>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-2">
                        <Button
                            variant={
                                activeTab === 'facilities'
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => {
                                setActiveTab('facilities');
                                setSearch('');
                            }}
                        >
                            Fasilitas ({facilities.length})
                        </Button>
                        <Button
                            variant={
                                activeTab === 'types' ? 'default' : 'outline'
                            }
                            onClick={() => {
                                setActiveTab('types');
                                setSearch('');
                            }}
                        >
                            Jenis Fasilitas ({facility_types.length})
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari..."
                            className="w-56"
                        />
                        <Button
                            onClick={() => {
                                if (activeTab === 'types') {
                                    setEditingType(null);
                                    typeForm.reset();
                                    typeForm.clearErrors();
                                    setTypeDialogOpen(true);
                                } else {
                                    openFacilityForm();
                                }
                            }}
                        >
                            <Plus /> Tambah
                        </Button>
                    </div>
                </div>

                {activeTab === 'facilities' ? (
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama fasilitas</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Wilayah</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFacilities.length === 0 ? (
                                    <TableEmpty colSpan={4} />
                                ) : (
                                    filteredFacilities.map((facility) => (
                                        <TableRow key={facility.id}>
                                            <TableCell className="font-medium">
                                                {facility.name}
                                            </TableCell>
                                            <TableCell>
                                                {facility.facility_type?.name ??
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {[
                                                    facility.village,
                                                    facility.district,
                                                    facility.regency,
                                                    facility.province,
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            openFacilityForm(
                                                                facility,
                                                            )
                                                        }
                                                        aria-label={`Edit ${facility.name}`}
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                    <ButtonConfirmation
                                                        content={{
                                                            title: 'Hapus fasilitas?',
                                                            description:
                                                                'Fasilitas akan dihapus secara lunak. Penghapusan ditolak jika masih memiliki pengguna atau fasilitas turunan.',
                                                        }}
                                                        onConfirm={() =>
                                                            router.delete(
                                                                route(
                                                                    'facility.destroy',
                                                                    facility.id,
                                                                ),
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            aria-label={`Hapus ${facility.name}`}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </ButtonConfirmation>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama jenis fasilitas</TableHead>
                                    <TableHead className="text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTypes.length === 0 ? (
                                    <TableEmpty colSpan={2} />
                                ) : (
                                    filteredTypes.map((type) => (
                                        <TableRow key={type.id}>
                                            <TableCell className="font-medium">
                                                {type.name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setEditingType(
                                                                type,
                                                            );
                                                            typeForm.setData({
                                                                name: type.name,
                                                            });
                                                            typeForm.clearErrors();
                                                            setTypeDialogOpen(
                                                                true,
                                                            );
                                                        }}
                                                        aria-label={`Edit ${type.name}`}
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                    <ButtonConfirmation
                                                        content={{
                                                            title: 'Hapus jenis fasilitas?',
                                                            description:
                                                                'Jenis fasilitas yang masih digunakan tidak dapat dihapus.',
                                                        }}
                                                        onConfirm={() =>
                                                            router.delete(
                                                                route(
                                                                    'facility.type.destroy',
                                                                    type.id,
                                                                ),
                                                                {
                                                                    preserveScroll: true,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            aria-label={`Hapus ${type.name}`}
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </ButtonConfirmation>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </section>

            <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingType
                                ? 'Ubah Jenis Fasilitas'
                                : 'Tambah Jenis Fasilitas'}
                        </DialogTitle>
                        <DialogDescription>
                            Nama jenis fasilitas maksimal 40 karakter.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitType} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="facility-type-name">Nama</Label>
                            <Input
                                id="facility-type-name"
                                value={typeForm.data.name}
                                maxLength={40}
                                onChange={(event) =>
                                    typeForm.setData('name', event.target.value)
                                }
                                required
                            />
                            {typeForm.errors.name && (
                                <p className="text-sm text-destructive">
                                    {typeForm.errors.name}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={typeForm.processing}
                            >
                                {typeForm.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={facilityDialogOpen}
                onOpenChange={setFacilityDialogOpen}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingFacility
                                ? 'Ubah Fasilitas'
                                : 'Tambah Fasilitas'}
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi data fasilitas dan alamat wilayahnya.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitFacility} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="facility-name">
                                Nama fasilitas
                            </Label>
                            <Input
                                id="facility-name"
                                value={facilityForm.data.name}
                                maxLength={200}
                                onChange={(event) =>
                                    facilityForm.setData(
                                        'name',
                                        event.target.value,
                                    )
                                }
                                required
                            />
                            {facilityForm.errors.name && (
                                <p className="text-sm text-destructive">
                                    {facilityForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Jenis fasilitas</Label>
                            <Select
                                value={facilityForm.data.facility_type_id}
                                onValueChange={(value) =>
                                    facilityForm.setData(
                                        'facility_type_id',
                                        value,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih jenis fasilitas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facility_types.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {facilityForm.errors.facility_type_id && (
                                <p className="text-sm text-destructive">
                                    {facilityForm.errors.facility_type_id}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label>Fasilitas induk (opsional)</Label>
                            <Select
                                value={facilityForm.data.parent_id || 'none'}
                                onValueChange={(value) =>
                                    facilityForm.setData(
                                        'parent_id',
                                        value === 'none' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tidak ada" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">
                                        Tidak ada
                                    </SelectItem>
                                    {facilities
                                        .filter(
                                            (item) =>
                                                item.id !== editingFacility?.id,
                                        )
                                        .map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {facilityForm.errors.parent_id && (
                                <p className="text-sm text-destructive">
                                    {facilityForm.errors.parent_id}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {regionError && (
                                <p
                                    role="alert"
                                    className="text-sm text-destructive sm:col-span-2"
                                >
                                    {regionError}
                                </p>
                            )}
                            <RegionSelect
                                label="Provinsi"
                                value={facilityForm.data.province_id}
                                options={regions.provinces}
                                onChange={chooseProvince}
                                error={facilityForm.errors.province_id}
                            />
                            <RegionSelect
                                label="Kabupaten/Kota"
                                value={facilityForm.data.regency_id}
                                options={regions.regencies}
                                onChange={chooseRegency}
                                disabled={!facilityForm.data.province_id}
                                error={facilityForm.errors.regency_id}
                            />
                            <RegionSelect
                                label="Kecamatan"
                                value={facilityForm.data.district_id}
                                options={regions.districts}
                                onChange={chooseDistrict}
                                disabled={!facilityForm.data.regency_id}
                                error={facilityForm.errors.district_id}
                            />
                            <RegionSelect
                                label="Desa/Kelurahan"
                                value={facilityForm.data.village_id}
                                options={regions.villages}
                                onChange={(village_id) =>
                                    facilityForm.setData(
                                        'village_id',
                                        village_id,
                                    )
                                }
                                disabled={!facilityForm.data.district_id}
                                error={facilityForm.errors.village_id}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={facilityForm.processing}
                            >
                                {facilityForm.processing
                                    ? 'Menyimpan...'
                                    : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function RegionSelect({
    label,
    value,
    options,
    onChange,
    disabled = false,
    error,
}: {
    label: string;
    value: string;
    options: Region[];
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                            {region.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
