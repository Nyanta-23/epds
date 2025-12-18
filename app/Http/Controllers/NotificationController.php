<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $notifications = $user->notifications()
            ->latest()
            ->paginate(15)
            ->through(function ($notif) {
                return [
                    'id' => $notif->id,
                    'type' => $notif->data['type'] ?? 'info',
                    'icon' => $notif->data['icon'] ?? 'bell',
                    'title' => $notif->data['title'] ?? 'Notifikasi',
                    'body' => $notif->data['body'] ?? '',
                    'action_url' => $notif->data['action_url'] ?? null,
                    'read_at' => $notif->read_at,
                    'created_at_human' => $notif->created_at->diffForHumans(),
                    'created_at' => $notif->created_at->format('d M Y H:i'),
                ];
            });

        return Inertia::render('notifications', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Tandai satu notifikasi sebagai sudah dibaca, lalu redirect.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = auth()->user()->notifications()->where('id', $id)->firstOrFail();
        
        $notification->markAsRead();

        $targetUrl = $request->input('url');
        
        if ($targetUrl) {
            return Inertia::location($targetUrl);
        }

        return back();
    }

    public function markAllRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return back()->with('success', 'Semua notifikasi ditandai sudah dibaca.');
    }
}
