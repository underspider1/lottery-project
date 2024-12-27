from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from lottery_project import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),  # Homepage
    path('auth/', include('django.contrib.auth.urls')), 
    path('lottery/', include('lottery.urls')),  # Lottery app URLs with prefix
    path('accounts/', include('django.contrib.auth.urls')), # Built in authentication views
    path('__debug__/', include('debug_toolbar.urls')),  # Debug toolbar
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)