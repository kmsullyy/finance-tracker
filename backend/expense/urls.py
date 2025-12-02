from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('expenses/add/<int:user_id>/', add_expense, name='add_expense'),
    path('expenses/<int:user_id>/', get_expenses, name='get_expenses'),
    path('expenses/update/<int:expense_id>/', update_expense, name='update_expense'),
    path('expenses/delete/<int:expense_id>/', delete_expense, name='delete_expense'),
    path('expenses/manage/<int:expense_id>/', get_expenses, name='manage_expenses'),
    path('expenses/<int:user_id>/', get_expenses, name='get_expenses'),
    path('change-password/<int:user_id>/', change_password, name='change_password'),
]