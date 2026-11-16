<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  {{-- Inline script to detect system dark mode preference and apply it immediately --}}
  <script>
    (function () {
      const appearance = '{{ $appearance ?? "system" }}';

      if (appearance === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (prefersDark) {
          document.documentElement.classList.add('dark');
        }
      }
    })();
  </script>

  {{-- Inline style to set the HTML background color based on our theme in app.css --}}
  <style>
    html {
      background-color: oklch(1 0 0);
    }

    html.dark {
      background-color: oklch(0.145 0 0);
    }
  </style>

  <title inertia>{{ config('app.name', 'Laravel') }}</title>

  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.bunny.net">
  <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

  <script>
    window.addEventListener('error', function (e) {
      document.documentElement.classList.remove('dark');
      document.body.innerHTML =
        '<div style="background:#FEF6F7;color:#991B1B;padding:20px;font-family:monospace;font-size:13px;min-height:100vh;">' +
        '<b>Gagal memuat aplikasi:</b><br>' + (e.message || 'Script error') +
        '</div>';
    }, true);

    if ('caches' in window) {
      caches.keys().then(function (keys) {
        keys.forEach(function (key) {
          if (key.startsWith('epds-patient-shell-')) caches.delete(key);
        });
      });
    }
  </script>

  @routes
  @viteReactRefresh
  @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
  @inertiaHead
</head>

<body class="font-sans antialiased">
  @inertia
</body>

</html>