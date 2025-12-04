# K6 Performance Testing Setup

This directory contains K6 performance testing scripts for the Car Certify application backend.

## What is K6?

**K6** is a modern, open-source load testing tool for APIs and web applications. Key advantages:

- ✅ **JavaScript-based** - Write tests in familiar JavaScript syntax
- ✅ **Real-time metrics** - See live performance data during tests
- ✅ **Cloud integration** - Optional cloud reporting with k6 Cloud
- ✅ **Flexible scenarios** - Support for ramp-up, stress, spike, and soak testing
- ✅ **Easy CI/CD integration** - Works seamlessly in pipelines

## Directory Structure

```
perf/k6/
├── performance-test.js              # Main K6 test script
├── K6_PERFORMANCE_REPORT.md         # Latest test results & analysis
├── K6_README.md                     # This file
├── install-k6.ps1                   # K6 installation script
├── run-k6-test.ps1                  # Test runner script
├── k6-0.49.0/                       # K6 binary distribution
│   └── k6-v0.49.0-windows-amd64/
│       └── k6.exe                   # K6 executable
├── results_*.json                   # Test results (raw JSON format)
└── k6-last-run.txt                  # Last test output log

```

## Installation

K6 is already installed locally in `k6-0.49.0/`. To reinstall or update:

```powershell
cd perf/k6
PowerShell -ExecutionPolicy Bypass -File .\install-k6.ps1
```

Verify installation:
```powershell
.\k6-0.49.0\k6-v0.49.0-windows-amd64\k6.exe version
```

## Running Tests

### Quick Start (Recommended)
```powershell
cd perf/k6
PowerShell -ExecutionPolicy Bypass -File .\run-k6-test.ps1
```

### Direct K6 Command
```powershell
.\k6-0.49.0\k6-v0.49.0-windows-amd64\k6.exe run performance-test.js
```

### Run with Custom Output
```powershell
# Save results as CSV
.\k6-0.49.0\k6-v0.49.0-windows-amd64\k6.exe run `
    --out csv=results.csv `
    performance-test.js

# Save results as JSON
.\k6-0.49.0\k6-v0.49.0-windows-amd64\k6.exe run `
    --out json=results.json `
    performance-test.js
```

## Test Scenarios

### Current Test Profile: `performance-test.js`

The default test simulates realistic user behavior with a staged load ramp:

**Load Profile:**
```
┌─ Stage 1 (0-10s): Ramp 1→5 VUs     [Warm-up]
│
├─ Stage 2 (10-40s): Ramp 5→20 VUs   [Gradual increase]
│
├─ Stage 3 (40-60s): Hold 20 VUs     [Sustained load]
│
└─ Stage 4 (60-70s): Ramp 20→0 VUs   [Cool-down]
```

**Test Cases:**
1. **Dashboard Access** - GET /vehicleInfo/dashboard (protected endpoint)
2. **User Signup** - POST /users/new (create new account)
3. **User Login** - POST /users/login (authenticate user)

**Acceptance Criteria:**
- ✅ All endpoints must respond (0% errors)
- ✅ 95th percentile response time < 2000ms
- ✅ Error rate < 10%

---

## Understanding K6 Metrics

When you run a test, K6 displays these key metrics:

### Duration Metrics
```
group_duration    - Time spent in each group (signup, login, etc.)
http_req_duration - Response time per HTTP request
iteration_duration - Total time for one complete iteration
```

### Request Metrics
```
http_req_blocked   - Time spent blocked before initiating request
http_req_connecting - Time spent establishing TCP connection
http_req_waiting   - Time waiting for server response (latency)
http_req_receiving - Time spent receiving response body
http_reqs          - Total number of HTTP requests made
```

### Virtual User Metrics
```
vus        - Current number of virtual users
vus_max    - Maximum virtual users reached
iterations - Total completed test iterations
```

### Check Metrics
```
checks - Assertions passed/failed (success rate %)
```

### Data Metrics
```
data_received - Total bytes downloaded
data_sent     - Total bytes uploaded
```

---

## Example Test Runs

### Run 1: Baseline Performance
```
Test Duration: 70 seconds
Peak VUs: 20
Total Requests: 579
Avg Response Time: 272ms
95th Percentile: 347ms
Status: ✅ PASSED
```

---

## Customizing Tests

### Modify Load Profile
Edit `performance-test.js` and change the `stages` array:

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp to 50 VUs
    { duration: '2m', target: 50 },   // Hold for 2 minutes
    { duration: '30s', target: 0 },   // Ramp down
  ],
};
```

### Modify Thresholds
Change acceptance criteria:

```javascript
thresholds: {
  'http_req_duration': ['p(99)<1000'], // 99th percentile < 1s
  'http_req_failed': ['rate<0.05'],    // Error rate < 5%
};
```

### Add Custom Checks
```javascript
check(response, {
  'status is 200': (r) => r.status === 200,
  'response time under 500ms': (r) => r.timings.duration < 500,
  'contains success message': (r) => r.body.includes('success'),
});
```

---

## Troubleshooting

### Test Fails to Start
```
Error: ENOENT: no such file or directory
```
**Solution:** Run `install-k6.ps1` to download K6 binary.

### Connection Refused
```
Error: dial tcp: lookup car-certify.onrender.com: no such host
```
**Solution:** Check internet connection. Render backend may be down.

### Tests Run But All Fail
```
checks.....................: 0.00% ✗ 0 / ✓ 0
```
**Solution:** Check that the backend is accessible. Verify endpoints in the test script match your API routes.

---

## Performance Benchmarks

### Healthy Response Times (For Reference)
- **Excellent:** < 200ms
- **Good:** 200-500ms
- **Acceptable:** 500-1000ms
- **Poor:** > 1000ms

### Healthy Error Rates
- **Excellent:** 0%
- **Good:** < 1%
- **Acceptable:** < 5%
- **Poor:** > 5%

### Healthy Throughput (20 VUs)
- **Expected:** 5-10 requests/second (per endpoint)
- **Your Results:** 7.82 req/s ✅

---

## Comparison: K6 vs JMeter

| Feature | K6 | JMeter |
|---------|----|-|
| Language | JavaScript | XML / GUI |
| Learning Curve | Easy | Steep |
| Performance | Fast | Good |
| Cloud Integration | Native | Plugins |
| CI/CD Integration | Excellent | Good |
| Visual Reporting | Web UI | Built-in |
| Scalability | Cloud | Self-hosted |

---

## Next Steps

1. **Monitor regularly** - Run tests weekly to track performance trends
2. **Increase load** - Try with 50, 100 VUs to find limits
3. **Stress test** - Find breaking point of the system
4. **Setup alerting** - Monitor production with k6 Cloud
5. **Document baseline** - Save current results as baseline

---

## Related Testing

- **Jest/Supertest** - Functional API testing (`Back-end/tests/`)
- **JMeter** - Alternative load testing (`perf/jmeter/`)
- **Cypress** - End-to-end UI testing (`Front-end/`)

---

## Resources

- **K6 Official Docs:** https://k6.io/docs/
- **K6 Best Practices:** https://k6.io/docs/testing-guides/
- **K6 Cloud:** https://app.k6.io/
- **K6 GitHub:** https://github.com/grafana/k6

---

## Version Info

- **K6 Version:** 0.49.0
- **Test Date:** November 28, 2025
- **Backend:** https://car-certify.onrender.com
- **Status:** ✅ Operational

---

**Last Updated:** November 28, 2025  
**Test Status:** ✅ All tests passing
