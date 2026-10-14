import { PatientAppNavbar } from '@/components/patient-app-navbar';
import { Head, router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { ArrowLeft, LogOut, UserRound } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = 'epds_patient_token';
const API_URL = '/api/v1';

interface ApiResponse<T> {
    data: T;
}

interface Patient {
    id: string;
    name: string;
    email: string;
    phone_number?: string | null;
    birthplace?: string | null;
    date_of_birth?: string | null;
    job?: string | null;
    married_status?: string | null;
    highest_education?: string | null;
    province_id?: string | null;
    city_or_district_id?: string | null;
    subdistrict_id?: string | null;
    village_id?: string | null;
    province?: string | null;
    city_or_district?: string | null;
    subdistrict?: string | null;
    village?: string | null;
    address?: string | null;
    facility_id?: string | null;
    facility?: string | null;
    number_patient?: string | null;
}

interface RegionOption {
    code: string;
    name: string;
}

interface FacilityOption {
    id: string;
    name: string;
    facility_type: string | null;
}

interface ProfileForm {
    name: string;
    phone_number: string;
    birthplace: string;
    date_of_birth: string;
    job: string;
    married_status: string;
    highest_education: string;
    province_id: string;
    city_or_district_id: string;
    subdistrict_id: string;
    village_id: string;
    province: string;
    city_or_district: string;
    subdistrict: string;
    village: string;
    address: string;
    facility_id: string;
}

const fieldClass =
    'min-h-12 w-full rounded-2xl border border-rose-100 bg-white px-4 text-sm text-slate-800 outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100 disabled:bg-slate-50';

function errorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return error instanceof Error
            ? error.message
            : 'Terjadi kesalahan. Silakan coba lagi.';
    }

    const response = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
    }>;
    return (
        Object.values(response.response?.data?.errors ?? {})[0]?.[0] ??
        response.response?.data?.message ??
        'Terjadi kesalahan. Silakan coba lagi.'
    );
}

function patientProfileIsComplete(patient: Patient): boolean {
    return [
        patient.phone_number,
        patient.birthplace,
        patient.date_of_birth,
        patient.job,
        patient.married_status,
        patient.highest_education,
        patient.province_id,
        patient.city_or_district_id,
        patient.subdistrict_id,
        patient.village_id,
        patient.address,
        patient.facility_id,
    ].every(Boolean);
}

function profileFromPatient(patient: Patient): ProfileForm {
    return {
        name: patient.name ?? '',
        phone_number: patient.phone_number ?? '',
        birthplace: patient.birthplace ?? '',
        date_of_birth: patient.date_of_birth?.slice(0, 10) ?? '',
        job: patient.job ?? '',
        married_status: patient.married_status ?? '',
        highest_education: patient.highest_education ?? '',
        province_id: patient.province_id ?? '',
        city_or_district_id: patient.city_or_district_id ?? '',
        subdistrict_id: patient.subdistrict_id ?? '',
        village_id: patient.village_id ?? '',
        province: patient.province ?? '',
        city_or_district: patient.city_or_district ?? '',
        subdistrict: patient.subdistrict ?? '',
        village: patient.village ?? '',
        address: patient.address ?? '',
        facility_id: patient.facility_id ?? '',
    };
}

export default function PatientAppProfile() {
    const [token] = useState<string | null>(() =>
        typeof window === 'undefined'
            ? null
            : window.localStorage.getItem(TOKEN_KEY),
    );
    const client = useMemo(
        () =>
            token
                ? axios.create({
                    baseURL: API_URL,
                    headers: { Authorization: `Bearer ${token}` },
                })
                : null,
        [token],
    );
    const [patient, setPatient] = useState<Patient | null>(null);
    const [profile, setProfile] = useState<ProfileForm | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [email, setEmail] = useState('');
    const [passwords, setPasswords] = useState({
        current: '',
        next: '',
        confirmation: '',
    });
    const [accountMessage, setAccountMessage] = useState('');
    const [provinces, setProvinces] = useState<RegionOption[]>([]);
    const [regencies, setRegencies] = useState<RegionOption[]>([]);
    const [districts, setDistricts] = useState<RegionOption[]>([]);
    const [villages, setVillages] = useState<RegionOption[]>([]);
    const [facilities, setFacilities] = useState<FacilityOption[]>([]);

    useEffect(() => {
        if (!client) {
            router.visit('/patient-app', { replace: true });
            return;
        }

        let cancelled = false;
        setLoading(true);
        client
            .get<Patient & { role?: { slug: string } }>('/user')
            .then(async ({ data: user }) => {
                if (user.role?.slug !== 'patient') {
                    throw new Error(
                        'Aplikasi ini hanya tersedia untuk akun pasien.',
                    );
                }
                const response = await client.get<ApiResponse<Patient>>(
                    `/patient/${user.id}`,
                );
                if (cancelled) return;
                setPatient(response.data.data);
                setProfile(profileFromPatient(response.data.data));
                setEmail(response.data.data.email);
            })
            .catch((loadError: unknown) => {
                if (cancelled) return;
                if (
                    axios.isAxiosError(loadError) &&
                    loadError.response?.status === 401
                ) {
                    window.localStorage.removeItem(TOKEN_KEY);
                    router.visit('/patient-app', { replace: true });
                    return;
                }
                setError(errorMessage(loadError));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [client]);

    useEffect(() => {
        if (!client) return;
        client
            .get<ApiResponse<RegionOption[]>>('/region/provinces')
            .then(({ data }) => setProvinces(data.data))
            .catch((optionsError: unknown) =>
                setError(errorMessage(optionsError)),
            );
    }, [client]);

    useEffect(() => {
        if (!client || !profile?.province_id) {
            setRegencies([]);
            return;
        }
        client
            .get<ApiResponse<RegionOption[]>>(
                `/region/regencies/${profile.province_id}`,
            )
            .then(({ data }) => setRegencies(data.data))
            .catch((optionsError: unknown) =>
                setError(errorMessage(optionsError)),
            );
    }, [client, profile?.province_id]);

    useEffect(() => {
        if (!client || !profile?.city_or_district_id) {
            setDistricts([]);
            setFacilities([]);
            return;
        }
        Promise.all([
            client.get<ApiResponse<RegionOption[]>>(
                `/region/districts/${profile.city_or_district_id}`,
            ),
            client.get<ApiResponse<FacilityOption[]>>(
                `/facilities?regency_id=${profile.city_or_district_id}`,
            ),
        ])
            .then(([districtResponse, facilityResponse]) => {
                setDistricts(districtResponse.data.data);
                setFacilities(facilityResponse.data.data);
            })
            .catch((optionsError: unknown) =>
                setError(errorMessage(optionsError)),
            );
    }, [client, profile?.city_or_district_id]);

    useEffect(() => {
        if (!client || !profile?.subdistrict_id) {
            setVillages([]);
            return;
        }
        client
            .get<ApiResponse<RegionOption[]>>(
                `/region/villages/${profile.subdistrict_id}`,
            )
            .then(({ data }) => setVillages(data.data))
            .catch((optionsError: unknown) =>
                setError(errorMessage(optionsError)),
            );
    }, [client, profile?.subdistrict_id]);

    function updateProfile<K extends keyof ProfileForm>(
        key: K,
        value: ProfileForm[K],
    ) {
        setProfile((current) =>
            current ? { ...current, [key]: value } : current,
        );
    }

    async function saveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!client || !patient || !profile) return;
        setBusy(true);
        setError('');
        setSuccess('');
        const profileWasComplete = patientProfileIsComplete(patient);
        try {
            const response = await client.put<ApiResponse<Patient>>(
                `/patient/${patient.id}`,
                profile,
            );
            setPatient(response.data.data);
            setProfile(profileFromPatient(response.data.data));
            setSuccess('Profil berhasil disimpan.');
            if (
                !profileWasComplete &&
                patientProfileIsComplete(response.data.data)
            ) {
                window.setTimeout(() => router.visit('/patient-app/home'), 500);
            }
        } catch (saveError) {
            setError(errorMessage(saveError));
        } finally {
            setBusy(false);
        }
    }

    async function changePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!client || !patient) return;
        setAccountMessage('');
        try {
            await client.put(`/user/${patient.id}/change-password`, {
                old_password: passwords.current,
                new_password: passwords.next,
                confirm_password: passwords.confirmation,
            });
            setAccountMessage('Kata sandi berhasil diperbarui.');
            setPasswords({ current: '', next: '', confirmation: '' });
        } catch (passwordError) {
            setAccountMessage(errorMessage(passwordError));
        }
    }

    async function changeEmail(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!client || !patient) return;
        setAccountMessage('');
        try {
            await client.put(`/user/${patient.id}/change-email`, { email });
            setAccountMessage(
                'Email diperbarui. Verifikasi alamat baru melalui email.',
            );
        } catch (emailError) {
            setAccountMessage(errorMessage(emailError));
        }
    }

    async function logout() {
        try {
            await client?.post('/logout');
        } catch {
            // Local sign-out remains available when the network is unavailable.
        }
        window.localStorage.removeItem(TOKEN_KEY);
        router.visit('/patient-app', { replace: true });
    }

    function updateRegion(
        key: 'province' | 'city_or_district' | 'subdistrict' | 'village',
        value: string,
        options: RegionOption[],
    ) {
        const selected = options.find((option) => option.code === value);
        if (key === 'province') {
            setProfile((current) =>
                current
                    ? {
                        ...current,
                        province_id: value,
                        province: selected?.name ?? '',
                        city_or_district_id: '',
                        city_or_district: '',
                        subdistrict_id: '',
                        subdistrict: '',
                        village_id: '',
                        village: '',
                        facility_id: '',
                    }
                    : current,
            );
        } else if (key === 'city_or_district') {
            setProfile((current) =>
                current
                    ? {
                        ...current,
                        city_or_district_id: value,
                        city_or_district: selected?.name ?? '',
                        subdistrict_id: '',
                        subdistrict: '',
                        village_id: '',
                        village: '',
                        facility_id: '',
                    }
                    : current,
            );
        } else if (key === 'subdistrict') {
            setProfile((current) =>
                current
                    ? {
                        ...current,
                        subdistrict_id: value,
                        subdistrict: selected?.name ?? '',
                        village_id: '',
                        village: '',
                    }
                    : current,
            );
        } else {
            setProfile((current) =>
                current
                    ? {
                        ...current,
                        village_id: value,
                        village: selected?.name ?? '',
                    }
                    : current,
            );
        }
    }

    if (loading) {
        return <PageMessage title="Profil saya" message="Memuat profil…" />;
    }
    if (!patient || !profile) {
        return (
            <PageMessage
                title="Profil saya"
                message={error || 'Data profil gagal dimuat.'}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <>
            <Head title="Profil saya">
                <link rel="manifest" href="/manifest.webmanifest" />
                <meta name="theme-color" content="#FB93A4" />
            </Head>
            <main className="min-h-screen bg-[#FEF6F7] px-4 pt-5 pb-24 text-slate-800">
                <div className="mx-auto grid max-w-xl gap-5">
                    <header className="flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Kembali ke beranda"
                            onClick={() => router.visit('/patient-app/home')}
                            className="grid size-11 place-items-center rounded-full bg-white text-rose-500 shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <p className="text-xs font-semibold tracking-[0.18em] text-rose-400 uppercase">
                                EPDS Sahabat Ibu
                            </p>
                            <h1 className="text-xl font-bold">Profil saya</h1>
                        </div>
                    </header>

                    <section className="rounded-[1.75rem] border border-rose-100 bg-white p-5">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                <UserRound size={23} />
                            </span>
                            <div>
                                <h2 className="font-bold">Data ibu</h2>
                                <p className="text-sm text-slate-500">
                                    {patient.number_patient
                                        ? `Nomor pasien ${patient.number_patient}`
                                        : patient.email}
                                </p>
                            </div>
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}
                        {success && (
                            <p
                                role="status"
                                className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
                            >
                                {success}
                            </p>
                        )}

                        <form onSubmit={saveProfile} className="grid gap-4">
                            <ProfileField label="Nama lengkap">
                                <input
                                    required
                                    maxLength={100}
                                    value={profile.name}
                                    onChange={(event) =>
                                        updateProfile(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    className={fieldClass}
                                />
                            </ProfileField>
                            <ProfileField label="Nomor telepon">
                                <input
                                    required
                                    maxLength={50}
                                    value={profile.phone_number}
                                    onChange={(event) =>
                                        updateProfile(
                                            'phone_number',
                                            event.target.value,
                                        )
                                    }
                                    className={fieldClass}
                                />
                            </ProfileField>
                            <div className="grid grid-cols-2 gap-3">
                                <ProfileField label="Tempat lahir">
                                    <input
                                        required
                                        maxLength={50}
                                        value={profile.birthplace}
                                        onChange={(event) =>
                                            updateProfile(
                                                'birthplace',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                </ProfileField>
                                <ProfileField label="Tanggal lahir">
                                    <input
                                        required
                                        type="date"
                                        value={profile.date_of_birth}
                                        onChange={(event) =>
                                            updateProfile(
                                                'date_of_birth',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    />
                                </ProfileField>
                            </div>
                            <ProfileField label="Pekerjaan">
                                <input
                                    required
                                    value={profile.job}
                                    onChange={(event) =>
                                        updateProfile('job', event.target.value)
                                    }
                                    className={fieldClass}
                                />
                            </ProfileField>
                            <div className="grid grid-cols-2 gap-3">
                                <ProfileField label="Status pernikahan">
                                    <select
                                        required
                                        value={profile.married_status}
                                        onChange={(event) =>
                                            updateProfile(
                                                'married_status',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    >
                                        <option value="">Pilih status</option>
                                        <option value="married">Menikah</option>
                                        <option value="not_married">
                                            Belum menikah
                                        </option>
                                        <option value="divorced">
                                            Bercerai
                                        </option>
                                    </select>
                                </ProfileField>
                                <ProfileField label="Pendidikan terakhir">
                                    <select
                                        required
                                        value={profile.highest_education}
                                        onChange={(event) =>
                                            updateProfile(
                                                'highest_education',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClass}
                                    >
                                        <option value="">
                                            Pilih pendidikan
                                        </option>
                                        {[
                                            'SD/SMP',
                                            'SMA/SMK',
                                            'D3/S1/S2'
                                        ].map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </ProfileField>
                            </div>
                            <RegionField
                                label="Provinsi"
                                value={profile.province_id}
                                options={provinces}
                                onChange={(value) =>
                                    updateRegion('province', value, provinces)
                                }
                            />
                            <RegionField
                                label="Kabupaten / kota"
                                value={profile.city_or_district_id}
                                options={regencies}
                                disabled={!profile.province_id}
                                onChange={(value) =>
                                    updateRegion(
                                        'city_or_district',
                                        value,
                                        regencies,
                                    )
                                }
                            />
                            <RegionField
                                label="Kecamatan"
                                value={profile.subdistrict_id}
                                options={districts}
                                disabled={!profile.city_or_district_id}
                                onChange={(value) =>
                                    updateRegion(
                                        'subdistrict',
                                        value,
                                        districts,
                                    )
                                }
                            />
                            <RegionField
                                label="Kelurahan / desa"
                                value={profile.village_id}
                                options={villages}
                                disabled={!profile.subdistrict_id}
                                onChange={(value) =>
                                    updateRegion('village', value, villages)
                                }
                            />
                            <ProfileField label="Fasilitas kesehatan">
                                <select
                                    required
                                    disabled={!profile.city_or_district_id}
                                    value={profile.facility_id}
                                    onChange={(event) =>
                                        updateProfile(
                                            'facility_id',
                                            event.target.value,
                                        )
                                    }
                                    className={fieldClass}
                                >
                                    <option value="">
                                        Pilih fasilitas kesehatan
                                    </option>
                                    {facilities.map((facility) => (
                                        <option
                                            key={facility.id}
                                            value={facility.id}
                                        >
                                            {facility.name}
                                            {facility.facility_type
                                                ? ` · ${facility.facility_type}`
                                                : ''}
                                        </option>
                                    ))}
                                </select>
                            </ProfileField>
                            <ProfileField label="Alamat">
                                <textarea
                                    required
                                    value={profile.address}
                                    onChange={(event) =>
                                        updateProfile(
                                            'address',
                                            event.target.value,
                                        )
                                    }
                                    className="min-h-24 rounded-2xl border border-rose-100 bg-white p-4 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                                />
                            </ProfileField>
                            <button
                                type="submit"
                                disabled={busy}
                                className="min-h-12 rounded-2xl bg-rose-400 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-100 hover:bg-rose-500 disabled:opacity-50"
                            >
                                {busy ? 'Menyimpan…' : 'Simpan profil'}
                            </button>
                        </form>
                    </section>
                    <section className="grid gap-5">
                        <form
                            onSubmit={changePassword}
                            className="grid gap-4 rounded-[1.75rem] bg-white p-5"
                        >
                            <div>
                                <h2 className="font-bold">Ubah kata sandi</h2>
                                {accountMessage && (
                                    <p
                                        role="status"
                                        className="mt-2 text-sm text-rose-600"
                                    >
                                        {accountMessage}
                                    </p>
                                )}
                            </div>
                            <ProfileField label="Kata sandi saat ini">
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={passwords.current}
                                    onChange={(event) =>
                                        setPasswords({
                                            ...passwords,
                                            current: event.target.value,
                                        })
                                    }
                                    className={fieldClass}
                                />
                            </ProfileField>
                            <ProfileField label="Kata sandi baru">
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={passwords.next}
                                    onChange={(event) =>
                                        setPasswords({
                                            ...passwords,
                                            next: event.target.value,
                                        })
                                    }
                                    className={fieldClass}
                                />
                            </ProfileField>
                            <ProfileField label="Ulangi kata sandi baru">
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    value={passwords.confirmation}
                                    onChange={(event) =>
                                        setPasswords({
                                            ...passwords,
                                            confirmation: event.target.value,
                                        })
                                    }
                                    className={fieldClass}
                                />
                            </ProfileField>
                            <button
                                type="submit"
                                className="min-h-11 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                            >
                                Perbarui kata sandi
                            </button>
                        </form>
                        <form
                            onSubmit={changeEmail}
                            className="grid gap-4 rounded-[1.75rem] bg-white p-5"
                        >
                            <h2 className="font-bold">Ubah email akun</h2>
                            <ProfileField label="Email baru">
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    className={fieldClass}
                                />
                            </ProfileField>
                            <button
                                type="submit"
                                className="min-h-11 rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                            >
                                Perbarui email
                            </button>
                        </form>
                        <button
                            type="button"
                            onClick={() => void logout()}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                            <LogOut size={17} /> Keluar
                        </button>
                    </section>
                </div>
            </main>
            <PatientAppNavbar active="profile" />
        </>
    );
}

function ProfileField(props: { label: string; children: ReactNode }) {
    return (
        <label className="grid gap-2 text-sm font-medium text-slate-700">
            {props.label}
            {props.children}
        </label>
    );
}

function RegionField(props: {
    label: string;
    value: string;
    options: RegionOption[];
    disabled?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <ProfileField label={props.label}>
            <select
                required
                value={props.value}
                disabled={props.disabled}
                onChange={(event) => props.onChange(event.target.value)}
                className={fieldClass}
            >
                <option value="">Pilih {props.label.toLowerCase()}</option>
                {props.options.map((option) => (
                    <option key={option.code} value={option.code}>
                        {option.name}
                    </option>
                ))}
            </select>
        </ProfileField>
    );
}

function PageMessage(props: {
    title: string;
    message: string;
    onRetry?: () => void;
}) {
    return (
        <>
            <Head title={props.title} />
            <main className="grid min-h-screen place-items-center bg-[#FEF6F7] px-5">
                <section className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow">
                    <p className="text-sm text-slate-600">{props.message}</p>
                    {props.onRetry && (
                        <button
                            type="button"
                            onClick={props.onRetry}
                            className="mt-4 rounded-2xl bg-rose-400 px-4 py-3 font-semibold text-white"
                        >
                            Coba lagi
                        </button>
                    )}
                </section>
            </main>
        </>
    );
}
