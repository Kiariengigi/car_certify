FROM python:3.10-slim

WORKDIR /app

# Install minimal system deps for numpy/pandas
RUN apt-get update && apt-get install -y --no-install-recommends \
    libatlas3-base \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --prefer-binary -r requirements.txt

COPY . .

ENV PYTHONPATH=/app

CMD ["python", "-m", "uvicorn", "mileage_predict:app", "--host", "0.0.0.0", "--port", "8000"]
