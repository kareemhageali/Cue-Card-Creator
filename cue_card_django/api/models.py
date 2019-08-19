from django.db import models


class Visitor(models.Model):
    id = models.CharField(primary_key=True, unique=True, max_length=32)
    ip_address = models.CharField(max_length=50, blank=True)


class Card(models.Model):
    id = models.CharField(primary_key=True, unique=True, max_length=32)
    question = models.CharField(max_length=256)
    answer = models.CharField(max_length=256)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)


class Collection(models.Model):
    id = models.CharField(primary_key=True, unique=True, max_length=32)
    name = models.CharField(max_length=100)
    cards = models.ManyToManyField(Card, blank=True, related_name='collections')
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)
