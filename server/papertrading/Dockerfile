FROM python:3.9-bullseye

COPY . /home/server
WORKDIR /home/server
RUN pip install -r requirements.txt
RUN sed -i 's/^DEBUG = True/DEBUG = False/' papertrading/settinsg.py
CMD ["python","manage.py", "makemigrations"]
CMD ["python","manage.py", "runserver", "0.0.0.0:8000"]
