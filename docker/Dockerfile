FROM debian:jessie
RUN apt-get update
RUN apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get install python_pip
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code
RUN pip install -r /code/requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]