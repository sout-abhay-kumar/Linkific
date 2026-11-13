
class HashMap:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.size = 0
        self.buckets = [[] for _ in range(capacity)]

    # Generate an index using the hash function
    def _hash(self, key):
        return hash(key) % self.capacity

    # Insert or update a key-value pair
    def insert(self, key, value):
        index = self._hash(key)
        bucket = self.buckets[index]

        for i, (existing_key, existing_value) in enumerate(bucket):
            if existing_key == key:
                bucket[i] = (key, value)
                return

        bucket.append((key, value))
        self.size += 1

    # Retrieve a value using its key
    def get(self, key):
        index = self._hash(key)
        bucket = self.buckets[index]

        for existing_key, value in bucket:
            if existing_key == key:
                return value

        return None

    # Remove a key-value pair
    def remove(self, key):
        index = self._hash(key)
        bucket = self.buckets[index]

        for i, (existing_key, value) in enumerate(bucket):
            if existing_key == key:
                del bucket[i]
                self.size -= 1
                return True

        return False

    # Check whether a key exists
    def contains(self, key):
        index = self._hash(key)
        bucket = self.buckets[index]

        for existing_key, value in bucket:
            if existing_key == key:
                return True

        return False

    # Return the number of key-value pairs
    def length(self):
        return self.size

    # Display the Hash Map
    def display(self):
        for index, bucket in enumerate(self.buckets):
            print(f"Bucket {index}: {bucket}")


# Testing the Hash Map
if __name__ == "__main__":
    hashmap = HashMap()

    hashmap.insert("name", "Abhay")
    hashmap.insert("age", 21)
    hashmap.insert("role", "Backend Developer")

    print("Name:", hashmap.get("name"))
    print("Age:", hashmap.get("age"))

    hashmap.insert("age", 22)
    print("Updated Age:", hashmap.get("age"))

    print("Contains name:", hashmap.contains("name"))
    print("Contains city:", hashmap.contains("city"))

    hashmap.remove("role")

    print("Total elements:", hashmap.length())

    hashmap.display()
