from django.http import JsonResponse
from rest_framework import viewsets

from api.models import Card, Collection, Visitor
from api.serializers import CardSerializer, CollectionSerializer
from api.utils import create_uuid


def get_initial_values(request):
    visitor = Visitor.objects.filter(id=request.GET.get('visitor_id')).first()
    if not visitor:
        visitor = Visitor.objects.create(id=create_uuid(Visitor))
    response = JsonResponse({'visitor_id': visitor.id})
    return response


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer

    def get_queryset(self):
        queryset = self.queryset
        # Sort collections query set by amount of cards in each collection
        queryset = sorted(queryset.all(), key=lambda x: len(x.cards.all()),
                          reverse=True)

        visitor_id = self.request.query_params.get('visitor')
        if visitor_id:
            # Sort by if the visitor owns the collection
            queryset = sorted(queryset, key=lambda x: x.visitor.id == visitor_id,
                              reverse=True)
        return queryset
