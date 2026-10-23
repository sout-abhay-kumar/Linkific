# Initial dictionary
students = {
    1: {"name": "Rahul", "age": 20},
    2: {"name": "Priya", "age": 21}
}

# 1. CREATE - Add a new student
students[3] = {"name": "Aman", "age": 19}
print("After Create:", students)

# 2. READ - Display all students
print("\nAll Students:")
for student_id, details in students.items():
    print(student_id, details)

# Read a specific student
print("\nStudent with ID 1:", students.get(1, "Student not found"))

# 3. UPDATE - Modify student details
if 1 in students:
    students[1]["age"] = 22
print("\nAfter Update:", students)

# 4. DELETE - Remove a student
deleted_student = students.pop(2, None)

if deleted_student is not None:
    print("\nDeleted Student:", deleted_student)
else:
    print("\nStudent not found")

print("Final Dictionary:", students)