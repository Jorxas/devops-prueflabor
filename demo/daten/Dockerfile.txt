FROM python:3.12-slim@sha256:5e2bdb1b0d542d5039cffb8181c65930093949194a65c365dfb1b0fe13a4fa5b
WORKDIR /dienst
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 MINIDATAHUB_DATENBANK=/tmp/protokolle.sqlite
COPY bereitstellung/anforderungen.txt /dienst/anforderungen.txt
RUN pip install --no-cache-dir -r anforderungen.txt
COPY bereitstellung/p02 /dienst/bereitstellung/p02
COPY src/container_api.py /dienst/src/container_api.py
USER 10001:10001
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:3000/gesundheit', timeout=2)"
CMD ["python", "-m", "uvicorn", "src.container_api:anwendung", "--host", "0.0.0.0", "--port", "3000"]
