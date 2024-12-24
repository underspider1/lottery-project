class User:
    def __init__(self, name):
        self.name = name
        self.balance = 0

    def show_balance(self):
        return f"Your current balance: {self.balance} gems"

    def add_balance(self, amount):
        if amount > 0:
            self.balance += amount
            return f"Balance tipped by {amount} gems. {self.show_balance()}"
        else:
            return "The sum of received gems should be positive."

    def spend_balance(self, amount):
        if 0 < amount <= self.balance:
            self.balance -= amount
            return f"Spent {amount} gems. {self.show_balance()}"
        else:
            return "Not enough gems."