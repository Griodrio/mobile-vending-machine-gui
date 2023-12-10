FROM python:3.8-slim

RUN apt-get update
RUN apt-get install -y netcat-traditional
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

WORKDIR /home/user/mvm_backend

COPY . .
RUN pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]