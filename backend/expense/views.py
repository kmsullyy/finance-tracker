from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import *

# Create your views here.

#Signup API
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        full_name = data.get('full_name')
        email = data.get('email')
        password = data.get('password')

        if UserDetail.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'message': 'Email already exists'}, status=400)
        UserDetail.objects.create(full_name=full_name, email=email, password=password)
        return JsonResponse({'status': 'success', 'message': 'User registered successfully'}, status=201)

#Login API
@csrf_exempt    
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        try:
            user = UserDetail.objects.get(email=email, password=password)
            return JsonResponse({'message': 'Login successful', 'userId':user.id, 'userName':user.full_name}, status=200)
        except:
            return JsonResponse({'message': 'Invalid credentials'}, status=400)
        
@csrf_exempt
def add_expense(request, user_id):
    if request.method != "POST":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        user = UserDetail.objects.get(id=user_id)
    except UserDetail.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    try:
        data = json.loads(request.body)
        expense_item = data.get("expense_item")
        expense_cost = data.get("expense_cost")
        expense_date = data.get("expense_date")
        note = data.get("note", "")

        Expense.objects.create(
            user=user,  # Changed from user_id to user
            expense_item=expense_item,
            expense_cost=expense_cost,
            expense_date=expense_date,
            note=note
        )
        return JsonResponse({"message": "Expense added successfully"}, status=201)

    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=400)

@csrf_exempt
def get_expenses(request, user_id):
    if request.method != "GET":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        user = UserDetail.objects.get(id=user_id)
    except UserDetail.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    # Get all expenses for this user
    expenses = Expense.objects.filter(user=user).order_by('-expense_date')
    
    # Convert to list of dictionaries
    expenses_list = []
    for expense in expenses:
        expenses_list.append({
            'id': expense.id,
            'expense_date': expense.expense_date,
            'expense_item': expense.expense_item,
            'expense_cost': str(expense.expense_cost),
            'note': expense.note,
            'created_at': expense.created_at
        })
    
    return JsonResponse(expenses_list, safe=False, status=200)

@csrf_exempt
def update_expense(request, expense_id):
    if request.method != "PUT":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        expense = Expense.objects.get(id=expense_id)
    except Expense.DoesNotExist:
        return JsonResponse({"message": "Expense not found"}, status=404)

    try:
        data = json.loads(request.body)
        expense.expense_item = data.get("expense_item", expense.expense_item)
        expense.expense_cost = data.get("expense_cost", expense.expense_cost)
        expense.expense_date = data.get("expense_date", expense.expense_date)
        expense.note = data.get("note", expense.note)
        expense.save()
        
        return JsonResponse({"message": "Expense updated successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=400)


@csrf_exempt
def delete_expense(request, expense_id):
    if request.method != "DELETE":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        expense = Expense.objects.get(id=expense_id)
        expense.delete()
        return JsonResponse({"message": "Expense deleted successfully"}, status=200)
    except Expense.DoesNotExist:
        return JsonResponse({"message": "Expense not found"}, status=404)
    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=400)
    
@csrf_exempt
def change_password(request, user_id):
    if request.method != "POST":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        user = UserDetail.objects.get(id=user_id)
    except UserDetail.DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=404)

    data = json.loads(request.body)
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    # Validate old password
    if user.password != old_password:
        return JsonResponse({"message": "Incorrect old password"}, status=400)

    # Update password
    user.password = new_password
    user.save()

    return JsonResponse({"message": "Password updated successfully"}, status=200)


