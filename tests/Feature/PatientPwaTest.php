<?php

namespace Tests\Feature;

use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PatientPwaTest extends TestCase
{
    public function test_patient_app_shell_does_not_receive_application_data_as_inertia_props(): void
    {
        $this->get('/patient-app')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('patient-app')
                ->missing('auth')
                ->missing('patient')
                ->missing('schedule')
                ->missing('questions'));
    }

    public function test_web_push_subscription_requires_api_authentication(): void
    {
        $this->postJson('/api/v1/web-push-subscriptions', ['token' => 'browser-token'])
            ->assertUnauthorized();
    }

    public function test_firebase_worker_caches_only_the_patient_app_shell(): void
    {
        $this->get('/firebase-messaging-sw.js')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/javascript; charset=utf-8')
            ->assertSee('epds-patient-shell-v1')
            ->assertSee('requireInteraction');
    }
}
