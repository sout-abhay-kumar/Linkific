# Difference between List and tuple

# List - Mutable, used when our data needs to change

fruits = ["apple", "banana", "mango"]

fruits[0] = "orange"
fruits.append("grapes")

print(fruits) # ['orange', 'banana', 'mango', 'grapes']



# Tuple - Immutable, used When we want a fixed collection

fruits = ("apple", "banana", "mango")

print(fruits[0])  # apple

# fruits[0] = "orange"  # TypeError