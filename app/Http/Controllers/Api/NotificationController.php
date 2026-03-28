<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $unreadCount = $user->unreadNotifications()->count();

        $notifications = $user->notifications()
            ->latest()
            ->paginate(15)
            ->through(function ($notif) {
                return [
                    'id' => $notif->id,
                    'data' => [
                         'type' => $notif->data['type'] ?? 'info',
                         'icon' => $notif->data['icon'] ?? 'bell',
                         'title' => $notif->data['title'] ?? 'Notifikasi',
                         'body' => $notif->data['body'] ?? '',
                         'action_url' => $notif->data['action_url'] ?? null,
                    ],
                    'read_at' => $notif->read_at ? $notif->read_at->toIso8601String() : null,
                    'created_at' => $notif->created_at->toIso8601String(),
                ];
            });

        return response()->json([
            'unread' => $unreadCount,
            'notifications' => $notifications->items(),
            'current_page' => $notifications->currentPage(),
            'last_page' => $notifications->lastPage(),
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = auth()->user()->notifications()->where('id', $id)->firstOrFail();
        
        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read'
        ]);
    }
}
