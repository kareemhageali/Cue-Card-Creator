from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.response import Response

from api.models import Card, Collection, Visitor
from api.serializers import CardSerializer, CollectionSerializer
from api.utils import create_uuid


def get_initial_values(request):
    visitor = Visitor.objects.filter(id=request.GET.get('visitor')).first()
    if not visitor:
        visitor = Visitor.objects.create(id=create_uuid(Visitor))
    response = JsonResponse({'visitor': visitor.id})
    return response


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        collection = request.query_params.get('collection')
        if collection:
            queryset = queryset.filter(collections__id=collection)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
