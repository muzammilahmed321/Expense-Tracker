from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator


class TimeStampedModel(models.Model):
    """
    Abstract base class (OOP: Abstraction + Inheritance).
    Any model that inherits this automatically gets created_at / updated_at
    without repeating the fields everywhere.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    """A spending category, e.g. Food, Rent, Transport."""

    MONTHLY_BUDGET_DEFAULT = Decimal('0')

    name = models.CharField(max_length=50, unique=True)
    monthly_budget = models.DecimalField(
        max_digits=10, decimal_places=2, default=MONTHLY_BUDGET_DEFAULT,
        validators=[MinValueValidator(Decimal('0'))]
    )

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def __str__(self):
        return self.name

    # Encapsulation: category knows how to calculate its own spend/limit logic
    def total_spent_this_month(self):
        from django.utils import timezone
        now = timezone.now()
        return self.expenses.filter(
            date__year=now.year, date__month=now.month
        ).aggregate(models.Sum('amount'))['amount__sum'] or 0

    def is_over_budget(self):
        if self.monthly_budget == 0:
            return False
        return self.total_spent_this_month() > self.monthly_budget


class Expense(TimeStampedModel):
    """A single expense entry, linked to a Category."""

    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2,
                                  validators=[MinValueValidator(Decimal('0.01'))])
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='expenses'
    )
    date = models.DateField()
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.amount}"

    @property
    def formatted_amount(self):
        """A simple computed property (encapsulation of formatting logic)."""
        return f"${self.amount:,.2f}"