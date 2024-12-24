from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from .models import LotteryTicket 
import random

def lottery_view(request):
    if request.method == 'POST':
        user_name = request.POST.get('user_name')
        ticket_number = request.POST.get('ticket_number')
        LotteryTicket.objects.create(user_name=user_name, ticket_number=ticket_number)
            
    tickets = LotteryTicket.objects.all()
    return render(request, 'lottery/lottery.html', {'tickets': tickets})

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('lottery')  # Переход на основную страницу
        else:
            return render(request, 'lottery/login.html', {'error': 'Неверный логин или пароль'})
    return render(request, 'lottery/login.html')

def logout_view(request):
    logout(request)
    return redirect('lottery')  # Переход на основную страницу после выхода

def inventory_view(request):
    # Здесь может быть логика проверки инвентаря
    return render(request, 'lottery/inventory.html')

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # Переход на страницу логина после успешной регистрации
    else:
        form = UserCreationForm()
    return render(request, 'lottery/register.html', {'form': form})

def pull_view(request):
    if request.method == 'POST':
        # Тут предполагается, что у вас есть модель User с полем 'balance'
        user = request.user  
        
        if user.balance >= 10:  # Например, крутка стоит 10 валюты
            user.balance -= 10  # Уменьшаем баланс на 10
            user.save()

            items = Item.objects.all()  # Получаем все предметы
            random_item = random.choice(items)  # Выбор рандомного предмета

            return render(request, 'lottery/pull.html', {'item': random_item})
        else:
            return render(request, 'lottery/pull.html', {'error': 'Недостаточно валюты!'})

    return render(request, 'lottery/pull.html')