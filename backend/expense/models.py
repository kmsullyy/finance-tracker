from django.db import models

# Create your models here.

class UserDetail(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=50)
    registration_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class Expense(models.Model):
    user = models.ForeignKey(UserDetail, on_delete=models.CASCADE)  # Changed from user_id to user
    expense_date = models.DateField(null=True, blank=True)
    expense_item = models.CharField(max_length=100)
    expense_cost = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.expense_item} - {self.expense_cost}"
