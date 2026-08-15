from rest_framework import serializers
from .models import Category, Expense


class CategorySerializer(serializers.ModelSerializer):
    total_spent_this_month = serializers.SerializerMethodField()
    is_over_budget = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'monthly_budget',
            'total_spent_this_month', 'is_over_budget',
        ]

    def get_total_spent_this_month(self, obj):
        return obj.total_spent_this_month()

    def get_is_over_budget(self, obj):
        return obj.is_over_budget()


class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    formatted_amount = serializers.ReadOnlyField()

    class Meta:
        model = Expense
        fields = [
            'id', 'title', 'amount', 'formatted_amount',
            'category', 'category_name', 'date', 'notes',
            'created_at', 'updated_at',
        ]
