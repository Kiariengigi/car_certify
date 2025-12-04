import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Configuration
export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Ramp up to 5 virtual users
    { duration: '30s', target: 20 },  // Ramp up to 20 virtual users
    { duration: '20s', target: 20 },  // Stay at 20 virtual users
    { duration: '10s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    'http_req_duration': ['p(95)<2000'], // 95th percentile < 2s
    'http_req_failed': ['rate<0.1'],     // Error rate < 10%
  },
};

const BASE_URL = 'https://car-certify.onrender.com';

function generateEmail() {
  return `k6_${Date.now()}_${Math.random().toString(36).substring(7)}@test.com`;
}

export default function () {
  const email = generateEmail();
  const password = 'Test@1234';
  const fullName = `K6 Tester ${Math.random().toString(36).substring(7)}`;

  // Test 1: Dashboard Access (protected endpoint) - main focus
  group('Dashboard Access', () => {
    const headers = {
      headers: {
        'Authorization': 'Bearer invalid_token',
        'Content-Type': 'application/json',
      },
    };

    const response = http.get(`${BASE_URL}/vehicleInfo/dashboard`, headers);

    check(response, {
      'dashboard endpoint responsive': (r) => r.status !== 0,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    sleep(1);
  });

  // Test 2: Signup attempt
  group('Signup', () => {
    const payload = JSON.stringify({
      fullName: fullName,
      email: email,
      password: password,
      role: 'Buyer',
    });

    const response = http.post(
      `${BASE_URL}/users/new`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    check(response, {
      'signup endpoint responsive': (r) => r.status !== 0,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    sleep(1);
  });

  // Test 3: Login attempt
  group('Login', () => {
    const payload = JSON.stringify({
      email: email,
      password: password,
    });

    const response = http.post(
      `${BASE_URL}/users/login`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    check(response, {
      'login endpoint responsive': (r) => r.status !== 0,
      'response time < 2000ms': (r) => r.timings.duration < 2000,
    });

    sleep(1);
  });

  sleep(Math.random() * 2);
}
