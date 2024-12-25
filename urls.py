from django.contrib import admin
from django.urls import path, include, reverse
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'), 
    path('', include('lottery.urls')),
]

def home_view(request):
    first_banner = Banner.objects.filter(is_active=True).order_by('id').first()
    if first_banner:
        return redirect('pull', banner_id=first_banner.pk) # Here you need to provide a banner_id
    else:
         return redirect(reverse('register'))  # Redirect to registration page using its name

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
