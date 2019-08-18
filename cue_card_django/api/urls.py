from django.urls import path
from django.conf.urls import include, url
from rest_framework import routers

from api import views

router = routers.DefaultRouter()
router.register(r'cards', views.CardViewSet)

urlpatterns = [
    path('get_initial_values/', views.get_initial_values),
    url(r'^', include(router.urls)),
]
