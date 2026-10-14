import { PatientAppNavbar } from '@/components/patient-app-navbar';
import { requestFcmPermission, useFcm } from '@/hooks/use-fcm';
import { Head, router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import {
    Activity,
    Baby,
    Bell,
    CalendarDays,
    ChevronRight,
    LogOut,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = 'epds_patient_token';
const API_URL = '/api/v1';

interface ApiResponse<T> {
    data: T;
    message?: string;
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
    babies?: { id: string; which_child: number }[];
}

interface Schedule {
    message: string;
    canFill: boolean;
    label: string;
    nextVisitDate?: string | null;
}

interface RegionOption {
    code: string;
    name: string;
}

interface FacilityOption {
    id: string;
    name: string;
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

const requiredProfileFields: (keyof Patient)[] = [
    'phone_number',
    'birthplace',
    'date_of_birth',
    'job',
    'married_status',
    'highest_education',
    'province_id',
    'city_or_district_id',
    'subdistrict_id',
    'village_id',
    'address',
    'facility_id',
];

function profileIsComplete(patient: Patient): boolean {
    return requiredProfileFields.every((field) => Boolean(patient[field]));
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

function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const response = error as AxiosError<{
            message?: string;
            errors?: Record<string, string[]>;
        }>;
        const firstValidationError = Object.values(
            response.response?.data?.errors ?? {},
        )[0]?.[0];

        return (
            firstValidationError ??
            response.response?.data?.message ??
            'Terjadi kesalahan. Silakan coba lagi.'
        );
    }

    return error instanceof Error
        ? error.message
        : 'Terjadi kesalahan. Silakan coba lagi.';
}

function fieldClassName(): string {
    return 'min-h-12 w-full rounded-2xl border border-rose-100 bg-white px-4 text-sm text-slate-800 outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100';
}

export default function PatientAppHome() {
    useFcm();
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
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [profile, setProfile] = useState<ProfileForm | null>(null);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [pushEnabled, setPushEnabled] = useState(
        typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted',
    );
    const [provinces, setProvinces] = useState<RegionOption[]>([]);
    const [regencies, setRegencies] = useState<RegionOption[]>([]);
    const [districts, setDistricts] = useState<RegionOption[]>([]);
    const [villages, setVillages] = useState<RegionOption[]>([]);
    const [facilities, setFacilities] = useState<FacilityOption[]>([]);
    const [installPrompt, setInstallPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);

    const clearSession = useCallback(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        router.visit('/patient-app', { replace: true });
    }, []);

    const refreshSchedule = useCallback(async () => {
        if (!client || !patient?.id) return;

        try {
            const response = await client.get<ApiResponse<Schedule>>(
                `/postpartum/${patient.id}/schedule`,
            );
            setSchedule(response.data.data);
        } catch (scheduleError) {
            if (
                axios.isAxiosError(scheduleError) &&
                scheduleError.response?.status === 401
            ) {
                clearSession();
            } else {
                setError(getErrorMessage(scheduleError));
            }
        }
    }, [client, clearSession, patient?.id]);

    useEffect(() => {
        if (!token || !client) {
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

                const [patientResponse, scheduleResponse] = await Promise.all([
                    client.get<ApiResponse<Patient>>(`/patient/${user.id}`),
                    client.get<ApiResponse<Schedule>>(
                        `/postpartum/${user.id}/schedule`,
                    ),
                ]);

                if (cancelled) return;

                const currentPatient = patientResponse.data.data;
                const hasCompleteProfile = profileIsComplete(currentPatient);
                setPatient(currentPatient);
                setProfile(profileFromPatient(currentPatient));
                setProfileModalOpen(!hasCompleteProfile);
                setSchedule(scheduleResponse.data.data);
            })
            .catch((loadError: unknown) => {
                if (cancelled) return;
                if (
                    axios.isAxiosError(loadError) &&
                    loadError.response?.status === 401
                ) {
                    clearSession();
                    return;
                }
                setError(getErrorMessage(loadError));
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [clearSession, client, token]);

    useEffect(() => {
        if (!patient?.id) return;

        const pushKey = `epds_fcm_token:${API_URL}/web-push-subscriptions:${patient.id}`;
        setPushEnabled(
            typeof Notification !== 'undefined' &&
                Notification.permission === 'granted' &&
                Boolean(window.localStorage.getItem(pushKey)),
        );

        const refreshWhenVisible = () => {
            if (document.visibilityState === 'visible') {
                void refreshSchedule();
            }
        };
        const interval = window.setInterval(refreshWhenVisible, 15_000);
        window.addEventListener('focus', refreshWhenVisible);
        document.addEventListener('visibilitychange', refreshWhenVisible);

        return () => {
            window.clearInterval(interval);
            window.removeEventListener('focus', refreshWhenVisible);
            document.removeEventListener(
                'visibilitychange',
                refreshWhenVisible,
            );
        };
    }, [patient?.id, refreshSchedule]);

    useEffect(() => {
        const handler = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    useEffect(() => {
        if (!client) return;
        client
            .get<ApiResponse<RegionOption[]>>('/region/provinces')
            .then(({ data }) => setProvinces(data.data))
            .catch((optionsError: unknown) =>
                setError(getErrorMessage(optionsError)),
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
                setError(getErrorMessage(optionsError)),
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
                setError(getErrorMessage(optionsError)),
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
                setError(getErrorMessage(optionsError)),
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

        setSavingProfile(true);
        setError('');
        try {
            const response = await client.put<ApiResponse<Patient>>(
                `/patient/${patient.id}`,
                profile,
            );
            setPatient((current) =>
                current ? { ...current, ...response.data.data } : current,
            );
            setProfile(profileFromPatient(response.data.data));
            setProfileModalOpen(false);
            setSuccess('Profil berhasil disimpan.');
        } catch (saveError) {
            setError(getErrorMessage(saveError));
        } finally {
            setSavingProfile(false);
        }
    }

    async function logout() {
        try {
            await client?.post('/logout');
        } catch {
            // Local sign-out remains available when the network is unavailable.
        }
        clearSession();
    }

    async function installApp() {
        if (!installPrompt) return;
        await installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
    }

    async function enableNotifications() {
        if (!token || !patient) return;
        setError('');
        try {
            const granted = await requestFcmPermission({
                endpoint: `${API_URL}/web-push-subscriptions`,
                apiToken: token,
                userId: patient.id,
                throwOnError: true,
            });
            setPushEnabled(granted);
            if (!granted) {
                setError(
                    'Izin notifikasi tidak diberikan. Ubah pengaturan notifikasi di browser Anda.',
                );
            } else {
                setSuccess('Notifikasi jadwal skrining berhasil diaktifkan.');
            }
        } catch (pushError) {
            setPushEnabled(false);
            setError(getErrorMessage(pushError));
        }
    }

    function goToSection(section: string) {
        router.visit(`/patient-app?section=${section}`);
    }

    if (loading) {
        return (
            <>
                <Head title="Menyiapkan beranda" />
                <main className="grid min-h-screen place-items-center bg-[#FEF6F7]">
                    <div className="text-center">
                        <div className="mx-auto mb-4 size-12 animate-pulse rounded-full bg-rose-300" />
                        <p className="font-semibold text-rose-500">
                            Menyiapkan ruang sehat ibu…
                        </p>
                    </div>
                </main>
            </>
        );
    }

    if (!patient || !profile) {
        return (
            <>
                <Head title="Beranda pasien" />
                <main className="grid min-h-screen place-items-center bg-[#FEF6F7] px-5">
                    <section className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow">
                        <p className="text-sm text-red-700">
                            {error || 'Data pasien gagal dimuat.'}
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-2xl bg-rose-400 px-4 py-3 font-semibold text-white"
                        >
                            Coba lagi
                        </button>
                    </section>
                </main>
            </>
        );
    }

    const scheduleDate = schedule?.nextVisitDate
        ? new Date(schedule.nextVisitDate).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
          })
        : null;
    const latestBaby = patient.babies?.[0];

    return (
        <>
            <Head title="Beranda pasien">
                <link rel="manifest" href="/manifest.webmanifest" />
                <meta name="theme-color" content="#FB93A4" />
            </Head>
            <main className="min-h-screen bg-[#FEF6F7] pb-24 text-slate-800">
                <div className="mx-auto min-h-screen max-w-xl">
                    <header className="sticky top-0 z-20 border-b border-rose-100 bg-[#FEF6F7]/95 px-5 py-4 backdrop-blur">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.18em] text-rose-400 uppercase">
                                    EPDS Sahabat Ibu
                                </p>
                                <h1 className="text-xl font-bold">Beranda</h1>
                            </div>
                            <button
                                type="button"
                                aria-label="Buka notifikasi"
                                onClick={() => goToSection('notifications')}
                                className="flex size-11 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm"
                            >
                                <Bell size={20} />
                            </button>
                        </div>
                    </header>

                    <div className="space-y-5 px-5 py-5">
                        {error && (
                            <p
                                role="alert"
                                className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}
                        {success && (
                            <p
                                role="status"
                                className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                            >
                                {success}
                            </p>
                        )}

                        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-400 to-pink-300 p-6 text-white shadow-xl shadow-rose-200">
                            <p className="text-sm font-medium text-white/80">
                                Halo, {patient.name.split(' ')[0]} 👋
                            </p>
                            <h2 className="mt-2 max-w-xs text-2xl leading-tight font-bold">
                                Ibu yang sehat, awal yang baik untuk keluarga.
                            </h2>
                            <p className="mt-3 text-sm text-white/85">
                                Satu langkah kecil hari ini berarti banyak untuk
                                kesehatan Anda.
                            </p>
                            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/20 p-4 backdrop-blur">
                                <CalendarDays size={22} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-white/75">
                                        Jadwal skrining
                                    </p>
                                    <p className="font-semibold">
                                        {schedule?.label ?? 'Memuat jadwal…'}
                                    </p>
                                    {scheduleDate && (
                                        <p className="text-xs text-white/80">
                                            {scheduleDate}
                                        </p>
                                    )}
                                </div>
                                {schedule?.canFill && (
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-500">
                                        Tersedia
                                    </span>
                                )}
                            </div>
                            {schedule?.canFill && (
                                <button
                                    type="button"
                                    onClick={() => goToSection('screening')}
                                    className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                    Mulai skrining <ChevronRight size={18} />
                                </button>
                            )}
                        </section>

                        <section className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    router.visit('/patient-app/baby')
                                }
                                className="min-h-32 rounded-[1.5rem] border border-rose-100 bg-white p-4 text-left"
                            >
                                <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                    <Baby size={20} />
                                </span>
                                <span className="block text-xs text-slate-500">
                                    Data bayi
                                </span>
                                <span className="mt-1 block text-sm font-bold">
                                    {latestBaby
                                        ? `Anak ke-${latestBaby.which_child}`
                                        : 'Belum ada bayi'}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => goToSection('history')}
                                className="min-h-32 rounded-[1.5rem] border border-rose-100 bg-white p-4 text-left"
                            >
                                <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                    <Activity size={20} />
                                </span>
                                <span className="block text-xs text-slate-500">
                                    Riwayat skrining
                                </span>
                                <span className="mt-1 block text-sm font-bold">
                                    Lihat hasil sebelumnya
                                </span>
                            </button>
                        </section>

                        <section className="rounded-[1.75rem] border border-rose-100 bg-white p-5">
                            <div className="flex items-center gap-3">
                                <div className="grid size-11 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold">
                                        Anda tidak sendiri
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Skrining membantu memantau perasaan ibu
                                        setelah melahirkan.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {!pushEnabled && (
                            <section className="flex items-start gap-3 rounded-[1.5rem] border border-rose-100 bg-white p-4">
                                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                    <Bell size={21} />
                                </span>
                                <div className="flex-1">
                                    <p className="font-bold">
                                        Aktifkan pengingat penting
                                    </p>
                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Dapatkan notifikasi jadwal skrining
                                        meski aplikasi tidak sedang dibuka.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            void enableNotifications()
                                        }
                                        className="mt-3 min-h-10 rounded-2xl border border-rose-200 bg-white px-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                    >
                                        Aktifkan notifikasi
                                    </button>
                                </div>
                            </section>
                        )}

                        {installPrompt && (
                            <button
                                type="button"
                                onClick={() => void installApp()}
                                className="w-full rounded-2xl border border-rose-200 bg-white p-4 text-left font-semibold text-rose-600"
                            >
                                Pasang aplikasi di perangkat
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => void logout()}
                            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-semibold text-red-600"
                        >
                            <LogOut size={17} /> Keluar
                        </button>
                    </div>

                    <PatientAppNavbar active="home" />
                </div>
            </main>

            {profileModalOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-3 sm:p-5">
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="required-profile-title"
                        className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] bg-white p-5 shadow-2xl"
                    >
                        <div className="mb-5 flex items-start gap-3">
                            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                <UserRound size={22} />
                            </span>
                            <div>
                                <h2
                                    id="required-profile-title"
                                    className="text-lg font-bold"
                                >
                                    Lengkapi profil ibu
                                </h2>
                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                    Profil wajib dilengkapi sebelum Anda dapat
                                    menggunakan fitur pasien.
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
                        <form onSubmit={saveProfile} className="grid gap-3">
                            <label className="grid gap-1.5 text-sm font-medium">
                                Nama lengkap
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
                                    className={fieldClassName()}
                                />
                            </label>
                            <label className="grid gap-1.5 text-sm font-medium">
                                Nomor telepon
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
                                    className={fieldClassName()}
                                />
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="grid gap-1.5 text-sm font-medium">
                                    Tempat lahir
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
                                        className={fieldClassName()}
                                    />
                                </label>
                                <label className="grid gap-1.5 text-sm font-medium">
                                    Tanggal lahir
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
                                        className={fieldClassName()}
                                    />
                                </label>
                            </div>
                            <label className="grid gap-1.5 text-sm font-medium">
                                Pekerjaan
                                <input
                                    required
                                    value={profile.job}
                                    onChange={(event) =>
                                        updateProfile('job', event.target.value)
                                    }
                                    className={fieldClassName()}
                                />
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="grid gap-1.5 text-sm font-medium">
                                    Status pernikahan
                                    <select
                                        required
                                        value={profile.married_status}
                                        onChange={(event) =>
                                            updateProfile(
                                                'married_status',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClassName()}
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
                                </label>
                                <label className="grid gap-1.5 text-sm font-medium">
                                    Pendidikan terakhir
                                    <select
                                        required
                                        value={profile.highest_education}
                                        onChange={(event) =>
                                            updateProfile(
                                                'highest_education',
                                                event.target.value,
                                            )
                                        }
                                        className={fieldClassName()}
                                    >
                                        <option value="">
                                            Pilih pendidikan
                                        </option>
                                        {[
                                            'SD',
                                            'SMP',
                                            'SMA',
                                            'D1',
                                            'D2',
                                            'D3',
                                            'D4',
                                            'S1',
                                            'S2',
                                            'S3',
                                        ].map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <RegionSelect
                                label="Provinsi"
                                value={profile.province_id}
                                options={provinces}
                                onChange={(value) => {
                                    const selected = provinces.find(
                                        (item) => item.code === value,
                                    );
                                    setProfile((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  province_id: value,
                                                  province:
                                                      selected?.name ?? '',
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
                                }}
                            />
                            <RegionSelect
                                label="Kabupaten / kota"
                                value={profile.city_or_district_id}
                                options={regencies}
                                disabled={!profile.province_id}
                                onChange={(value) => {
                                    const selected = regencies.find(
                                        (item) => item.code === value,
                                    );
                                    setProfile((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  city_or_district_id: value,
                                                  city_or_district:
                                                      selected?.name ?? '',
                                                  subdistrict_id: '',
                                                  subdistrict: '',
                                                  village_id: '',
                                                  village: '',
                                                  facility_id: '',
                                              }
                                            : current,
                                    );
                                }}
                            />
                            <RegionSelect
                                label="Kecamatan"
                                value={profile.subdistrict_id}
                                options={districts}
                                disabled={!profile.city_or_district_id}
                                onChange={(value) => {
                                    const selected = districts.find(
                                        (item) => item.code === value,
                                    );
                                    setProfile((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  subdistrict_id: value,
                                                  subdistrict:
                                                      selected?.name ?? '',
                                                  village_id: '',
                                                  village: '',
                                              }
                                            : current,
                                    );
                                }}
                            />
                            <RegionSelect
                                label="Desa / kelurahan"
                                value={profile.village_id}
                                options={villages}
                                disabled={!profile.subdistrict_id}
                                onChange={(value) => {
                                    const selected = villages.find(
                                        (item) => item.code === value,
                                    );
                                    setProfile((current) =>
                                        current
                                            ? {
                                                  ...current,
                                                  village_id: value,
                                                  village: selected?.name ?? '',
                                              }
                                            : current,
                                    );
                                }}
                            />
                            <label className="grid gap-1.5 text-sm font-medium">
                                Fasilitas kesehatan
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
                                    className={fieldClassName()}
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
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="grid gap-1.5 text-sm font-medium">
                                Alamat
                                <textarea
                                    required
                                    value={profile.address}
                                    onChange={(event) =>
                                        updateProfile(
                                            'address',
                                            event.target.value,
                                        )
                                    }
                                    className="min-h-20 rounded-2xl border border-rose-100 bg-white p-4 text-sm outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="mt-1 min-h-12 rounded-2xl bg-rose-400 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-100 hover:bg-rose-500 disabled:opacity-50"
                            >
                                {savingProfile
                                    ? 'Menyimpan…'
                                    : 'Simpan dan lanjutkan'}
                            </button>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}

function RegionSelect(props: {
    label: string;
    value: string;
    options: RegionOption[];
    disabled?: boolean;
    onChange: (value: string) => void;
}) {
    return (
        <label className="grid gap-1.5 text-sm font-medium">
            {props.label}
            <select
                required
                value={props.value}
                disabled={props.disabled}
                onChange={(event) => props.onChange(event.target.value)}
                className={fieldClassName()}
            >
                <option value="">Pilih {props.label.toLowerCase()}</option>
                {props.options.map((option) => (
                    <option key={option.code} value={option.code}>
                        {option.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
}
