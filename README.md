# Expenses

Expenses is an in development expense management API written in Python, using Django, Django Rest Framework, Pytest and Celery.

- Track expenses individually or in a group.
- Recieve monthly expense report emails.

I am currently trying to find the best options for deployment, so it is currently only able to run locally.

## To Get Started Using The API

With the server running, use cURL, Postman etc to:

- Hit the /api/signup endpoint supplying a username, password and email as JSON fields. E.g.

```curl
curl -X POST 'localhost/api/signup/' \
-H 'Content-Type: application/json' \
-d '{
    "username": "your_username",
    "password": "your_password",
    "email": "your@emailaddress.com"
}'
```

- Hit the /api/token/ endpoint with the same data to get your user token, supply this as an ``` Authorization: Token <yourtoken> ``` header on subsequent requests.

## To Get Started With Development

The easiest way to get started is to ```cd``` in to the backend directory and run ``` make ```. This will build the containers and start the server and celery in detached mode.

If you would like to check the logs from the terminal, open three terminals and in one terminal run:

- ``` make build ```, ``` make up ```
- ``` make celery_worker ```
- ``` make celery_beat ```

This should allow you to view the output from celery and celery beat.

## Future Features

- Frontend Mobile app (React Native)
- Implement receipt uploading to s3.
- Add styling to emails.
