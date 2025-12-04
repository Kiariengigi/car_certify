Scalability tests (Apache JMeter)

Overview
- This folder contains a JMeter test plan (`test-plan.jmx`) that performs a simple workload against the project's backend:
  - POST /users/new (signup)
  - POST /users/login (login)
  - GET /vehicleInfo/dashboard (example protected endpoint)

- The plan is parameterized by JMeter properties so you can control concurrency and runtime from the command line.

Files
- `test-plan.jmx` - JMeter test plan.
- `run-tests.ps1` - PowerShell script to run the plan in non-GUI (headless) mode and save a JTL results file.

Prerequisites
- Java 8+
- Apache JMeter installed (https://jmeter.apache.org/). Ensure `jmeter` is on your PATH or update `run-tests.ps1` with the full path to the `jmeter` executable.

Quick start (PowerShell)
1. Open PowerShell and cd into this folder:

   cd "c:\Users\ngigi\OneDrive\Documents\Mid term project\car_certify-1\perf\jmeter"

2. Run the default test (50 threads, 30s ramp-up, 60s duration):

   ./run-tests.ps1

3. Run with custom parameters (example: 200 concurrent threads, 60s ramp-up for 3 minutes):

   ./run-tests.ps1 -Threads 200 -Ramp 60 -Duration 180

Output
- A JTL file `results_YYYYMMDD_HHMMSS.jtl` will be created in this folder. Open it with JMeter GUI (File → Open → View Results in Table/Graph) or process it with external tools.

Tips
- To iterate on the test plan, open `test-plan.jmx` in the JMeter GUI, make changes (e.g., add assertions, extract tokens with Regular Expression Extractor, add Cookie/Cache managers) and re-save.
- For authenticated flows that require extracting tokens from login responses and passing them to subsequent requests you can add a JSON Extractor in the GUI and then reference the extracted token with `${token}` in a Header Manager.
- When running large-scale tests consider distributed JMeter (master/worker) or use a cloud provider / CI with sufficient bandwidth and machine resources.

Security / Ethics
- Only run load tests against hosts you own or are authorized to test.
- Start small and monitor the backend to avoid taking down production unintentionally.

*** End README ***