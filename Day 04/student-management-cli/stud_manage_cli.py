
import json
from pathlib import Path

FILE_PATH = Path(__file__).parent / "students.json"


# Load student records from the JSON file
def load_students():
    try:
        with open(FILE_PATH, "r", encoding="utf-8") as file:
            students = json.load(file)

            if not isinstance(students, list):
                print("Warning: Invalid student data format.")
                return []

            return students

    except FileNotFoundError:
        return []

    except json.JSONDecodeError:
        print("Warning: Student file is corrupted.")
        return []

    except OSError as error:
        print(f"Error reading file: {error}")
        return []


# Save student records to the JSON file
def save_students(students):
    try:
        with open(FILE_PATH, "w", encoding="utf-8") as file:
            json.dump(students, file, indent=4)

        return True

    except OSError as error:
        print(f"Error saving records: {error}")
        return False


# Add a new student
def add_student(students):
    try:
        roll_no = int(input("Enter roll number: "))

        if roll_no <= 0:
            print("Roll number must be positive.")
            return

        if any(s["roll_no"] == roll_no for s in students):
            print("This roll number already exists.")
            return

        name = input("Enter student name: ").strip()
        course = input("Enter course: ").strip()
        age = int(input("Enter age: "))

        if not name or not course:
            print("Name and course cannot be empty.")
            return

        if age <= 0:
            print("Age must be positive.")
            return

        student = {
            "roll_no": roll_no,
            "name": name,
            "course": course,
            "age": age
        }

        students.append(student)

        if save_students(students):
            print("Student added successfully!")
        else:
            students.pop()

    except ValueError:
        print("Invalid input. Enter numbers for roll number and age.")


# Display all students
def view_students(students):
    if not students:
        print("No student records found.")
        return

    print("\n========== STUDENT RECORDS ==========")

    for student in students:
        print(f"""
Roll Number : {student['roll_no']}
Name        : {student['name']}
Course      : {student['course']}
Age         : {student['age']}
--------------------------------------
""")


# Search for a student
def search_student(students):
    try:
        roll_no = int(input("Enter roll number to search: "))

        for student in students:
            if student["roll_no"] == roll_no:
                print("\nStudent found!")
                print(f"Roll Number: {student['roll_no']}")
                print(f"Name: {student['name']}")
                print(f"Course: {student['course']}")
                print(f"Age: {student['age']}")
                return

        print("Student not found.")

    except ValueError:
        print("Please enter a valid roll number.")


# Update student details
def update_student(students):
    try:
        roll_no = int(input("Enter roll number to update: "))

        for student in students:
            if student["roll_no"] == roll_no:
                print("Press Enter to keep the existing value.")

                name = input(
                    f"Name [{student['name']}]: "
                ).strip()

                course = input(
                    f"Course [{student['course']}]: "
                ).strip()

                age_input = input(
                    f"Age [{student['age']}]: "
                ).strip()

                new_name = name or student["name"]
                new_course = course or student["course"]

                if age_input:
                    new_age = int(age_input)

                    if new_age <= 0:
                        print("Age must be positive.")
                        return
                else:
                    new_age = student["age"]

                old_student = student.copy()

                student.update({
                    "name": new_name,
                    "course": new_course,
                    "age": new_age
                })

                if save_students(students):
                    print("Student updated successfully!")
                else:
                    student.update(old_student)

                return

        print("Student not found.")

    except ValueError:
        print("Please enter a valid number for age or roll number.")


# Delete a student
def delete_student(students):
    try:
        roll_no = int(input("Enter roll number to delete: "))

        for index, student in enumerate(students):
            if student["roll_no"] == roll_no:
                print(f"Student: {student['name']}")

                confirm = input(
                    "Are you sure you want to delete? (y/n): "
                ).strip().lower()

                if confirm != "y":
                    print("Deletion cancelled.")
                    return

                deleted_student = students.pop(index)

                if save_students(students):
                    print("Student deleted successfully!")
                else:
                    students.insert(index, deleted_student)

                return

        print("Student not found.")

    except ValueError:
        print("Please enter a valid roll number.")


# Main menu
def main():
    students = load_students()

    while True:
        print("\n====== STUDENT MANAGEMENT SYSTEM ======")
        print("1. Add Student")
        print("2. View All Students")
        print("3. Search Student")
        print("4. Update Student")
        print("5. Delete Student")
        print("6. Exit")

        choice = input("Enter your choice (1-6): ").strip()

        if choice == "1":
            add_student(students)

        elif choice == "2":
            view_students(students)

        elif choice == "3":
            search_student(students)

        elif choice == "4":
            update_student(students)

        elif choice == "5":
            delete_student(students)

        elif choice == "6":
            print("Thank you for using Student Management System!")
            break

        else:
            print("Invalid choice. Please select 1-6.")


if __name__ == "__main__":
    main()
