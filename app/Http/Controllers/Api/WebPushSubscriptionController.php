<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WebPushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebPushSubscriptionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role?->slug !== 'patient') {
            return response()->json(['message' => 'Hanya pasien yang dapat mendaftar notifikasi PWA.'], 403);
        }

        $validated = $request->validate([
            'token' => ['required', 'string', 'max:4096'],
        ]);

        WebPushSubscription::query()->updateOrCreate(
            ['token_hash' => hash('sha256', $validated['token'])],
            ['user_id' => $request->user()->id, 'token' => $validated['token']]
        );

        return response()->json(['message' => 'Notifikasi berhasil diaktifkan.'], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        if ($request->user()->role?->slug !== 'patient') {
            return response()->json(['message' => 'Hanya pasien yang dapat mengelola notifikasi PWA.'], 403);
        }

        $validated = $request->validate([
            'token' => ['nullable', 'string', 'max:4096'],
        ]);

        $subscriptions = $request->user()->webPushSubscriptions();

        if (isset($validated['token'])) {
            $subscriptions->where('token_hash', hash('sha256', $validated['token']))->delete();
        } else {
            $subscriptions->delete();
        }

        return response()->json(['message' => 'Notifikasi PWA dinonaktifkan.']);
    }
}
