from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from lottery_project import views

urlpatterns = [
    path('admin/', admin.site.urls),  # Admin site
    path('', views.home_view, name='home'),  # Home view
    path('', include('lottery.urls')),  # Include lottery app URLs
    path('register/', views.register_view, name='register'), #Make sure this exists in lottery_project/views.py
    path('login/', views.login_view, name='login'), #Make sure this exists in lottery_project/views.py
    path('logout/', views.logout_view, name='logout'), #Make sure this exists in lottery_project/views.py
]



if settings.DEBUG:  # Serve media files only in DEBUG mode
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROO
