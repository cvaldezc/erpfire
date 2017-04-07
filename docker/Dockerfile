FROM ubuntu:16.10
RUN apt-get update
RUN apt-get -y install libjpeg8 libjpeg8-dev libfreetype6 libfreetype6-dev zlib1g-dev
RUN apt-get install -y python-pip
RUN pip install --upgrade pip
RUN apt-get install -y --no-install-recommends libpq-dev
#    && rm -rf /var/lib/apt/lists/*
RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code
RUN pip install -r /code/requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


# docker run -d -p 22 -p 8000:8000 --name sdjango -v ~/development/python/erpfire:/code --link pgdev:postgres cv/django:1.5.9

# docker run -p 5432:5432 --name pgdev -v ~/containers/dbs/pgdata:/var/lib/postgresql/data -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=Syst3mH3ll -d postgres:9.6