def reverse_words(s):
    words = s.split()

    words.reverse()

    return " ".join(words)


print(reverse_words("the sky is blue"))
# blue is sky the

print(reverse_words(" hello world "))
# world hello

print(reverse_words("a good   example"))
# example good a