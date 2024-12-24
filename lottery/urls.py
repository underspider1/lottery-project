from django.urls import path, re_path  # Import re_path
from . import views

urlpatterns = [
    path('pull/', views.pull_view, name='pull'),
    path('inventory/', views.inventory_view, name='inventory'),  # If you have this page
    re_path(r'^.*$', views.lottery_view, name='home'),  # Catch-all route at the end
]
