from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer
from .services import ExpenseAnalyzer, MonthlyBudgetPolicy, StrictBudgetPolicy


class CategoryViewSet(viewsets.ModelViewSet):
    """Full CRUD for categories (class-based view = OOP building block)."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """Full CRUD for expenses. Supports optional ?category=<id> filtering."""
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = Expense.objects.select_related('category').all()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


class ExpenseSummaryView(APIView):
    """
    Read-only endpoint that uses the ExpenseAnalyzer service to return
    a dashboard-friendly summary: total spend, spend by category, and
    budget health per category (using a swappable BudgetPolicy).
    """

    def get(self, request):
        strict = request.query_params.get('strict') == 'true'
        policy = StrictBudgetPolicy() if strict else MonthlyBudgetPolicy()

        expenses = Expense.objects.select_related('category').all()
        analyzer = ExpenseAnalyzer(expenses, policy=policy)

        categories = Category.objects.all()
        category_health = {
            category.name: analyzer.category_status(category)
            for category in categories
        }

        data = {
            'total_spent': analyzer.total(),
            'by_category': analyzer.by_category(),
            'top_category': analyzer.top_category(),
            'category_health': category_health,
        }
        return Response(data, status=status.HTTP_200_OK)
