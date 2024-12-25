from django.urls import path
from . import views

urlpatterns = [
    path('pull/<int:banner_id>/', views.pull_view, name='pull'),
    path('inventory/', views.inventory_view, name='inventory'),

]