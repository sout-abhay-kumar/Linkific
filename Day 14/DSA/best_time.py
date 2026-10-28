def maxProfit(prices):
    min_price = float("inf")
    max_profit = 0

    for price in prices:
        # Find the lowest buying price
        if price < min_price:
            min_price = price

        # Calculate profit if we sell today
        profit = price - min_price

        # Update maximum profit
        if profit > max_profit:
            max_profit = profit

    return max_profit


# Example
prices = [7, 1, 5, 3, 6, 4]

print(maxProfit(prices))