<?php

namespace Tests\Unit;

use App\Models\User;
use App\Notifications\NewScreeningResultNotification;
use App\Service\FcmService;
use Tests\TestCase;

class NewScreeningResultNotificationTest extends TestCase
{
    public function test_database_payload_does_not_send_fcm_synchronously(): void
    {
        $fcmService = $this->createMock(FcmService::class);
        $fcmService->expects($this->never())->method('send');
        $this->app->instance(FcmService::class, $fcmService);

        $midwife = new User;
        $midwife->fcm_token = 'test-token';
        $notification = new NewScreeningResultNotification(
            (object) ['total_score' => 15],
            'Ibu Uji',
            'postpartum-id'
        );

        $payload = $notification->toArray($midwife);

        $this->assertSame('⚠️ BAHAYA: Pasien Risiko Tinggi', $payload['title']);
        $this->assertSame('Ibu Ibu Uji memiliki skor EPDS: 15', $payload['body']);
    }
}
