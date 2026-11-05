def merge_intervals(intervals):
    if not intervals:
        return []

    # Sort intervals based on their starting values
    intervals.sort(key=lambda x: x[0])

    merged = [intervals[0]]

    for current in intervals[1:]:
        last = merged[-1]

        # Check if current interval overlaps with the last interval
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)

    return merged


# Example
intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]

print("Merged intervals:", merge_intervals(intervals))