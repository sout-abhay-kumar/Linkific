class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def mergeTwoLists(list1, list2):
    dummy = ListNode()
    current = dummy

    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next

        current = current.next

    # Attach the remaining nodes
    if list1:
        current.next = list1
    else:
        current.next = list2

    return dummy.next


# Helper function to create a linked list
def createLinkedList(values):
    dummy = ListNode()
    current = dummy

    for value in values:
        current.next = ListNode(value)
        current = current.next

    return dummy.next


# Helper function to print a linked list
def printLinkedList(head):
    while head:
        print(head.val, end=" -> ")
        head = head.next

    print("None")


# Example
list1 = createLinkedList([1, 2, 4])
list2 = createLinkedList([1, 3, 4])

merged = mergeTwoLists(list1, list2)

printLinkedList(merged)