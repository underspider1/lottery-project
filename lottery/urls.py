from . import views
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),  # Include this line
    path('', views.home_view, name='home'),
    path('pull/<int:banner_id>/', views.pull_view, name='pull'), 
    path('inventory/', views.inventory_view, name='inventory'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
