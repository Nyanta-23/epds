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

    public function test_patient_home_is_a_separate_inertia_page(): void
    {
        $this->get('/patient-app/home')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('patient-app/home')
                ->missing('patient')
                ->missing('schedule'));
    }

    public function test_patient_profile_and_baby_pages_have_separate_routes(): void
    {
        $this->get('/patient-app/profile')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('patient-app/profile')
                ->missing('patient'));

        $this->get('/patient-app/baby')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('patient-app/baby')
                ->missing('patient'));
    }

    public function test_patient_screening_and_history_pages_have_separate_routes(): void
    {
        $this->get('/patient-app/screening')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('patient-app/screening')
                ->missing('patient'));

        $this->get('/patient-app/history')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('patient-app/history')
                ->missing('patient'));
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
            ->assertSee('epds-patient-shell-v4')
            ->assertSee('/patient-app/home')
            ->assertSee('/patient-app/profile')
            ->assertSee('/patient-app/baby')
            ->assertSee('/patient-app/screening')
            ->assertSee('/patient-app/history')
            ->assertSee('if (payload.notification) return;')
            ->assertSee('requireInteraction');
    }
}
