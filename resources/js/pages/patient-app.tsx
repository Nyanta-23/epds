import { requestFcmPermission, useFcm } from '@/hooks/use-fcm';
import { Head } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import {
    Activity,
    Baby as BabyIcon,
    Bell,
    CalendarDays,
    ChevronRight,
    ClipboardList,
    Heart,
    Home,
    LogOut,
    Plus,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import type * as React from 'react';
import {
    FormEvent,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

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
    facility?: string | null;
    number_patient?: string | null;
    babies?: Baby[];
}

interface Baby {
    id: string;
    which_child: number;
    date_of_birth: string;
    baby_condition: number | { value: number };
    typeof_delivery: number | { value: number };
    gender: string;
    baby_feeding_method: number | { value: number };
}

interface Region {
    code: string;
    name: string;
}

interface Facility {
    id: string;
    name: string;
    facility_type: string | null;
}

interface QuestionOption {
    id: string;
    option: string;
    option_text: string;
    value: number;
}

interface Question {
    id: string;
    number_question: number;
    question: string;
    options: QuestionOption[];
}

interface Schedule {
    status: string;
    message: string;
    canFill: boolean;
    label: string;
    visitNumber?: number;
    nextVisitDate?: string | null;
}

interface PatientNotification {
    id: string;
    data: {
        title: string;
        body: string;
        type: string;
        action_url?: string | null;
    };
    read_at: string | null;
    created_at: string;
}

interface Result {
    postpartum_visit_id: string;
    visit_number: number;
    visit_label: string;
    total_score: number;
    recommendation: string;
    pesan_penguatan: string;
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

interface BabyForm {
    which_child: string;
    birth_date: string;
    birth_hour: string;
    birth_minute: string;
    baby_condition: string;
    typeof_delivery: string;
    gender: string;
    baby_feeding_method: string;
}

type ConditionForm = Record<string, string | boolean | string[]>;
type Section =
    | 'home'
    | 'profile'
    | 'baby'
    | 'screening'
    | 'history'
    | 'notifications';

const emptyProfile: ProfileForm = {
    name: '',
    phone_number: '',
    birthplace: '',
    date_of_birth: '',
    job: '',
    married_status: '',
    highest_education: '',
    province_id: '',
    city_or_district_id: '',
    subdistrict_id: '',
    village_id: '',
    province: '',
    city_or_district: '',
    subdistrict: '',
    village: '',
    address: '',
    facility_id: '',
};

const emptyBaby: BabyForm = {
    which_child: '1',
    birth_date: '',
    birth_hour: '',
    birth_minute: '',
    baby_condition: '0',
    typeof_delivery: '0',
    gender: 'female',
    baby_feeding_method: '0',
};

const emptyCondition: ConditionForm = {
    parity_count: '',
    sleep_quality: '',
    partner_support: '',
    live_with_partner: '',
    family_salary_permonth: '',
    dependent_family_count: '',
    is_salary_sufficient: '',
    psych_history: '',
    psych_treatment: '',
    psych_trauma: '',
    feel_unsafe: '',
    pregnancy_planned: '',
    preg_comp_history: '',
    last_comp: '',
    last_comp_note: '',
    baby_caregiver: [],
};

const selectOptions = {
    yesNo: [
        { value: 'true', label: 'Ya' },
        { value: 'false', label: 'Tidak' },
    ],
    sleep: [
        { value: '0', label: 'Kurang dari 3 jam' },
        { value: '1', label: '3–4 jam' },
        { value: '2', label: '5–6 jam' },
        { value: '3', label: 'Lebih dari 6 jam' },
    ],
    support: [
        { value: '0', label: 'Baik' },
        { value: '1', label: 'Cukup' },
        { value: '2', label: 'Buruk' },
    ],
    salary: [
        { value: '0', label: 'Di bawah Rp3.863.692' },
        { value: '1', label: 'Rp3.863.692–Rp7.700.000' },
        { value: '2', label: 'Di atas Rp7.700.000' },
        { value: '3', label: 'Di bawah UMR' },
    ],
    dependents: [
        { value: '0', label: '1–2 orang' },
        { value: '1', label: '3–4 orang' },
        { value: '2', label: 'Lebih dari 5 orang' },
    ],
    sufficient: [
        { value: '0', label: 'Tidak cukup' },
        { value: '1', label: 'Cukup untuk kebutuhan dasar' },
        { value: '2', label: 'Cukup untuk kenyamanan' },
    ],
    yesNoPrefer: [
        { value: '0', label: 'Tidak' },
        { value: '1', label: 'Ya' },
        { value: '2', label: 'Tidak ingin menjawab' },
    ],
};

function apiFor(token: string) {
    return axios.create({
        baseURL: API_URL,
        headers: { Authorization: `Bearer ${token}` },
    });
}

function errorMessage(error: unknown): string {
    if (error instanceof Error && !axios.isAxiosError(error)) {
        return error.message;
    }
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
    return 'Terjadi kesalahan. Silakan coba lagi.';
}

function valueOf(value: number | { value: number }): number {
    return typeof value === 'number' ? value : value.value;
}

function toDateTimeLocalValue(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const pad = (part: number) => String(part).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function currentDateTimeLocalValue(): string {
    return toDateTimeLocalValue(new Date().toISOString());
}

function Field({
    label,
    children,
    hint,
}: {
    label: string;
    children: ReactNode;
    hint?: string;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium text-slate-700">
            {label}
            {children}
            {hint && (
                <span className="text-xs font-normal text-slate-500">
                    {hint}
                </span>
            )}
        </label>
    );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={`min-h-12 w-full rounded-2xl border border-rose-100 bg-white px-4 text-sm text-slate-800 transition outline-none placeholder:text-slate-400 focus:border-rose-300 focus:ring-4 focus:ring-rose-100 ${props.className ?? ''}`}
        />
    );
}

function SelectInput({
    options,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string; disabled?: boolean }[];
}) {
    return (
        <select
            {...props}
            className={`min-h-12 w-full rounded-2xl border border-rose-100 bg-white px-4 text-sm text-slate-800 transition outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100 ${props.className ?? ''}`}
        >
            <option value="">Pilih {props['aria-label'] ?? 'jawaban'}</option>
            {options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                >
                    {option.label}
                </option>
            ))}
        </select>
    );
}

function AppButton({
    children,
    variant = 'primary',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'plain' | 'danger';
}) {
    const styles = {
        primary:
            'bg-rose-400 text-white shadow-lg shadow-rose-200 hover:bg-rose-500',
        secondary:
            'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50',
        plain: 'bg-transparent text-slate-600 hover:bg-rose-50',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100',
    };

    return (
        <button
            {...props}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${props.className ?? ''}`}
        >
            {children}
        </button>
    );
}

export default function PatientApp() {
    useFcm();
    const [token, setToken] = useState<string | null>(() =>
        typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY),
    );
    const [patient, setPatient] = useState<Patient | null>(null);
    const [section, setSection] = useState<Section>('home');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [history, setHistory] = useState<Record<string, unknown>[]>([]);
    const [previousVisit, setPreviousVisit] = useState<Record<
        string,
        unknown
    > | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [notifications, setNotifications] = useState<PatientNotification[]>(
        [],
    );
    const [unreadCount, setUnreadCount] = useState(0);
    const [result, setResult] = useState<Result | null>(null);
    const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
    const [babyForm, setBabyForm] = useState<BabyForm>(emptyBaby);
    const [editingBabyId, setEditingBabyId] = useState<string | null>(null);
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileComplete, setProfileComplete] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [babyFormOpen, setBabyFormOpen] = useState(false);
    const [screeningStep, setScreeningStep] = useState<'condition' | 'epds'>(
        'condition',
    );
    const [condition, setCondition] = useState<ConditionForm>(emptyCondition);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [installPrompt, setInstallPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [pushEnabled, setPushEnabled] = useState(
        typeof window !== 'undefined' && Notification.permission === 'granted',
    );

    const client = useMemo(() => (token ? apiFor(token) : null), [token]);

    const loadPatientData = useCallback(async () => {
        if (!client || !patient?.id) return;
        setLoading(true);
        setError('');
        try {
            const [
                profileResponse,
                chartResponse,
                scheduleResponse,
                questionResponse,
                previousResponse,
                notificationResponse,
            ] = await Promise.all([
                client.get<ApiResponse<Patient>>(`/patient/${patient.id}`),
                client.get<ApiResponse<Record<string, unknown>[]>>(
                    `/patient/${patient.id}/postpartum`,
                ),
                client.get<ApiResponse<Schedule>>(
                    `/postpartum/${patient.id}/schedule`,
                ),
                client.get<ApiResponse<Question[]>>('/questions'),
                client.get<ApiResponse<Record<string, unknown> | null>>(
                    '/postpartum',
                ),
                client.get<{
                    notifications: PatientNotification[];
                    unread: number;
                }>('/notifications'),
            ]);

            const currentPatient = profileResponse.data.data;
            setPatient(currentPatient);
            setProfileComplete(
                Boolean(
                    currentPatient.phone_number && currentPatient.facility_id,
                ),
            );
            setProfile({
                name: currentPatient.name ?? '',
                phone_number: currentPatient.phone_number ?? '',
                birthplace: currentPatient.birthplace ?? '',
                date_of_birth: currentPatient.date_of_birth?.slice(0, 10) ?? '',
                job: currentPatient.job ?? '',
                married_status: currentPatient.married_status ?? '',
                highest_education: currentPatient.highest_education ?? '',
                province_id: currentPatient.province_id ?? '',
                city_or_district_id: currentPatient.city_or_district_id ?? '',
                subdistrict_id: currentPatient.subdistrict_id ?? '',
                village_id: currentPatient.village_id ?? '',
                province: currentPatient.province ?? '',
                city_or_district: currentPatient.city_or_district ?? '',
                subdistrict: currentPatient.subdistrict ?? '',
                village: currentPatient.village ?? '',
                address: currentPatient.address ?? '',
                facility_id: currentPatient.facility_id ?? '',
            });
            setHistory(chartResponse.data.data ?? []);
            setSchedule(scheduleResponse.data.data);
            setQuestions(questionResponse.data.data ?? []);
            setPreviousVisit(previousResponse.data.data);
            setNotifications(notificationResponse.data.notifications ?? []);
            setUnreadCount(notificationResponse.data.unread ?? 0);
        } catch (loadError) {
            if (
                axios.isAxiosError(loadError) &&
                loadError.response?.status === 401
            ) {
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setPatient(null);
            } else {
                setError(errorMessage(loadError));
            }
        } finally {
            setLoading(false);
        }
    }, [client, patient?.id]);

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
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setPatient(null);
            } else {
                setError(errorMessage(scheduleError));
            }
        }
    }, [client, patient?.id]);

    useEffect(() => {
        if (!token || !client) {
            setLoading(false);
            return;
        }

        client
            .get<Patient & { role?: { slug: string } }>('/user')
            .then(({ data }) => {
                if (data.role?.slug !== 'patient') {
                    localStorage.removeItem(TOKEN_KEY);
                    setToken(null);
                    setError('Aplikasi ini hanya tersedia untuk akun pasien.');
                    return;
                }
                setPatient(data);
            })
            .catch((authError) => {
                localStorage.removeItem(TOKEN_KEY);
                setToken(null);
                setError(errorMessage(authError));
            });
    }, [client, token]);

    useEffect(() => {
        if (patient?.id) void loadPatientData();
    }, [patient?.id, loadPatientData]);

    useEffect(() => {
        if (!patient?.id) return;

        const refreshWhenVisible = () => {
            if (document.visibilityState === 'visible') {
                void refreshSchedule();
            }
        };
        const interval = window.setInterval(refreshWhenVisible, 30_000);
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
        if (!patient?.id) {
            setPushEnabled(false);
            return;
        }

        const pushKey = `epds_fcm_token:/api/v1/web-push-subscriptions:${patient.id}`;
        setPushEnabled(
            Notification.permission === 'granted' &&
                Boolean(localStorage.getItem(pushKey)),
        );
    }, [patient?.id]);

    useEffect(() => {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<{
                notification?: { title?: string; body?: string };
                data?: { title?: string; body?: string };
            }>;
            const payload = customEvent.detail;
            if (Notification.permission === 'granted') {
                new Notification(
                    payload.notification?.title ??
                        payload.data?.title ??
                        'EPDS Sahabat Ibu',
                    {
                        body:
                            payload.notification?.body ??
                            payload.data?.body ??
                            'Ada informasi baru untuk Anda.',
                        icon: '/pwa-icon.svg',
                    },
                );
            }
            void loadPatientData();
        };
        window.addEventListener('fcm:foreground', handler);
        return () => window.removeEventListener('fcm:foreground', handler);
    }, [loadPatientData]);

    useEffect(() => {
        const handler = (event: Event) => {
            event.preventDefault();
            setInstallPrompt(event as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    async function submitAuth(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError('');
        try {
            if (authMode === 'register') {
                await axios.post(`${API_URL}/register`, {
                    name: fullName,
                    email,
                    password,
                    confirm_password: password,
                });
            }
            const response = await axios.post<
                ApiResponse<{
                    id: string;
                    email: string;
                    name: string;
                    token: string;
                    role: string;
                }>
            >(`${API_URL}/login`, { email, password });
            const authenticated = response.data.data;
            if (authenticated.role !== 'patient') {
                throw new Error(
                    'Aplikasi ini hanya tersedia untuk akun pasien.',
                );
            }
            localStorage.setItem(TOKEN_KEY, authenticated.token);
            setToken(authenticated.token);
            setPatient({
                id: authenticated.id,
                name: authenticated.name,
                email: authenticated.email,
            });
            setSuccess('Berhasil masuk. Selamat datang kembali.');
        } catch (authError) {
            setError(errorMessage(authError));
        } finally {
            setBusy(false);
        }
    }

    async function logout() {
        if (client && patient) {
            const pushKey = `epds_fcm_token:/api/v1/web-push-subscriptions:${patient.id}`;
            const pushToken = localStorage.getItem(pushKey);
            if (pushToken) {
                try {
                    await client.delete('/web-push-subscriptions', {
                        data: { token: pushToken },
                    });
                    localStorage.removeItem(pushKey);
                } catch {
                    // A failed remote unsubscribe must not prevent signing out locally.
                }
            }
            try {
                await client.post('/logout');
            } catch {
                // Clear the local token even if the network is unavailable.
            }
        }
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setPatient(null);
        setSection('home');
        setSuccess('');
    }

    async function saveProfile(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!client || !patient) return;
        setBusy(true);
        setError('');
        try {
            const response = await client.put<ApiResponse<Patient>>(
                `/patient/${patient.id}`,
                profile,
            );
            setPatient(response.data.data);
            setEditingProfile(false);
            setProfileComplete(true);
            setSuccess('Profil berhasil disimpan.');
            await loadPatientData();
        } catch (saveError) {
            setError(errorMessage(saveError));
        } finally {
            setBusy(false);
        }
    }

    async function saveBaby(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!client || !patient) return;
        setBusy(true);
        setError('');
        const { birth_date, birth_hour, birth_minute, ...babyData } = babyForm;
        const payload = {
            ...babyData,
            date_of_birth: `${birth_date} ${birth_hour}:${birth_minute}:00`,
            mother_id: patient.id,
        };
        try {
            if (editingBabyId) {
                await client.put(`/baby/${editingBabyId}`, payload);
            } else {
                await client.post('/baby', payload);
            }
            setBabyForm(emptyBaby);
            setBabyFormOpen(false);
            setEditingBabyId(null);
            setSuccess('Data bayi berhasil disimpan.');
            await loadPatientData();
        } catch (saveError) {
            setError(errorMessage(saveError));
        } finally {
            setBusy(false);
        }
    }

    async function removeBaby(babyId: string) {
        if (!client || !window.confirm('Hapus data bayi ini?')) return;
        setBusy(true);
        try {
            await client.delete(`/baby/${babyId}`);
            setSuccess('Data bayi berhasil dihapus.');
            await loadPatientData();
        } catch (deleteError) {
            setError(errorMessage(deleteError));
        } finally {
            setBusy(false);
        }
    }

    const fetchOptions = useCallback(
        async <T,>(url: string): Promise<T[]> => {
            if (!client) return [];
            const response = await client.get<ApiResponse<T[]>>(url);
            return response.data.data ?? [];
        },
        [client],
    );

    async function submitScreening(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (screeningStep === 'condition') {
            setScreeningStep('epds');
            return;
        }
        if (!client) return;
        setBusy(true);
        setError('');
        try {
            const today = new Date();
            const dateFilled = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, '0'),
                String(today.getDate()).padStart(2, '0'),
            ].join('-');
            const response = await client.post<ApiResponse<Result>>(
                '/postpartum-visit',
                {
                    date_filled: dateFilled,
                    parity_count: condition.parity_count,
                    sleep_quality: Number(condition.sleep_quality),
                    partner_support: Number(condition.partner_support),
                    live_with_partner: condition.live_with_partner === 'true',
                    family_salary_permonth: Number(
                        condition.family_salary_permonth,
                    ),
                    dependent_family_count: Number(
                        condition.dependent_family_count,
                    ),
                    is_salary_sufficient: Number(
                        condition.is_salary_sufficient,
                    ),
                    psych_history: condition.psych_history === 'true',
                    psych_treatment: condition.psych_treatment === 'true',
                    psych_trauma: condition.psych_trauma === 'true',
                    feel_unsafe: Number(condition.feel_unsafe),
                    pregnancy_planned: Number(condition.pregnancy_planned),
                    preg_comp_history: condition.preg_comp_history === 'true',
                    last_comp: condition.last_comp === 'true',
                    last_comp_note: condition.last_comp_note,
                    baby_caregiver: condition.baby_caregiver,
                    answers: questions.map((question) => ({
                        question_id: question.id,
                        answer: answers[question.id],
                    })),
                },
            );
            setResult(response.data.data);
            setSection('history');
            setScreeningStep('condition');
            setCondition(emptyCondition);
            setAnswers({});
            setSuccess(
                'Skrining berhasil dikirim. Hasil skrining Anda sudah tersedia.',
            );
            await loadPatientData();
        } catch (submitError) {
            setError(errorMessage(submitError));
        } finally {
            setBusy(false);
        }
    }

    async function markNotificationRead(item: PatientNotification) {
        if (!client || item.read_at) return;
        try {
            await client.post(`/notifications/${item.id}/read`);
            setNotifications((items) =>
                items.map((notification) =>
                    notification.id === item.id
                        ? { ...notification, read_at: new Date().toISOString() }
                        : notification,
                ),
            );
            setUnreadCount((count) => Math.max(0, count - 1));
        } catch (readError) {
            setError(errorMessage(readError));
        }
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
            setError(errorMessage(pushError));
        }
    }

    async function installApp() {
        if (!installPrompt) return;
        await installPrompt.prompt();
        await installPrompt.userChoice;
        setInstallPrompt(null);
    }

    const babies = patient?.babies ?? [];
    const screenTitle = {
        home: 'Beranda',
        profile: 'Profil saya',
        baby: 'Data bayi',
        screening: 'Skrining EPDS',
        history: 'Hasil & riwayat',
        notifications: 'Notifikasi',
    }[section];

    if (loading && token && !patient) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Head title="EPDS Sahabat Ibu">
                <link rel="manifest" href="/manifest.webmanifest" />
                <meta name="theme-color" content="#FB93A4" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
            </Head>
            <main className="min-h-screen bg-[#FEF6F7] pb-24 text-slate-800">
                {!token || !patient ? (
                    <AuthScreen
                        mode={authMode}
                        setMode={setAuthMode}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        fullName={fullName}
                        setFullName={setFullName}
                        onSubmit={submitAuth}
                        busy={busy}
                        error={error}
                    />
                ) : (
                    <div className="mx-auto min-h-screen max-w-xl">
                        <header className="sticky top-0 z-20 border-b border-rose-100 bg-[#FEF6F7]/95 px-5 py-4 backdrop-blur">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold tracking-[0.18em] text-rose-400 uppercase">
                                        EPDS Sahabat Ibu
                                    </p>
                                    <h1 className="text-xl font-bold">
                                        {screenTitle}
                                    </h1>
                                </div>
                                <button
                                    type="button"
                                    aria-label="Buka notifikasi"
                                    onClick={() => setSection('notifications')}
                                    className="relative flex size-11 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                            {unreadCount > 9
                                                ? '9+'
                                                : unreadCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </header>

                        <div className="space-y-5 px-5 py-5">
                            {error && (
                                <Notice
                                    tone="error"
                                    text={error}
                                    onClose={() => setError('')}
                                />
                            )}
                            {success && (
                                <Notice
                                    tone="success"
                                    text={success}
                                    onClose={() => setSuccess('')}
                                />
                            )}

                            {section === 'home' && (
                                <HomeScreen
                                    patient={patient}
                                    schedule={schedule}
                                    babies={babies}
                                    profileComplete={profileComplete}
                                    pushEnabled={pushEnabled}
                                    installPrompt={Boolean(installPrompt)}
                                    onScreening={() => setSection('screening')}
                                    onProfile={() => {
                                        setEditingProfile(true);
                                        setSection('profile');
                                    }}
                                    onEnablePush={enableNotifications}
                                    onInstall={installApp}
                                    onBaby={() => setSection('baby')}
                                    onHistory={() => setSection('history')}
                                />
                            )}

                            {section === 'profile' && (
                                <ProfileScreen
                                    profile={profile}
                                    setProfile={setProfile}
                                    editing={editingProfile || !profileComplete}
                                    setEditing={setEditingProfile}
                                    onSubmit={saveProfile}
                                    busy={busy}
                                    fetchOptions={fetchOptions}
                                    client={client}
                                    onLogout={logout}
                                    patientNumber={patient.number_patient}
                                    patientEmail={patient.email}
                                    userId={patient.id}
                                />
                            )}

                            {section === 'baby' && (
                                <BabyScreen
                                    babies={babies}
                                    form={babyForm}
                                    setForm={setBabyForm}
                                    formOpen={babyFormOpen}
                                    setFormOpen={setBabyFormOpen}
                                    editingId={editingBabyId}
                                    setEditingId={setEditingBabyId}
                                    onSubmit={saveBaby}
                                    onDelete={removeBaby}
                                    busy={busy}
                                />
                            )}

                            {section === 'screening' && (
                                <ScreeningScreen
                                    schedule={schedule}
                                    questions={questions}
                                    step={screeningStep}
                                    setStep={setScreeningStep}
                                    condition={condition}
                                    setCondition={setCondition}
                                    answers={answers}
                                    setAnswers={setAnswers}
                                    onSubmit={submitScreening}
                                    busy={busy}
                                    onBack={() => setSection('home')}
                                />
                            )}

                            {section === 'history' && (
                                <HistoryScreen
                                    items={history}
                                    previousVisit={previousVisit}
                                    result={result}
                                    onScreening={() => setSection('screening')}
                                    canFill={Boolean(schedule?.canFill)}
                                />
                            )}

                            {section === 'notifications' && (
                                <NotificationsScreen
                                    items={notifications}
                                    onRead={markNotificationRead}
                                    onEnablePush={enableNotifications}
                                    pushEnabled={pushEnabled}
                                />
                            )}

                            {loading && (
                                <p className="text-center text-sm text-slate-500">
                                    Memperbarui data…
                                </p>
                            )}
                        </div>

                        <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-xl justify-around border-t border-rose-100 bg-white/95 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] backdrop-blur">
                            <NavButton
                                active={section === 'home'}
                                label="Beranda"
                                icon={<Home size={20} />}
                                onClick={() => setSection('home')}
                            />
                            <NavButton
                                active={section === 'baby'}
                                label="Bayi"
                                icon={<BabyIcon size={20} />}
                                onClick={() => setSection('baby')}
                            />
                            <NavButton
                                active={section === 'screening'}
                                label="Skrining"
                                icon={<ClipboardList size={20} />}
                                onClick={() => setSection('screening')}
                            />
                            <NavButton
                                active={section === 'history'}
                                label="Riwayat"
                                icon={<Activity size={20} />}
                                onClick={() => setSection('history')}
                            />
                            <NavButton
                                active={section === 'profile'}
                                label="Profil"
                                icon={<UserRound size={20} />}
                                onClick={() => setSection('profile')}
                            />
                        </nav>
                    </div>
                )}
            </main>
        </>
    );
}

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
}

function LoadingScreen() {
    return (
        <main className="grid min-h-screen place-items-center bg-[#FEF6F7]">
            <div className="text-center">
                <div className="mx-auto mb-4 size-12 animate-pulse rounded-full bg-rose-300" />
                <p className="font-semibold text-rose-500">
                    Menyiapkan ruang sehat ibu…
                </p>
            </div>
        </main>
    );
}

function Notice({
    tone,
    text,
    onClose,
}: {
    tone: 'error' | 'success';
    text: string;
    onClose: () => void;
}) {
    return (
        <div
            className={`flex items-start justify-between gap-3 rounded-2xl px-4 py-3 text-sm ${tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}
        >
            <span>{text}</span>
            <button
                type="button"
                onClick={onClose}
                aria-label="Tutup pemberitahuan"
            >
                ×
            </button>
        </div>
    );
}

function AuthScreen(props: {
    mode: 'login' | 'register';
    setMode: (mode: 'login' | 'register') => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    fullName: string;
    setFullName: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    busy: boolean;
    error: string;
}) {
    return (
        <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-10">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-5 grid size-24 place-items-center rounded-[2rem] bg-rose-200 text-rose-600 shadow-lg shadow-rose-100">
                    <Heart size={42} fill="currentColor" />
                </div>
                <p className="text-sm font-bold tracking-[0.2em] text-rose-500 uppercase">
                    EPDS Sahabat Ibu
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-800">
                    Temani masa nifas dengan lebih tenang
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Pantau jadwal, isi skrining, dan lihat dukungan kesehatan
                    ibu dari satu tempat.
                </p>
            </div>
            <form
                onSubmit={props.onSubmit}
                className="grid gap-4 rounded-[2rem] bg-white p-6 shadow-xl shadow-rose-100/60"
            >
                {props.error && (
                    <p
                        role="alert"
                        className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                    >
                        {props.error}
                    </p>
                )}
                {props.mode === 'register' && (
                    <Field label="Nama lengkap">
                        <TextInput
                            required
                            autoComplete="name"
                            value={props.fullName}
                            onChange={(event) =>
                                props.setFullName(event.target.value)
                            }
                            placeholder="Nama ibu"
                        />
                    </Field>
                )}
                <Field label="Email">
                    <TextInput
                        type="email"
                        required
                        autoComplete="email"
                        value={props.email}
                        onChange={(event) => props.setEmail(event.target.value)}
                        placeholder="nama@email.com"
                    />
                </Field>
                <Field label="Kata sandi">
                    <TextInput
                        type="password"
                        required
                        minLength={8}
                        autoComplete={
                            props.mode === 'login'
                                ? 'current-password'
                                : 'new-password'
                        }
                        value={props.password}
                        onChange={(event) =>
                            props.setPassword(event.target.value)
                        }
                        placeholder="Minimal 8 karakter"
                    />
                </Field>
                <AppButton
                    type="submit"
                    disabled={props.busy}
                    className="mt-2 w-full"
                >
                    {props.busy
                        ? 'Memproses…'
                        : props.mode === 'login'
                          ? 'Masuk'
                          : 'Daftar sebagai pasien'}
                </AppButton>
                <button
                    type="button"
                    onClick={() =>
                        props.setMode(
                            props.mode === 'login' ? 'register' : 'login',
                        )
                    }
                    className="py-2 text-sm font-medium text-rose-600"
                >
                    {props.mode === 'login'
                        ? 'Belum punya akun? Daftar'
                        : 'Sudah punya akun? Masuk'}
                </button>
                <p className="text-center text-xs leading-5 text-slate-400">
                    Data skrining bersifat pribadi dan digunakan untuk membantu
                    pemantauan kesehatan Anda.
                </p>
            </form>
        </div>
    );
}

function HomeScreen(props: {
    patient: Patient;
    schedule: Schedule | null;
    babies: Baby[];
    profileComplete: boolean;
    pushEnabled: boolean;
    installPrompt: boolean;
    onScreening: () => void;
    onProfile: () => void;
    onEnablePush: () => void;
    onInstall: () => void;
    onBaby: () => void;
    onHistory: () => void;
}) {
    const scheduleDate = props.schedule?.nextVisitDate
        ? new Date(props.schedule.nextVisitDate).toLocaleString('id-ID', {
              dateStyle: 'medium',
              timeStyle: 'short',
          })
        : null;
    const newestBaby = props.babies[0];

    return (
        <>
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-400 to-pink-300 p-6 text-white shadow-xl shadow-rose-200">
                <p className="text-sm font-medium text-white/80">
                    Halo, {props.patient.name.split(' ')[0]} 👋
                </p>
                <h2 className="mt-2 max-w-xs text-2xl leading-tight font-bold">
                    Ibu yang sehat, awal yang baik untuk keluarga.
                </h2>
                <p className="mt-3 text-sm text-white/85">
                    Satu langkah kecil hari ini berarti banyak untuk kesehatan
                    Anda.
                </p>
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/20 p-4 backdrop-blur">
                    <CalendarDays size={22} />
                    <div className="min-w-0 flex-1">
                        <p className="text-xs text-white/75">Jadwal skrining</p>
                        <p className="font-semibold">
                            {props.schedule?.label ?? 'Memuat jadwal…'}
                        </p>
                        {scheduleDate && (
                            <p className="text-xs text-white/80">
                                {scheduleDate}
                            </p>
                        )}
                    </div>
                    {props.schedule?.canFill && (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-500">
                            Tersedia
                        </span>
                    )}
                </div>
                {props.schedule?.canFill && (
                    <AppButton
                        onClick={props.onScreening}
                        className="mt-4 w-full bg-white text-rose-600 shadow-none hover:bg-rose-50"
                    >
                        Mulai skrining <ChevronRight size={18} />
                    </AppButton>
                )}
            </section>

            {!props.profileComplete && (
                <ActionCard
                    icon={<UserRound size={21} />}
                    title="Lengkapi profil ibu"
                    detail="Isi data diri dan fasilitas kesehatan agar pemantauan lebih sesuai."
                    action="Lengkapi profil"
                    onClick={props.onProfile}
                />
            )}

            <section className="grid grid-cols-2 gap-3">
                <QuickCard
                    icon={<BabyIcon size={20} />}
                    label="Data bayi"
                    value={
                        newestBaby
                            ? `Anak ke-${newestBaby.which_child}`
                            : 'Belum ada bayi'
                    }
                    onClick={props.onBaby}
                />
                <QuickCard
                    icon={<Activity size={20} />}
                    label="Riwayat skrining"
                    value="Lihat hasil sebelumnya"
                    onClick={props.onHistory}
                />
            </section>

            {!props.pushEnabled && (
                <ActionCard
                    icon={<Bell size={21} />}
                    title="Aktifkan pengingat penting"
                    detail="Dapatkan notifikasi jadwal skrining meski aplikasi tidak sedang dibuka."
                    action="Aktifkan notifikasi"
                    onClick={props.onEnablePush}
                />
            )}
            {props.installPrompt && (
                <ActionCard
                    icon={<Home size={21} />}
                    title="Pasang di perangkat"
                    detail="Buka EPDS lebih cepat dari layar utama."
                    action="Pasang aplikasi"
                    onClick={props.onInstall}
                />
            )}

            <section className="rounded-[1.75rem] border border-rose-100 bg-white p-5">
                <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                        <ShieldCheck size={22} />
                    </div>
                    <div>
                        <h3 className="font-bold">Anda tidak sendiri</h3>
                        <p className="text-sm text-slate-500">
                            Skrining membantu memantau perasaan ibu setelah
                            melahirkan.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

function QuickCard({
    icon,
    label,
    value,
    onClick,
}: {
    icon: ReactNode;
    label: string;
    value: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="min-h-32 rounded-[1.5rem] border border-rose-100 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <span className="mb-3 grid size-10 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                {icon}
            </span>
            <span className="block text-xs text-slate-500">{label}</span>
            <span className="mt-1 block text-sm font-bold">{value}</span>
        </button>
    );
}

function ActionCard({
    icon,
    title,
    detail,
    action,
    onClick,
}: {
    icon: ReactNode;
    title: string;
    detail: string;
    action: string;
    onClick: () => void;
}) {
    return (
        <div className="flex items-start gap-3 rounded-[1.5rem] border border-rose-100 bg-white p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                {icon}
            </span>
            <div className="flex-1">
                <p className="font-bold">{title}</p>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                    {detail}
                </p>
                <AppButton
                    variant="secondary"
                    onClick={onClick}
                    className="mt-3 min-h-10 px-3"
                >
                    {action}
                </AppButton>
            </div>
        </div>
    );
}

function ProfileScreen(props: {
    profile: ProfileForm;
    setProfile: React.Dispatch<React.SetStateAction<ProfileForm>>;
    editing: boolean;
    setEditing: (value: boolean) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    busy: boolean;
    fetchOptions: <T>(url: string) => Promise<T[]>;
    client: ReturnType<typeof apiFor> | null;
    onLogout: () => void;
    patientNumber?: string | null;
    patientEmail: string;
    userId: string;
}) {
    const { client, fetchOptions } = props;
    const provinceId = props.profile.province_id;
    const regencyId = props.profile.city_or_district_id;
    const districtId = props.profile.subdistrict_id;
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [villages, setVillages] = useState<Region[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [passwords, setPasswords] = useState({
        current: '',
        next: '',
        confirmation: '',
    });
    const [passwordMessage, setPasswordMessage] = useState('');
    const [email, setEmail] = useState(props.patientEmail);
    const [emailMessage, setEmailMessage] = useState('');

    useEffect(() => {
        fetchOptions<Region>('/region/provinces')
            .then(setProvinces)
            .catch(() => setProvinces([]));
    }, [fetchOptions]);

    useEffect(() => {
        if (!provinceId) return;
        fetchOptions<Region>(`/region/regencies/${provinceId}`)
            .then(setRegencies)
            .catch(() => setRegencies([]));
    }, [fetchOptions, provinceId]);

    useEffect(() => {
        if (!regencyId) return;
        fetchOptions<Region>(`/region/districts/${regencyId}`)
            .then(setDistricts)
            .catch(() => setDistricts([]));
        client
            ?.get<ApiResponse<Facility[]>>(
                `/facilities?regency_id=${regencyId}`,
            )
            .then(({ data }) => setFacilities(data.data))
            .catch(() => setFacilities([]));
    }, [client, fetchOptions, regencyId]);

    useEffect(() => {
        if (!districtId) return;
        fetchOptions<Region>(`/region/villages/${districtId}`)
            .then(setVillages)
            .catch(() => setVillages([]));
    }, [fetchOptions, districtId]);

    function updateProfile(key: keyof ProfileForm, value: string) {
        props.setProfile((current) => ({ ...current, [key]: value }));
    }

    async function changePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const client = props.client;
        const userId = props.userId;
        if (!client || !userId) return;
        setPasswordMessage('');
        try {
            await client.put(`/user/${userId}/change-password`, {
                old_password: passwords.current,
                new_password: passwords.next,
                confirm_password: passwords.confirmation,
            });
            setPasswordMessage('Kata sandi berhasil diperbarui.');
            setPasswords({ current: '', next: '', confirmation: '' });
        } catch (passwordError) {
            setPasswordMessage(errorMessage(passwordError));
        }
    }

    async function changeEmail(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!client) return;
        setEmailMessage('');
        try {
            await client.put(`/user/${props.userId}/change-email`, { email });
            setEmailMessage(
                'Email diperbarui. Verifikasi alamat baru melalui email.',
            );
        } catch (emailError) {
            setEmailMessage(errorMessage(emailError));
        }
    }

    return (
        <div className="space-y-4">
            <section className="rounded-[1.75rem] bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold">Data ibu</h2>
                        <p className="text-sm text-slate-500">
                            {props.patientNumber
                                ? `Nomor pasien ${props.patientNumber}`
                                : 'Lengkapi data untuk memulai.'}
                        </p>
                    </div>
                    {!props.editing && (
                        <AppButton
                            variant="secondary"
                            onClick={() => props.setEditing(true)}
                        >
                            Ubah
                        </AppButton>
                    )}
                </div>
                <form onSubmit={props.onSubmit} className="grid gap-4">
                    <Field label="Nama lengkap">
                        <TextInput
                            required
                            disabled={!props.editing}
                            value={props.profile.name}
                            onChange={(event) =>
                                updateProfile('name', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Nomor telepon">
                        <TextInput
                            required
                            disabled={!props.editing}
                            value={props.profile.phone_number}
                            onChange={(event) =>
                                updateProfile(
                                    'phone_number',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Tempat lahir">
                            <TextInput
                                required
                                disabled={!props.editing}
                                value={props.profile.birthplace}
                                onChange={(event) =>
                                    updateProfile(
                                        'birthplace',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                        <Field label="Tanggal lahir">
                            <TextInput
                                type="date"
                                required
                                disabled={!props.editing}
                                value={props.profile.date_of_birth}
                                onChange={(event) =>
                                    updateProfile(
                                        'date_of_birth',
                                        event.target.value,
                                    )
                                }
                            />
                        </Field>
                    </div>
                    <Field label="Pekerjaan">
                        <TextInput
                            required
                            disabled={!props.editing}
                            value={props.profile.job}
                            onChange={(event) =>
                                updateProfile('job', event.target.value)
                            }
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Status pernikahan">
                            <SelectInput
                                aria-label="status pernikahan"
                                disabled={!props.editing}
                                value={props.profile.married_status}
                                onChange={(event) =>
                                    updateProfile(
                                        'married_status',
                                        event.target.value,
                                    )
                                }
                                options={[
                                    { value: 'married', label: 'Menikah' },
                                    {
                                        value: 'not_married',
                                        label: 'Belum menikah',
                                    },
                                    { value: 'divorced', label: 'Bercerai' },
                                ]}
                            />
                        </Field>
                        <Field label="Pendidikan terakhir">
                            <SelectInput
                                aria-label="pendidikan"
                                disabled={!props.editing}
                                value={props.profile.highest_education}
                                onChange={(event) =>
                                    updateProfile(
                                        'highest_education',
                                        event.target.value,
                                    )
                                }
                                options={[
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
                                ].map((value) => ({ value, label: value }))}
                            />
                        </Field>
                    </div>
                    <Field label="Provinsi">
                        <SelectInput
                            aria-label="provinsi"
                            disabled={!props.editing}
                            value={props.profile.province_id}
                            onChange={(event) => {
                                const option = provinces.find(
                                    (item) => item.code === event.target.value,
                                );
                                props.setProfile((current) => ({
                                    ...current,
                                    province_id: event.target.value,
                                    province: option?.name ?? '',
                                    city_or_district_id: '',
                                    city_or_district: '',
                                    subdistrict_id: '',
                                    subdistrict: '',
                                    village_id: '',
                                    village: '',
                                    facility_id: '',
                                }));
                            }}
                            options={provinces.map((item) => ({
                                value: item.code,
                                label: item.name,
                            }))}
                        />
                    </Field>
                    <Field label="Kabupaten / kota">
                        <SelectInput
                            aria-label="kabupaten atau kota"
                            disabled={!props.editing || !regencies.length}
                            value={props.profile.city_or_district_id}
                            onChange={(event) => {
                                const option = regencies.find(
                                    (item) => item.code === event.target.value,
                                );
                                props.setProfile((current) => ({
                                    ...current,
                                    city_or_district_id: event.target.value,
                                    city_or_district: option?.name ?? '',
                                    subdistrict_id: '',
                                    subdistrict: '',
                                    village_id: '',
                                    village: '',
                                    facility_id: '',
                                }));
                            }}
                            options={regencies.map((item) => ({
                                value: item.code,
                                label: item.name,
                            }))}
                        />
                    </Field>
                    <Field label="Kecamatan">
                        <SelectInput
                            aria-label="kecamatan"
                            disabled={!props.editing || !districts.length}
                            value={props.profile.subdistrict_id}
                            onChange={(event) => {
                                const option = districts.find(
                                    (item) => item.code === event.target.value,
                                );
                                props.setProfile((current) => ({
                                    ...current,
                                    subdistrict_id: event.target.value,
                                    subdistrict: option?.name ?? '',
                                    village_id: '',
                                    village: '',
                                }));
                            }}
                            options={districts.map((item) => ({
                                value: item.code,
                                label: item.name,
                            }))}
                        />
                    </Field>
                    <Field label="Kelurahan / desa">
                        <SelectInput
                            aria-label="desa"
                            disabled={!props.editing || !villages.length}
                            value={props.profile.village_id}
                            onChange={(event) => {
                                const option = villages.find(
                                    (item) => item.code === event.target.value,
                                );
                                props.setProfile((current) => ({
                                    ...current,
                                    village_id: event.target.value,
                                    village: option?.name ?? '',
                                }));
                            }}
                            options={villages.map((item) => ({
                                value: item.code,
                                label: item.name,
                            }))}
                        />
                    </Field>
                    <Field label="Fasilitas kesehatan">
                        <SelectInput
                            aria-label="fasilitas kesehatan"
                            disabled={!props.editing || !facilities.length}
                            value={props.profile.facility_id}
                            onChange={(event) =>
                                updateProfile('facility_id', event.target.value)
                            }
                            options={facilities.map((item) => ({
                                value: item.id,
                                label: `${item.name}${item.facility_type ? ` · ${item.facility_type}` : ''}`,
                            }))}
                        />
                    </Field>
                    <Field label="Alamat">
                        <textarea
                            required
                            disabled={!props.editing}
                            value={props.profile.address}
                            onChange={(event) =>
                                updateProfile('address', event.target.value)
                            }
                            className="min-h-24 rounded-2xl border border-rose-100 bg-white p-4 text-sm outline-none focus:border-rose-300 disabled:bg-slate-50"
                        />
                    </Field>
                    {props.editing && (
                        <AppButton type="submit" disabled={props.busy}>
                            {props.busy ? 'Menyimpan…' : 'Simpan profil'}
                        </AppButton>
                    )}
                </form>
            </section>

            <form
                onSubmit={changePassword}
                className="grid gap-4 rounded-[1.75rem] bg-white p-5"
            >
                <h2 className="font-bold">Ubah kata sandi</h2>
                {passwordMessage && (
                    <p className="text-sm text-rose-600">{passwordMessage}</p>
                )}
                <Field label="Kata sandi saat ini">
                    <TextInput
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
                    />
                </Field>
                <Field label="Kata sandi baru">
                    <TextInput
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
                    />
                </Field>
                <Field label="Ulangi kata sandi baru">
                    <TextInput
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
                    />
                </Field>
                <AppButton type="submit" variant="secondary">
                    Perbarui kata sandi
                </AppButton>
            </form>
            <form
                onSubmit={changeEmail}
                className="grid gap-4 rounded-[1.75rem] bg-white p-5"
            >
                <h2 className="font-bold">Ubah email akun</h2>
                {emailMessage && (
                    <p className="text-sm text-rose-600">{emailMessage}</p>
                )}
                <Field label="Email baru">
                    <TextInput
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Field>
                <AppButton type="submit" variant="secondary">
                    Perbarui email
                </AppButton>
            </form>
            <AppButton
                variant="danger"
                onClick={props.onLogout}
                className="w-full"
            >
                <LogOut size={17} /> Keluar
            </AppButton>
        </div>
    );
}

function BabyScreen(props: {
    babies: Baby[];
    form: BabyForm;
    setForm: React.Dispatch<React.SetStateAction<BabyForm>>;
    formOpen: boolean;
    setFormOpen: (value: boolean) => void;
    editingId: string | null;
    setEditingId: (value: string | null) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onDelete: (babyId: string) => void;
    busy: boolean;
}) {
    const babies = [...props.babies].sort(
        (left, right) => left.which_child - right.which_child,
    );

    function editBaby(baby: Baby) {
        props.setEditingId(baby.id);
        const birthDateTime = toDateTimeLocalValue(baby.date_of_birth);
        props.setForm({
            which_child: String(baby.which_child),
            birth_date: birthDateTime.slice(0, 10),
            birth_hour: birthDateTime.slice(11, 13),
            birth_minute: birthDateTime.slice(14, 16),
            baby_condition: String(valueOf(baby.baby_condition)),
            typeof_delivery: String(valueOf(baby.typeof_delivery)),
            gender: baby.gender,
            baby_feeding_method: String(valueOf(baby.baby_feeding_method)),
        });
        props.setFormOpen(true);
    }

    return (
        <div className="space-y-4">
            {babies.length === 0 && (
                <EmptyState
                    icon={<BabyIcon />}
                    title="Data bayi belum tersedia"
                    detail="Tambahkan data bayi untuk melihat jadwal skrining nifas."
                />
            )}
            {babies.map((baby) => (
                <article
                    key={baby.id}
                    className="rounded-[1.75rem] border border-rose-100 bg-white p-5"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                <BabyIcon size={23} />
                            </div>
                            <div>
                                <h2 className="font-bold">
                                    Anak ke-{baby.which_child}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Lahir{' '}
                                    {new Date(
                                        baby.date_of_birth,
                                    ).toLocaleString('id-ID', {
                                        dateStyle: 'long',
                                        timeStyle: 'short',
                                    })}
                                </p>
                            </div>
                        </div>
                        <AppButton
                            variant="plain"
                            onClick={() => editBaby(baby)}
                        >
                            Ubah
                        </AppButton>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                        <p className="rounded-xl bg-rose-50 p-3">
                            Jenis kelamin
                            <br />
                            <b>
                                {baby.gender === 'female'
                                    ? 'Perempuan'
                                    : 'Laki-laki'}
                            </b>
                        </p>
                        <p className="rounded-xl bg-rose-50 p-3">
                            Pemberian makan
                            <br />
                            <b>
                                {
                                    [
                                        'ASI eksklusif',
                                        'ASI dan formula',
                                        'Susu formula',
                                    ][valueOf(baby.baby_feeding_method)]
                                }
                            </b>
                        </p>
                    </div>
                    <AppButton
                        variant="danger"
                        onClick={() => props.onDelete(baby.id)}
                        className="mt-3 min-h-9 px-3"
                    >
                        Hapus data
                    </AppButton>
                </article>
            ))}
            {!props.formOpen && (
                <AppButton
                    onClick={() => {
                        props.setEditingId(null);
                        props.setForm(emptyBaby);
                        props.setFormOpen(true);
                    }}
                    className="w-full"
                >
                    <Plus size={18} /> Tambah data bayi
                </AppButton>
            )}
            {props.formOpen && (
                <form
                    onSubmit={props.onSubmit}
                    className="grid gap-4 rounded-[1.75rem] bg-white p-5"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="font-bold">
                            {props.editingId
                                ? 'Ubah data bayi'
                                : 'Tambah data bayi'}
                        </h2>
                        <AppButton
                            type="button"
                            variant="plain"
                            onClick={() => props.setFormOpen(false)}
                        >
                            Tutup
                        </AppButton>
                    </div>
                    <Field label="Anak ke">
                        <TextInput
                            type="number"
                            min="1"
                            required
                            value={props.form.which_child}
                            onChange={(event) =>
                                props.setForm({
                                    ...props.form,
                                    which_child: event.target.value,
                                })
                            }
                        />
                    </Field>
                    <Field label="Tanggal lahir">
                        <TextInput
                            type="date"
                            required
                            max={currentDateTimeLocalValue().slice(0, 10)}
                            value={props.form.birth_date}
                            onChange={(event) =>
                                props.setForm({
                                    ...props.form,
                                    birth_date: event.target.value,
                                })
                            }
                        />
                    </Field>
                    <Field
                        label="Jam lahir"
                        hint="Pilih jam dan menit dari daftar."
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <SelectInput
                                aria-label="jam lahir"
                                required
                                value={props.form.birth_hour}
                                onChange={(event) =>
                                    props.setForm({
                                        ...props.form,
                                        birth_hour: event.target.value,
                                    })
                                }
                                options={Array.from(
                                    { length: 24 },
                                    (_, hour) => {
                                        const value = String(hour).padStart(
                                            2,
                                            '0',
                                        );
                                        const isFutureHour =
                                            props.form.birth_date ===
                                                currentDateTimeLocalValue().slice(
                                                    0,
                                                    10,
                                                ) &&
                                            hour >
                                                Number(
                                                    currentDateTimeLocalValue().slice(
                                                        11,
                                                        13,
                                                    ),
                                                );

                                        return {
                                            value,
                                            label: value,
                                            disabled: isFutureHour,
                                        };
                                    },
                                )}
                            />
                            <SelectInput
                                aria-label="menit lahir"
                                required
                                value={props.form.birth_minute}
                                onChange={(event) =>
                                    props.setForm({
                                        ...props.form,
                                        birth_minute: event.target.value,
                                    })
                                }
                                options={Array.from(
                                    { length: 60 },
                                    (_, minute) => {
                                        const value = String(minute).padStart(
                                            2,
                                            '0',
                                        );
                                        const currentTime =
                                            currentDateTimeLocalValue();
                                        const isFutureMinute =
                                            props.form.birth_date ===
                                                currentTime.slice(0, 10) &&
                                            props.form.birth_hour ===
                                                currentTime.slice(11, 13) &&
                                            minute > Number(currentTime.slice(14, 16));

                                        return {
                                            value,
                                            label: value,
                                            disabled: isFutureMinute,
                                        };
                                    },
                                )}
                            />
                        </div>
                    </Field>
                    <Field label="Kondisi bayi">
                        <SelectInput
                            aria-label="kondisi bayi"
                            value={props.form.baby_condition}
                            onChange={(event) =>
                                props.setForm({
                                    ...props.form,
                                    baby_condition: event.target.value,
                                })
                            }
                            options={[
                                { value: '0', label: 'Bayi lahir hidup' },
                                {
                                    value: '1',
                                    label: 'Lahir hidup dengan asfiksia',
                                },
                                { value: '2', label: 'Bayi lahir mati' },
                            ]}
                        />
                    </Field>
                    <Field label="Jenis persalinan">
                        <SelectInput
                            aria-label="jenis persalinan"
                            value={props.form.typeof_delivery}
                            onChange={(event) =>
                                props.setForm({
                                    ...props.form,
                                    typeof_delivery: event.target.value,
                                })
                            }
                            options={[
                                { value: '0', label: 'Normal' },
                                { value: '1', label: 'Operasi sesar' },
                                { value: '2', label: 'Lainnya' },
                            ]}
                        />
                    </Field>
                    <Field label="Jenis kelamin">
                        <SelectInput
                            aria-label="jenis kelamin"
                            value={props.form.gender}
                            onChange={(event) =>
                                props.setForm({
                                    ...props.form,
                                    gender: event.target.value,
                                })
                            }
                            options={[
                                { value: 'female', label: 'Perempuan' },
                                { value: 'male', label: 'Laki-laki' },
                            ]}
                        />
                    </Field>
                    <Field label="Pemberian makan">
                        <SelectInput
                            aria-label="pemberian makan"
                            value={props.form.baby_feeding_method}
                            onChange={(event) =>
                                props.setForm({
                                    ...props.form,
                                    baby_feeding_method: event.target.value,
                                })
                            }
                            options={[
                                { value: '0', label: 'ASI eksklusif' },
                                { value: '1', label: 'ASI dan susu formula' },
                                { value: '2', label: 'Susu formula' },
                            ]}
                        />
                    </Field>
                    <AppButton type="submit" disabled={props.busy}>
                        {props.busy ? 'Menyimpan…' : 'Simpan data bayi'}
                    </AppButton>
                </form>
            )}
        </div>
    );
}

function ScreeningScreen(props: {
    schedule: Schedule | null;
    questions: Question[];
    step: 'condition' | 'epds';
    setStep: (step: 'condition' | 'epds') => void;
    condition: ConditionForm;
    setCondition: React.Dispatch<React.SetStateAction<ConditionForm>>;
    answers: Record<string, string>;
    setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    busy: boolean;
    onBack: () => void;
}) {
    if (!props.schedule?.canFill) {
        return (
            <div className="space-y-4">
                <EmptyState
                    icon={<CalendarDays />}
                    title={props.schedule?.label ?? 'Jadwal belum tersedia'}
                    detail={
                        props.schedule?.message ??
                        'Lengkapi data bayi untuk melihat jadwal skrining.'
                    }
                />
                <AppButton variant="secondary" onClick={props.onBack}>
                    Kembali ke beranda
                </AppButton>
            </div>
        );
    }

    const conditionFields = [
        {
            name: 'parity_count',
            label: 'Jumlah persalinan (paritas)',
            options: [
                { value: '1', label: '1' },
                { value: '2-4', label: '2–4' },
                { value: '>5', label: 'Lebih dari 5' },
            ],
        },
        {
            name: 'sleep_quality',
            label: 'Kualitas tidur',
            options: selectOptions.sleep,
        },
        {
            name: 'partner_support',
            label: 'Dukungan pasangan',
            options: selectOptions.support,
        },
        {
            name: 'live_with_partner',
            label: 'Tinggal bersama pasangan',
            options: selectOptions.yesNo,
        },
        {
            name: 'family_salary_permonth',
            label: 'Pendapatan keluarga per bulan',
            options: selectOptions.salary,
        },
        {
            name: 'dependent_family_count',
            label: 'Jumlah tanggungan keluarga',
            options: selectOptions.dependents,
        },
        {
            name: 'is_salary_sufficient',
            label: 'Kecukupan pendapatan keluarga',
            options: selectOptions.sufficient,
        },
        {
            name: 'psych_history',
            label: 'Pernah memiliki riwayat gangguan psikologis',
            options: selectOptions.yesNo,
        },
        {
            name: 'psych_treatment',
            label: 'Pernah menjalani perawatan psikologis',
            options: selectOptions.yesNo,
        },
        {
            name: 'psych_trauma',
            label: 'Pernah mengalami trauma psikologis',
            options: selectOptions.yesNo,
        },
        {
            name: 'feel_unsafe',
            label: 'Apakah saat ini merasa tidak aman?',
            options: selectOptions.yesNoPrefer,
        },
        {
            name: 'pregnancy_planned',
            label: 'Apakah kehamilan ini direncanakan?',
            options: selectOptions.yesNoPrefer,
        },
        {
            name: 'preg_comp_history',
            label: 'Ada komplikasi selama kehamilan?',
            options: selectOptions.yesNo,
        },
        {
            name: 'last_comp',
            label: 'Ada komplikasi saat persalinan terakhir?',
            options: selectOptions.yesNo,
        },
    ];

    function setConditionValue(key: string, value: string) {
        props.setCondition((current) => ({ ...current, [key]: value }));
    }
    const selectedCaregivers = props.condition.baby_caregiver;

    return (
        <form onSubmit={props.onSubmit} className="space-y-4">
            <section className="rounded-[1.75rem] bg-white p-5">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold tracking-widest text-rose-500 uppercase">
                            {props.step === 'condition'
                                ? 'Bagian 1 dari 2'
                                : 'Bagian 2 dari 2'}
                        </p>
                        <h2 className="mt-1 text-xl font-bold">
                            {props.step === 'condition'
                                ? 'Kondisi ibu & bayi'
                                : 'Kuesioner EPDS'}
                        </h2>
                    </div>
                    <span className="rounded-full bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600">
                        KF {props.schedule.visitNumber}
                    </span>
                </div>
                {props.step === 'condition' ? (
                    <div className="grid gap-4">
                        <p className="text-sm leading-6 text-slate-500">
                            Jawaban membantu tenaga kesehatan memahami keadaan
                            ibu selama masa nifas.
                        </p>
                        {conditionFields.map((field) => (
                            <Field key={field.name} label={field.label}>
                                <SelectInput
                                    required
                                    aria-label={field.label}
                                    value={String(
                                        props.condition[field.name] ?? '',
                                    )}
                                    options={field.options}
                                    onChange={(event) =>
                                        setConditionValue(
                                            field.name,
                                            event.target.value,
                                        )
                                    }
                                />
                            </Field>
                        ))}
                        {props.condition.last_comp === 'true' && (
                            <Field label="Ceritakan komplikasi persalinan">
                                <textarea
                                    required
                                    value={String(
                                        props.condition.last_comp_note ?? '',
                                    )}
                                    onChange={(event) =>
                                        setConditionValue(
                                            'last_comp_note',
                                            event.target.value,
                                        )
                                    }
                                    className="min-h-24 rounded-2xl border border-rose-100 p-4 text-sm outline-none focus:border-rose-300"
                                />
                            </Field>
                        )}
                        <Field label="Siapa yang membantu merawat bayi?">
                            <div className="grid gap-2">
                                {[
                                    { value: '0', label: 'Pasangan' },
                                    { value: '1', label: 'Orang tua' },
                                    {
                                        value: '2',
                                        label: 'Keluarga atau pengasuh',
                                    },
                                    { value: '3', label: 'Merawat sendiri' },
                                ].map((item) => {
                                    const selected = (
                                        props.condition
                                            .baby_caregiver as string[]
                                    ).includes(item.value);
                                    return (
                                        <label
                                            key={item.value}
                                            className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${selected ? 'border-rose-300 bg-rose-50' : 'border-slate-100'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                onChange={(event) =>
                                                    props.setCondition(
                                                        (current) => ({
                                                            ...current,
                                                            baby_caregiver:
                                                                event.target
                                                                    .checked
                                                                    ? [
                                                                          ...(current.baby_caregiver as string[]),
                                                                          item.value,
                                                                      ]
                                                                    : (
                                                                          current.baby_caregiver as string[]
                                                                      ).filter(
                                                                          (
                                                                              value,
                                                                          ) =>
                                                                              value !==
                                                                              item.value,
                                                                      ),
                                                        }),
                                                    )
                                                }
                                                className="accent-rose-500"
                                            />
                                            {item.label}
                                        </label>
                                    );
                                })}
                            </div>
                        </Field>
                        <AppButton
                            type="submit"
                            disabled={
                                !Array.isArray(selectedCaregivers) ||
                                selectedCaregivers.length === 0
                            }
                        >
                            Lanjut ke EPDS <ChevronRight size={18} />
                        </AppButton>
                    </div>
                ) : (
                    <div className="grid gap-5">
                        <p className="text-sm leading-6 text-slate-500">
                            Pilih jawaban yang paling menggambarkan perasaan
                            Anda selama 7 hari terakhir.
                        </p>
                        {props.questions.map((question, index) => (
                            <fieldset
                                key={question.id}
                                className="grid gap-2 border-b border-rose-50 pb-4"
                            >
                                <legend className="mb-2 text-sm font-semibold">
                                    {index + 1}. {question.question}
                                </legend>
                                {question.options.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${props.answers[question.id] === option.option ? 'border-rose-300 bg-rose-50' : 'border-slate-100'}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            required
                                            value={option.option}
                                            checked={
                                                props.answers[question.id] ===
                                                option.option
                                            }
                                            onChange={(event) =>
                                                props.setAnswers((current) => ({
                                                    ...current,
                                                    [question.id]:
                                                        event.target.value,
                                                }))
                                            }
                                            className="mt-0.5 accent-rose-500"
                                        />
                                        {option.option_text || option.option}
                                    </label>
                                ))}
                            </fieldset>
                        ))}
                        {!props.questions.length && (
                            <p className="text-sm text-red-600">
                                Pertanyaan belum dapat dimuat. Periksa koneksi
                                lalu muat ulang.
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <AppButton
                                type="button"
                                variant="secondary"
                                onClick={() => props.setStep('condition')}
                            >
                                Kembali
                            </AppButton>
                            <AppButton
                                type="submit"
                                disabled={
                                    props.busy ||
                                    !props.questions.length ||
                                    Object.keys(props.answers).length !==
                                        props.questions.length
                                }
                            >
                                {props.busy ? 'Mengirim…' : 'Kirim skrining'}
                            </AppButton>
                        </div>
                        <p className="text-xs leading-5 text-slate-400">
                            Jika Anda merasa berisiko atau membutuhkan bantuan
                            segera, hubungi tenaga kesehatan atau layanan
                            darurat di wilayah Anda.
                        </p>
                    </div>
                )}
            </section>
        </form>
    );
}

function HistoryScreen(props: {
    items: Record<string, unknown>[];
    previousVisit: Record<string, unknown> | null;
    result: Result | null;
    onScreening: () => void;
    canFill: boolean;
}) {
    const savedResult = props.previousVisit?.result as
        | { total_score?: number }
        | undefined;
    const score = props.result?.total_score ?? savedResult?.total_score;
    const visitLabel =
        props.result?.visit_label ??
        `Kunjungan KF ${String(props.previousVisit?.visit_number ?? '')}`;
    const previousVisitFields: Record<string, string> = {
        date_filled: 'Tanggal skrining',
        parity_count: 'Jumlah persalinan',
        sleep_quality: 'Kualitas tidur',
        partner_support: 'Dukungan pasangan',
        live_with_partner: 'Tinggal bersama pasangan',
        family_salary_permonth: 'Pendapatan keluarga',
        dependent_family_count: 'Tanggungan keluarga',
        is_salary_sufficient: 'Kecukupan pendapatan',
        psych_history: 'Riwayat psikologis',
        psych_treatment: 'Perawatan psikologis',
        psych_trauma: 'Riwayat trauma',
        feel_unsafe: 'Perasaan aman',
        pregnancy_planned: 'Kehamilan direncanakan',
        preg_comp_history: 'Komplikasi kehamilan',
        last_comp: 'Komplikasi persalinan',
        last_comp_note: 'Catatan komplikasi',
        baby_caregiver: 'Pengasuh bayi',
    };
    const previousVisitSummary = Object.entries(previousVisitFields)
        .filter(([key]) => props.previousVisit?.[key] !== undefined)
        .map(([key, label]) => {
            const value = props.previousVisit?.[key];
            if (typeof value === 'object' && value !== null) {
                const record = value as Record<string, unknown>;
                const nestedLabel = record.label_id ?? record.label;
                const normalizedLabel = Array.isArray(nestedLabel)
                    ? nestedLabel.join(', ')
                    : nestedLabel;
                return [label, normalizedLabel ?? record.value ?? '—'] as const;
            }
            if (typeof value === 'boolean') {
                return [label, value ? 'Ya' : 'Tidak'] as const;
            }
            return [label, value ?? '—'] as const;
        });

    return (
        <div className="space-y-4">
            {score !== undefined && (
                <section className="rounded-[1.75rem] bg-gradient-to-br from-rose-400 to-pink-300 p-5 text-white shadow-lg shadow-rose-200">
                    <p className="text-sm text-white/80">
                        Hasil skrining terbaru · {visitLabel}
                    </p>
                    <p className="mt-2 text-5xl font-bold">
                        {score}
                        <span className="text-base font-medium"> / 30</span>
                    </p>
                    {props.result ? (
                        <>
                            <p className="mt-4 font-semibold">
                                {props.result.recommendation}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/90">
                                {props.result.pesan_penguatan}
                            </p>
                        </>
                    ) : (
                        <p className="mt-4 text-sm text-white/90">
                            Hasil tersimpan. Hubungi bidan untuk penjelasan atau
                            dukungan lanjutan.
                        </p>
                    )}
                </section>
            )}
            <section className="rounded-[1.75rem] bg-white p-5">
                <h2 className="mb-4 text-lg font-bold">Riwayat skrining</h2>
                {props.items.length ? (
                    <div className="space-y-3">
                        {props.items.map((item, index) => (
                            <div
                                key={`${String(item.parameter)}-${index}`}
                                className="flex items-center justify-between rounded-2xl bg-rose-50 p-4"
                            >
                                <div>
                                    <p className="font-bold">
                                        {String(
                                            item.parameter ??
                                                `Skrining ${index + 1}`,
                                        )}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {item.date_filled
                                            ? new Date(
                                                  String(item.date_filled),
                                              ).toLocaleDateString('id-ID', {
                                                  dateStyle: 'long',
                                              })
                                            : 'Tanggal tidak tersedia'}
                                    </p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-rose-600">
                                    {String(
                                        item.risk_category ??
                                            item.value ??
                                            'Tercatat',
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm leading-6 text-slate-500">
                        Belum ada hasil skrining. Hasil dan rekomendasi akan
                        tampil di sini setelah Anda mengisi EPDS.
                    </p>
                )}
            </section>
            {props.previousVisit && (
                <details className="rounded-[1.75rem] bg-white p-5">
                    <summary className="cursor-pointer font-bold">
                        Lihat jawaban kunjungan terakhir
                    </summary>
                    <dl className="mt-4 grid gap-2">
                        {previousVisitSummary.map(([label, value]) => (
                            <div
                                key={label}
                                className="flex items-start justify-between gap-3 rounded-xl bg-rose-50 p-3 text-sm"
                            >
                                <dt className="text-slate-500">{label}</dt>
                                <dd className="text-right font-semibold">
                                    {String(value)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </details>
            )}
            {props.canFill && (
                <AppButton onClick={props.onScreening} className="w-full">
                    Isi jadwal berikutnya <ChevronRight size={18} />
                </AppButton>
            )}
        </div>
    );
}

function NotificationsScreen(props: {
    items: PatientNotification[];
    onRead: (notification: PatientNotification) => void;
    onEnablePush: () => void;
    pushEnabled: boolean;
}) {
    return (
        <div className="space-y-4">
            {!props.pushEnabled && (
                <ActionCard
                    icon={<Bell size={21} />}
                    title="Nyalakan notifikasi"
                    detail="Dapatkan pengingat jadwal skrining dengan urgensi tinggi."
                    action="Aktifkan"
                    onClick={props.onEnablePush}
                />
            )}
            {props.items.length === 0 ? (
                <EmptyState
                    icon={<Bell />}
                    title="Belum ada notifikasi"
                    detail="Pengingat jadwal dan informasi skrining akan muncul di sini."
                />
            ) : (
                props.items.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => props.onRead(item)}
                        className={`w-full rounded-[1.5rem] border p-4 text-left ${item.read_at ? 'border-rose-100 bg-white' : 'border-rose-200 bg-rose-50'}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-rose-500">
                                <CalendarDays size={19} />
                            </span>
                            <span className="flex-1">
                                <span className="block font-bold">
                                    {item.data.title}
                                </span>
                                <span className="mt-1 block text-sm leading-5 text-slate-600">
                                    {item.data.body}
                                </span>
                                <span className="mt-2 block text-xs text-slate-400">
                                    {new Date(item.created_at).toLocaleString(
                                        'id-ID',
                                        {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        },
                                    )}
                                </span>
                            </span>
                            {!item.read_at && (
                                <span className="mt-2 size-2 rounded-full bg-rose-500" />
                            )}
                        </div>
                    </button>
                ))
            )}
        </div>
    );
}

function EmptyState({
    icon,
    title,
    detail,
}: {
    icon: ReactNode;
    title: string;
    detail: string;
}) {
    return (
        <section className="grid justify-items-center rounded-[1.75rem] border border-rose-100 bg-white px-6 py-10 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                {icon}
            </span>
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {detail}
            </p>
        </section>
    );
}

function NavButton({
    active,
    label,
    icon,
    onClick,
}: {
    active: boolean;
    label: string;
    icon: ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold ${active ? 'text-rose-500' : 'text-slate-400'}`}
        >
            {icon}
            {label}
        </button>
    );
}
