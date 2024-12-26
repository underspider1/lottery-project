from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from lottery_project import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'), # Keep this for the homepage
    path('lottery/', include('lottery.urls')),  # Add a prefix here!
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('__debug__/', include('debug_toolbar.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)