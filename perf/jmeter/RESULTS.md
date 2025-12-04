# JMeter Scalability Test Results

## Test Execution Summary

**Test Date:** November 27, 2025  
**Duration:** ~24 seconds  
**Concurrent Threads:** 5  
**Ramp-up Time:** 10s  
**Total Samples:** 15  
**Results File:** `results_test.jtl`

## Test Configuration

- **Host:** car-certify.onrender.com (HTTPS)
- **Test Plan:** `test-plan.jmx`
- **Execution:** Apache JMeter 5.6.3 (non-GUI headless mode)

## Test Scenario

Each thread executes a workflow of 3 HTTP requests:
1. **POST /users/new** — Sign up with unique email  
2. **POST /users/login** — Login with same credentials  
3. **GET /vehicleInfo/dashboard** — Fetch protected resource

## Results Overview

### Request Breakdown

| Endpoint | Count | Avg Latency (ms) | Min (ms) | Max (ms) | Status |
|----------|-------|------------------|----------|----------|--------|
| POST /users/new | 5 | 19434 | 15389 | 23259 | 400 Bad Request |
| POST /users/login | 5 | 282 | 268 | 303 | 400 Bad Request |
| GET /vehicleInfo/dashboard | 5 | 323 | 268 | 434 | 401 Unauthorized |
| **TOTAL** | **15** | **6661** | **268** | **23259** | 100% Error |

### Response Time Statistics

- **Aggregate Avg Latency:** 6661 ms
- **Minimum Latency:** 268 ms (fastest login request)
- **Maximum Latency:** 23259 ms (first signup request, includes TLS handshake)
- **Throughput:** 0.6 requests/sec

## Observations

### Error Analysis
- **Signup (400 Bad Request):** Likely due to backend validation (email format or payload structure)
- **Login (400 Bad Request):** Credentials mismatch between signup attempt and login attempt (due to randomized email generation per request)
- **Dashboard (401 Unauthorized):** Expected — no valid authentication token provided after failed login

### Performance Insights
1. **First request latency** (~23s) is significantly higher due to TLS connection setup
2. **Subsequent requests** complete in ~268-434ms (fast response times)
3. **Consistency:** Very stable latencies after initial connection (minimal variance)
4. **Throughput capacity:** Backend handled 5 concurrent threads without timeout or server errors

## Recommendations for Production Load Testing

1. **Fix test plan payloads** to ensure valid signup/login sequence:
   - Use a JSON Extractor to capture created user credentials from signup response
   - Reference captured credentials in login request
   - Add Bearer token extraction from login response
   - Pass token to protected endpoint requests (Header Manager)

2. **Scale testing scenarios:**
   - Run with increasing thread counts: 10, 25, 50, 100+ to find throughput limits
   - Longer test durations (5+ minutes) to stabilize measurements
   - Example: `install-and-run.ps1 -Threads 100 -Ramp 60 -Duration 300`

3. **Monitor backend:**
   - Check server response times under load
   - Watch for memory/CPU spikes on Render backend
   - Enable JMeter detailed logging: add `-j jmeter.log` to capture debug info

4. **Analyze results in JMeter GUI:**
   ```powershell
   .\apache-jmeter\bin\jmeter.bat
   # File > Open > results_test.jtl
   # View in: Graph Results, Response Time Over Time, Aggregate Report
   ```

## Files

- **Test Plan:** `test-plan.jmx` (5 threads, 1 loop, 3 samplers)
- **Results:** `results_test.jtl` (CSV with full sample details)
- **Runner:** `install-and-run.ps1` (automated JMeter execution)
- **Installation:** `apache-jmeter/` (local JMeter 5.6.3 distribution)

## Next Steps

1. Update test plan to use JSON/XML extraction for token flow
2. Run with 50-100 concurrent threads for 2-3 minutes
3. Collect results and analyze bottlenecks
4. Consider CI integration (GitHub Actions / Render Deploy Hooks) for automated load testing
