class Book:
    def __init__(self, book_id, title, author):
        self.book_id = book_id
        self.title = title
        self.author = author

    def __str__(self):
        return (
            f"ID: {self.book_id}, "
            f"Title: {self.title}, "
            f"Author: {self.author}"
        )


class BookManager:
    def __init__(self):
        self.books = []
        self.next_id = 1

    # CREATE
    def create_book(self, title, author):
        book = Book(self.next_id, title, author)

        self.books.append(book)
        self.next_id += 1

        print("Book created successfully!")
        return book

    # READ
    def get_books(self):
        if not self.books:
            print("No books available.")
            return

        for book in self.books:
            print(book)

    # READ by ID
    def get_book(self, book_id):
        for book in self.books:
            if book.book_id == book_id:
                return book

        print("Book not found.")
        return None

    # UPDATE
    def update_book(self, book_id, title, author):
        book = self.get_book(book_id)

        if book is None:
            return

        book.title = title
        book.author = author

        print("Book updated successfully!")

    # DELETE
    def delete_book(self, book_id):
        book = self.get_book(book_id)

        if book is None:
            return

        self.books.remove(book)

        print("Book deleted successfully!")


# Create a manager object
manager = BookManager()

# CREATE
manager.create_book("Python Programming", "John Smith")
manager.create_book("Learning FastAPI", "Alex Brown")

print("\n--- All Books ---")

# READ
manager.get_books()

print("\n--- Update Book ---")

# UPDATE
manager.update_book(
    1,
    "Advanced Python Programming",
    "John Smith"
)

print("\n--- Books After Update ---")

manager.get_books()

print("\n--- Delete Book ---")

# DELETE
manager.delete_book(2)

print("\n--- Books After Deletion ---")

manager.get_books()