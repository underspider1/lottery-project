from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from lottery_project import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),
    path('lottery/', include('lottery.urls')), # Best practice: add the app's name as a URL prefix 
    path('accounts/', include('django.contrib.auth.urls')),  # Keep this
    path('__debug__/', include('debug_toolbar.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)