# Generated by Django 2.2.4 on 2019-08-15 02:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=256)),
                ('answer', models.CharField(max_length=256)),
            ],
        ),
        migrations.CreateModel(
            name='Visitor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip_address', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('cards', models.ManyToManyField(to='api.Card')),
                ('visitor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Visitor')),
            ],
        ),
        migrations.AddField(
            model_name='card',
            name='visitor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Visitor'),
        ),
    ]
