from rest_framework import serializers

from api.models import Card, Collection
from api.utils import create_uuid


class CardSerializer(serializers.ModelSerializer):
    collections = serializers.PrimaryKeyRelatedField(queryset=Collection.objects.all(), many=True)

    class Meta:
        model = Card
        fields = '__all__'
        extra_kwargs = {
            'id': {'default': create_uuid(Card)}
        }


class CollectionSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True)

    class Meta:
        model = Collection
        fields = '__all__'
        extra_kwargs = {
            'id': {'default': create_uuid(Collection)}
        }
