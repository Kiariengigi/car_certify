# K6 Performance Test Report
**Test Date:** November 28, 2025  
**Backend:** https://car-certify.onrender.com  
**Test Duration:** 70 seconds (1 minute 10 seconds)  
**Test Script:** `performance-test.js`

---

## Executive Summary

✅ **K6 performance testing successfully completed** with comprehensive load testing of the Car Certify backend. The test evaluated **3 critical endpoints** under load:
- Dashboard Access (Protected Endpoint)
- User Signup
- User Login

### Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Total Requests** | 579 | ✅ |
| **Completed Iterations** | 193 | ✅ |
| **Peak Virtual Users** | 20 VUs | ✅ |
| **Avg Response Time** | 272.12ms | ✅ |
| **95th Percentile Response Time** | 347.45ms | ✅ |
| **Max Response Time** | 724.32ms | ✅ |
| **Check Pass Rate** | 100% (1158/1158) | ✅ |

---

## Test Configuration

### Load Profile (Staged Ramp-Up)
```
├── Stage 1: 0-10s   → Ramp from 1 to 5 VUs (slow warm-up)
├── Stage 2: 10-40s  → Ramp from 5 to 20 VUs (gradual increase)
├── Stage 3: 40-60s  → Hold at 20 VUs (sustained load)
└── Stage 4: 60-70s  → Ramp down from 20 to 0 VUs (graceful shutdown)
```

### Thresholds & Acceptance Criteria
- **95th percentile response time:** < 2000ms ✅ **Passed** (347.45ms)
- **Error rate:** < 10% ✅ **Passed** (0% errors)
- **All endpoints responsive:** ✅ **Passed** (100% checks)

### Endpoints Tested
1. **POST /users/new** - User signup endpoint
2. **POST /users/login** - User login endpoint
3. **GET /vehicleInfo/dashboard** - Protected endpoint with Bearer token

---

## Performance Results

### Response Time Analysis
```
Avg Response Time:      272.12ms
Median Response Time:   243.94ms
Min Response Time:      216.96ms
Max Response Time:      724.32ms
P90 (90th percentile):  334.17ms
P95 (95th percentile):  347.45ms
```

### Throughput Analysis
```
Total HTTP Requests:     579
Requests Per Second:     7.82 req/s
Iterations Completed:    193
Iterations Per Second:   2.61 iter/s
```

### Data Transfer
```
Data Received:  188 kB (2.5 kB/s)
Data Sent:      80 kB (1.1 kB/s)
```

---

## Endpoint Performance Breakdown

### 1. Dashboard Access (Protected Endpoint)
- **Endpoint:** GET /vehicleInfo/dashboard
- **Status:** ✅ Responsive
- **Avg Response:** ~270-280ms
- **Check Status:** 100% passed (responsive + <2s)

### 2. User Signup
- **Endpoint:** POST /users/new
- **Status:** ✅ Responsive
- **Avg Response:** ~270-280ms
- **Check Status:** 100% passed (responsive + <2s)

### 3. User Login
- **Endpoint:** POST /users/login
- **Status:** ✅ Responsive
- **Avg Response:** ~270-280ms
- **Check Status:** 100% passed (responsive + <2s)

---

## Virtual User Load Distribution

| Duration | Target VUs | Description |
|----------|-----------|-------------|
| 0-10s    | 5         | Warm-up phase, light load |
| 10-40s   | 5→20      | Gradual load increase |
| 40-60s   | 20        | Peak load sustained |
| 60-70s   | 20→0      | Graceful ramp down |

The system handled up to **20 concurrent virtual users** without any failures or timeouts.

---

## Checks & Assertions

### Group: Dashboard Access
- ✅ Dashboard endpoint responsive (100% pass)
- ✅ Response time < 2000ms (100% pass)

### Group: Signup
- ✅ Signup endpoint responsive (100% pass)
- ✅ Response time < 2000ms (100% pass)

### Group: Login
- ✅ Login endpoint responsive (100% pass)
- ✅ Response time < 2000ms (100% pass)

**Overall Check Status: 1158/1158 Passed (100%)**

---

## Conclusion

✅ **All tests passed successfully.** The Car Certify backend demonstrates:

1. **Good Responsiveness**: All endpoints respond within 350ms at 95th percentile
2. **Stability Under Load**: No failures or errors under 20 concurrent users
3. **Consistent Performance**: Response times remain stable across load stages
4. **Reliable Infrastructure**: Render deployment handles the load well

### Recommendations

1. **Continue Monitoring**: Monitor production response times periodically
2. **Stress Testing**: Consider running tests with 50+ VUs to find breaking point
3. **Spike Testing**: Test rapid traffic spikes to ensure graceful degradation
4. **Soak Testing**: Run extended tests (24+ hours) to detect memory leaks

---

## Test Files Generated

- **K6 Script:** `performance-test.js`
- **Results (JSON):** `results_20251128_152949.json`
- **Runner Script:** `run-k6-test.ps1`
- **Installation Script:** `install-k6.ps1`

---

## How to Run Tests Again

```powershell
# Navigate to k6 directory
cd perf/k6

# Run performance test
PowerShell -ExecutionPolicy Bypass -File .\run-k6-test.ps1

# Or run directly with k6
.\k6-0.49.0\k6-v0.49.0-windows-amd64\k6.exe run performance-test.js
```

---

**Test completed successfully** ✅
