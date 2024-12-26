from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from lottery_project import views  # Import your views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),
    path('', include('lottery.urls')),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]

# Add this AFTER urlpatterns is defined.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)