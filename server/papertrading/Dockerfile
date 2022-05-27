FROM python:3.9-bullseye
#I love this person
#https://stackoverflow.com/questions/35231362/dockerfile-and-docker-compose-not-updating-with-new-instructions

ADD ./requirements.txt /home/server/requirements.txt
WORKDIR /home/server

RUN pip install -r requirements.txt

ADD . /home/server
RUN python manage.py migrate
#RUN sed -i 's/^DEBUG = True/DEBUG = False/' papertrading/settings.py
#CMD ["python","manage.py", "makemigrations"]
CMD ["python","manage.py", "runserver", "0.0.0.0:8080"]

#For postgres with
#https://computingforgeeks.com/dockerize-django-application-with-postgresql/
