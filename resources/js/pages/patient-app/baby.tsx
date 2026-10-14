import { PatientAppNavbar } from '@/components/patient-app-navbar';
import { Head, router } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { ArrowLeft, Baby, Plus } from 'lucide-react';
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
    address?: string | null;
    facility_id?: string | null;
    babies?: BabyRecord[];
}

interface BabyRecord {
    id: string;
    which_child: number;
    date_of_birth: string;
    baby_condition: number | { value: number };
    typeof_delivery: number | { value: number };
    gender: string;
    baby_feeding_method: number | { value: number };
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

const fieldClass =
    'min-h-12 w-full rounded-2xl border border-rose-100 bg-white px-4 text-sm text-slate-800 outline-none focus:border-rose-300 focus:ring-4 focus:ring-rose-100';

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

function valueOf(value: number | { value: number }): number {
    return typeof value === 'number' ? value : value.value;
}

function dateTimeInput(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (part: number) => String(part).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function currentDateTimeInput(): string {
    return dateTimeInput(new Date().toISOString());
}

export default function PatientAppBaby() {
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
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState<BabyForm>(emptyBaby);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

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
                const currentPatient = response.data.data;
                if (!patientProfileIsComplete(currentPatient)) {
                    router.visit('/patient-app/profile', { replace: true });
                    return;
                }
                setPatient(currentPatient);
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

    function editBaby(baby: BabyRecord) {
        const birthDateTime = dateTimeInput(baby.date_of_birth);
        setEditingId(baby.id);
        setForm({
            which_child: String(baby.which_child),
            birth_date: birthDateTime.slice(0, 10),
            birth_hour: birthDateTime.slice(11, 13),
            birth_minute: birthDateTime.slice(14, 16),
            baby_condition: String(valueOf(baby.baby_condition)),
            typeof_delivery: String(valueOf(baby.typeof_delivery)),
            gender: baby.gender,
            baby_feeding_method: String(valueOf(baby.baby_feeding_method)),
        });
        setFormOpen(true);
    }

    function beginCreate() {
        setEditingId(null);
        setForm(emptyBaby);
        setFormOpen(true);
        setError('');
    }

    async function saveBaby(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!client || !patient) return;

        setBusy(true);
        setError('');
        setSuccess('');
        const { birth_date, birth_hour, birth_minute, ...babyData } = form;
        const payload = {
            ...babyData,
            date_of_birth: `${birth_date} ${birth_hour}:${birth_minute}:00`,
            mother_id: patient.id,
        };

        try {
            if (editingId) {
                await client.put(`/baby/${editingId}`, payload);
                setSuccess('Data bayi berhasil diperbarui.');
            } else {
                await client.post('/baby', payload);
                setSuccess('Data bayi berhasil ditambahkan.');
            }
            setForm(emptyBaby);
            setFormOpen(false);
            setEditingId(null);
            await refreshPatient();
        } catch (saveError) {
            setError(errorMessage(saveError));
        } finally {
            setBusy(false);
        }
    }

    async function refreshPatient() {
        if (!client || !patient) return;
        const response = await client.get<ApiResponse<Patient>>(
            `/patient/${patient.id}`,
        );
        setPatient(response.data.data);
    }

    async function removeBaby(babyId: string) {
        if (!client || !window.confirm('Hapus data bayi ini?')) return;
        setBusy(true);
        setError('');
        setSuccess('');
        try {
            await client.delete(`/baby/${babyId}`);
            setSuccess('Data bayi berhasil dihapus.');
            await refreshPatient();
        } catch (deleteError) {
            setError(errorMessage(deleteError));
        } finally {
            setBusy(false);
        }
    }

    if (loading) {
        return <PageMessage message="Memuat data bayi…" />;
    }
    if (!patient) {
        return (
            <PageMessage
                message={error || 'Data pasien gagal dimuat.'}
                onRetry={() => window.location.reload()}
            />
        );
    }

    const babies = [...(patient.babies ?? [])].sort(
        (left, right) => left.which_child - right.which_child,
    );
    const now = currentDateTimeInput();

    return (
        <>
            <Head title="Data bayi">
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
                            <h1 className="text-xl font-bold">Data bayi</h1>
                        </div>
                    </header>

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

                    {babies.length === 0 && !formOpen && (
                        <section className="grid justify-items-center rounded-[1.75rem] border border-rose-100 bg-white px-6 py-10 text-center">
                            <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                <Baby size={25} />
                            </span>
                            <h2 className="mt-4 font-bold">
                                Data bayi belum tersedia
                            </h2>
                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Tambahkan data bayi untuk melihat jadwal
                                skrining nifas.
                            </p>
                        </section>
                    )}

                    {babies.map((baby) => (
                        <article
                            key={baby.id}
                            className="rounded-[1.75rem] border border-rose-100 bg-white p-5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-500">
                                        <Baby size={23} />
                                    </span>
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
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => editBaby(baby)}
                                    className="rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                                >
                                    Ubah
                                </button>
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
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void removeBaby(baby.id)}
                                className="mt-3 min-h-9 rounded-xl bg-red-50 px-3 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                            >
                                Hapus data
                            </button>
                        </article>
                    ))}

                    {!formOpen && (
                        <button
                            type="button"
                            onClick={beginCreate}
                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-rose-400 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-100 hover:bg-rose-500"
                        >
                            <Plus size={18} /> Tambah data bayi
                        </button>
                    )}

                    {formOpen && (
                        <form
                            onSubmit={saveBaby}
                            className="grid gap-4 rounded-[1.75rem] bg-white p-5"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold">
                                    {editingId
                                        ? 'Ubah data bayi'
                                        : 'Tambah data bayi'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setFormOpen(false)}
                                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-rose-50"
                                >
                                    Tutup
                                </button>
                            </div>

                            <BabyField label="Anak ke">
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    value={form.which_child}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            which_child: event.target.value,
                                        })
                                    }
                                    className={fieldClass}
                                />
                            </BabyField>
                            <BabyField label="Tanggal lahir">
                                <input
                                    required
                                    type="date"
                                    max={now.slice(0, 10)}
                                    value={form.birth_date}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            birth_date: event.target.value,
                                        })
                                    }
                                    className={fieldClass}
                                />
                            </BabyField>
                            <BabyField
                                label="Jam lahir"
                                hint="Pilih jam dan menit."
                            >
                                <div className="grid grid-cols-2 gap-3">
                                    <BabySelect
                                        label="Jam"
                                        value={form.birth_hour}
                                        onChange={(birth_hour) =>
                                            setForm({ ...form, birth_hour })
                                        }
                                        options={Array.from(
                                            { length: 24 },
                                            (_, hour) => {
                                                const value = String(
                                                    hour,
                                                ).padStart(2, '0');
                                                return {
                                                    value,
                                                    disabled:
                                                        form.birth_date ===
                                                            now.slice(0, 10) &&
                                                        hour >
                                                            Number(
                                                                now.slice(
                                                                    11,
                                                                    13,
                                                                ),
                                                            ),
                                                };
                                            },
                                        )}
                                    />
                                    <BabySelect
                                        label="Menit"
                                        value={form.birth_minute}
                                        onChange={(birth_minute) =>
                                            setForm({
                                                ...form,
                                                birth_minute,
                                            })
                                        }
                                        options={Array.from(
                                            { length: 60 },
                                            (_, minute) => {
                                                const value = String(
                                                    minute,
                                                ).padStart(2, '0');
                                                return {
                                                    value,
                                                    disabled:
                                                        form.birth_date ===
                                                            now.slice(0, 10) &&
                                                        form.birth_hour ===
                                                            now.slice(11, 13) &&
                                                        minute >
                                                            Number(
                                                                now.slice(
                                                                    14,
                                                                    16,
                                                                ),
                                                            ),
                                                };
                                            },
                                        )}
                                    />
                                </div>
                            </BabyField>
                            <BabySelectField
                                label="Kondisi bayi"
                                value={form.baby_condition}
                                onChange={(baby_condition) =>
                                    setForm({ ...form, baby_condition })
                                }
                                options={[
                                    {
                                        value: '0',
                                        label: 'Bayi lahir hidup',
                                    },
                                    {
                                        value: '1',
                                        label: 'Lahir hidup dengan asfiksia',
                                    },
                                    {
                                        value: '2',
                                        label: 'Bayi lahir mati',
                                    },
                                ]}
                            />
                            <BabySelectField
                                label="Jenis persalinan"
                                value={form.typeof_delivery}
                                onChange={(typeof_delivery) =>
                                    setForm({ ...form, typeof_delivery })
                                }
                                options={[
                                    { value: '0', label: 'Normal' },
                                    {
                                        value: '1',
                                        label: 'Operasi sesar',
                                    },
                                    { value: '2', label: 'Lainnya' },
                                ]}
                            />
                            <BabySelectField
                                label="Jenis kelamin"
                                value={form.gender}
                                onChange={(gender) =>
                                    setForm({ ...form, gender })
                                }
                                options={[
                                    {
                                        value: 'female',
                                        label: 'Perempuan',
                                    },
                                    { value: 'male', label: 'Laki-laki' },
                                ]}
                            />
                            <BabySelectField
                                label="Pemberian makan"
                                value={form.baby_feeding_method}
                                onChange={(baby_feeding_method) =>
                                    setForm({
                                        ...form,
                                        baby_feeding_method,
                                    })
                                }
                                options={[
                                    {
                                        value: '0',
                                        label: 'ASI eksklusif',
                                    },
                                    {
                                        value: '1',
                                        label: 'ASI dan susu formula',
                                    },
                                    {
                                        value: '2',
                                        label: 'Susu formula',
                                    },
                                ]}
                            />
                            <button
                                type="submit"
                                disabled={
                                    busy ||
                                    !form.birth_date ||
                                    !form.birth_hour ||
                                    !form.birth_minute
                                }
                                className="min-h-12 rounded-2xl bg-rose-400 px-4 text-sm font-semibold text-white shadow-lg shadow-rose-100 hover:bg-rose-500 disabled:opacity-50"
                            >
                                {busy ? 'Menyimpan…' : 'Simpan data bayi'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
            <PatientAppNavbar active="baby" />
        </>
    );
}

function BabyField(props: {
    label: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <label className="grid gap-2 text-sm font-medium text-slate-700">
            {props.label}
            {props.children}
            {props.hint && (
                <span className="text-xs font-normal text-slate-500">
                    {props.hint}
                </span>
            )}
        </label>
    );
}

function BabySelect(props: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; disabled?: boolean }[];
}) {
    return (
        <select
            required
            aria-label={props.label}
            value={props.value}
            onChange={(event) => props.onChange(event.target.value)}
            className={fieldClass}
        >
            <option value="">Pilih {props.label.toLowerCase()}</option>
            {props.options.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                >
                    {option.value}
                </option>
            ))}
        </select>
    );
}

function BabySelectField(props: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <BabyField label={props.label}>
            <select
                required
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                className={fieldClass}
            >
                {props.options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </BabyField>
    );
}

function PageMessage(props: { message: string; onRetry?: () => void }) {
    return (
        <>
            <Head title="Data bayi" />
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
