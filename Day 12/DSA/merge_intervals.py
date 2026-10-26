
def merge_intervals(intervals):
    if not intervals:
        return []

    # Sort intervals by their starting point
    intervals.sort(key=lambda interval: interval[0])

    merged = [intervals[0]]

    for start, end in intervals[1:]:
        last_end = merged[-1][1]

        if start <= last_end:
            # Overlapping intervals: extend the previous interval
            merged[-1][1] = max(last_end, end)
        else:
            # No overlap: add a new interval
            merged.append([start, end])

    return merged


intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]

print(merge_intervals(intervals))

