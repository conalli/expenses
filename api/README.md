# Expenses API

## Seeding Data / Fixtures

To create fixture from current data.

``` python
python manage.py dumpdata <app_name>.<model_name>  > ./fixtures/<model_name>.json
```

to add fixture data to db

``` python
python manage.py loaddata <fixturename>
```
