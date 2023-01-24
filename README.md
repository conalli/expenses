# Expenses

Expenses is an in development expense management API written in Python, using Django, Django Rest Framework, Pytest and Celery.

- Track expenses individually or in a group.
- Recieve monthly expense report emails.

## To Get Started

The easiest way to get started is to ```cd``` in to the backend directory and run ``` make ```. This will build the containers and start the server and celery in detached mode.

If you would like to check the logs from the terminal, open three terminals and in one terminal run:

- ``` make build ```, ``` make up ```
- ``` make celery_worker ```
- ``` make celery_beat ```

This should allow you to view the output from celery and celery beat.

## Future Features

- Implement receipt uploading to s3.
