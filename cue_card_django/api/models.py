from django.db import models


class Visitor(models.Model):
    ip_address = models.CharField(max_length=50, blank=True)


class Card(models.Model):
    question = models.CharField(max_length=256)
    answer = models.CharField(max_length=256)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)


class Collection(models.Model):
    name = models.CharField(max_length=50)
    cards = models.ManyToManyField(Card)
    visitor = models.ForeignKey(Visitor, on_delete=models.CASCADE)
