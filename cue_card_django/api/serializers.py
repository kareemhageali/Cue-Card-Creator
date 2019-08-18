from rest_framework import serializers

from api.models import Card, Collection
from api.utils import create_uuid


class CardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(default=create_uuid(Card))

    class Meta:
        model = Card
        fields = '__all__'


class CollectionSerializer(serializers.ModelSerializer):
    id = serializers.CharField(default=create_uuid(Collection))
    cards = CardSerializer(many=True)

    class Meta:
        model = Collection
        fields = '__all__'
