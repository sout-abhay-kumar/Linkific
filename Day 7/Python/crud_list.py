
# Book Library Management System using a Python list

books = [
    {"id": 1, "title": "Python Basics", "author": "John Smith"},
    {"id": 2, "title": "Clean Code", "author": "Robert Martin"}
]


# CREATE: Add a new book
def add_book(title, author):
    new_id = max((book["id"] for book in books), default=0) + 1

    book = {
        "id": new_id,
        "title": title,
        "author": author
    }

    books.append(book)
    print(f"Book added successfully! ID: {new_id}")


# READ: Display all books
def view_books():
    if not books:
        print("No books found.")
        return

    print("\n--- Book Library ---")
    for book in books:
        print(
            f"ID: {book['id']} | "
            f"Title: {book['title']} | "
            f"Author: {book['author']}"
        )


# UPDATE: Change a book's details
def update_book(book_id, new_title, new_author):
    for book in books:
        if book["id"] == book_id:
            book["title"] = new_title
            book["author"] = new_author
            print("Book updated successfully!")
            return

    print("Book not found.")


# DELETE: Remove a book
def delete_book(book_id):
    for book in books:
        if book["id"] == book_id:
            books.remove(book)
            print("Book deleted successfully!")
            return

    print("Book not found.")


# Menu-driven application
while True:
    print("\n===== BOOK LIBRARY =====")
    print("1. Add book")
    print("2. View books")
    print("3. Update book")
    print("4. Delete book")
    print("5. Exit")

    choice = input("Enter your choice: ")

    if choice == "1":
        title = input("Enter book title: ").strip()
        author = input("Enter author name: ").strip()

        if title and author:
            add_book(title, author)
        else:
            print("Title and author cannot be empty.")

    elif choice == "2":
        view_books()

    elif choice == "3":
        try:
            book_id = int(input("Enter book ID to update: "))
            title = input("Enter new title: ").strip()
            author = input("Enter new author: ").strip()

            if title and author:
                update_book(book_id, title, author)
            else:
                print("Title and author cannot be empty.")

        except ValueError:
            print("Please enter a valid numeric ID.")

    elif choice == "4":
        try:
            book_id = int(input("Enter book ID to delete: "))
            delete_book(book_id)
        except ValueError:
            print("Please enter a valid numeric ID.")

    elif choice == "5":
        print("Thank you for using the Book Library!")
        break

    else:
        print("Invalid choice. Please select 1-5.")
