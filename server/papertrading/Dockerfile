FROM python:3.9-bullseye

ADD ./requirements.txt /home/server/requirements.txt
WORKDIR /home/server
RUN pip install -r requirements.txt
ADD . /home/server
RUN python manage.py migrate
#RUN sed -i 's/^DEBUG = True/DEBUG = False/' papertrading/settings.py
#CMD ["python","manage.py", "makemigrations"]
CMD ["python","manage.py", "runserver", "0.0.0.0:8080"]
