from django.http import HttpResponseBadRequest, JsonResponse
from rest_framework import viewsets, status
from rest_framework.response import Response

from api.models import Card, Visitor
from api.serializers import CardSerializer


def get_initial_values(request):
    try:
        visitor = Visitor.objects.filter(id=request.GET.get('visitor_id')).first()
    except Exception:
        return HttpResponseBadRequest()
    if not visitor:
        visitor = Visitor.objects.create()
    response = JsonResponse({'visitor_id': visitor.id})
    return response


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
