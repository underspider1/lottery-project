from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from lottery_project import views
from lottery import views as lottery_views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),  # Project-level view
    path('lottery/', include('lottery.urls')),   # Includes URLs from lottery/urls.py
    path('accounts/', include('django.contrib.auth.urls', namespace='auth')),
    path('__debug__/', include('debug_toolbar.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)