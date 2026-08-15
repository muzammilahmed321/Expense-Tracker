from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ExpenseViewSet, ExpenseSummaryView

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('summary/', ExpenseSummaryView.as_view(), name='expense-summary'),
    path('', include(router.urls)),
]
