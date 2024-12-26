from django.urls import path
from lottery_project import views

app_name = 'lottery'  # Add namespace

urlpatterns = [
    path('pull/<int:banner_id>/', views.pull_view, name='pull'),
    path('inventory/', views.inventory_view, name='inventory'),
]