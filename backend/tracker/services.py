"""
Service layer: business logic is kept out of views/models and organized
into classes. This demonstrates several OOP concepts:

- Abstraction:  BudgetPolicy defines *what* a policy must do, not *how*.
- Inheritance:  MonthlyBudgetPolicy / StrictBudgetPolicy extend it.
- Polymorphism: ExpenseAnalyzer can work with ANY BudgetPolicy subclass
                without knowing which concrete class it is.
- Encapsulation: internal calculation details are hidden behind
                 clean public methods.
"""

from abc import ABC, abstractmethod
from collections import defaultdict
from decimal import Decimal


class BudgetPolicy(ABC):
    """Abstract base class: defines the contract every budget policy must follow."""

    @abstractmethod
    def evaluate(self, spent: Decimal, budget: Decimal) -> dict:
        """Return a dict describing the status of spending against budget."""
        raise NotImplementedError


class MonthlyBudgetPolicy(BudgetPolicy):
    """Standard policy: warns once spending crosses 80% of budget."""

    WARNING_THRESHOLD = 0.8

    def evaluate(self, spent: Decimal, budget: Decimal) -> dict:
        if budget <= 0:
            return {'status': 'no_budget_set', 'percentage': 0}

        percentage = float(spent) / float(budget) * 100
        if spent > budget:
            status = 'over_budget'
        elif percentage >= self.WARNING_THRESHOLD * 100:
            status = 'warning'
        else:
            status = 'ok'

        return {'status': status, 'percentage': round(percentage, 1)}


class StrictBudgetPolicy(MonthlyBudgetPolicy):
    """
    A stricter variant (inheritance + polymorphism): warns earlier, at 60%.
    Overrides the parent's threshold rather than the whole method.
    """
    WARNING_THRESHOLD = 0.6


class ExpenseAnalyzer:
    """
    Encapsulates all analytical logic around a queryset of expenses.
    A BudgetPolicy is injected (dependency injection), so the analyzer
    doesn't care which concrete policy it's using -- polymorphism in action.
    """

    def __init__(self, expenses_queryset, policy: BudgetPolicy = None):
        self._expenses = expenses_queryset
        self._policy = policy or MonthlyBudgetPolicy()

    def total(self) -> Decimal:
        return sum((e.amount for e in self._expenses), Decimal('0'))

    def by_category(self) -> dict:
        """Groups total spend per category name."""
        totals = defaultdict(lambda: Decimal('0'))
        for expense in self._expenses:
            totals[expense.category.name] += expense.amount
        return dict(totals)

    def category_status(self, category) -> dict:
        """Uses the injected policy to evaluate a single category's health."""
        spent = category.total_spent_this_month()
        return self._policy.evaluate(Decimal(spent), category.monthly_budget)

    def top_category(self):
        totals = self.by_category()
        if not totals:
            return None
        return max(totals, key=totals.get)
