# Generated by Django 4.1.3 on 2023-01-16 11:10

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_expense_paid_by_alter_category_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='expense',
            name='group',
            field=models.ForeignKey(default=35, on_delete=django.db.models.deletion.CASCADE, to='core.group'),
            preserve_default=False,
        ),
    ]
