<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Account Information</title>
</head>

<body>
    <h2>Hello, {{ $user->name }}</h2>

    <p>🎉 Congratulations! Your email has been successfully verified.</p>

    <p>Here is your account information:</p>
    <ul>
        <li><strong>Email:</strong> {{ $user->email }}</li>
        @if ($password)
            <li><strong>Password:</strong> {{ $password }}</li>
        @endif
    </ul>

    @if ($password)
        <p style="color: red; font-weight: bold;">
            ⚠️ IMPORTANT: Please change your password immediately after logging in
            to keep your account secure.
        </p>
    @endif

    <p>You can now login to the application using the credentials above.</p>

    <p>Thank you,<br>{{ config('app.name') }}</p>
</body>

</html>
