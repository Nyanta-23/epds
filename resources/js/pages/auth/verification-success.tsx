import AuthLayout from '@/layouts/auth-layout';
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';


interface VerifyEmailProps {
  id: string;
  email: string;
  name: string;
  token: string;
  deepLink: string;
}

export default function VerifyEmail({ deepLink }: VerifyEmailProps) {

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = deepLink;
    }, 1500);
    return () => clearTimeout(timer);
  }, [deepLink]);

  return (
    <AuthLayout
      title="Verifikasi Berhasil"
      description="Akun Anda telah aktif."
    >
      <Head title="Verifikasi Email Berhasil" />

      <div className="flex flex-col items-center justify-center space-y-6 py-6">`
        <div className="rounded-full bg-green-100 p-3">
          <svg
            className="h-12 w-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium">Email Terverifikasi!</h3>
          <p className="mt-2 text-sm">
            Mengalihkan Anda kembali ke aplikasi...
          </p>
        </div>

        <a
          href={deepLink}
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Buka Aplikasi Sekarang
        </a>
      </div>
    </AuthLayout>
  );
}