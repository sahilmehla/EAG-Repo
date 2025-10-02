from win32api import GetSystemMetrics, EnumDisplayMonitors
import win32gui

print("=== Monitor Information ===\n")

# Get primary monitor dimensions
primary_width = GetSystemMetrics(0)  # SM_CXSCREEN
primary_height = GetSystemMetrics(1)  # SM_CYSCREEN

print(f"Primary Monitor (via GetSystemMetrics):")
print(f"  Width: {primary_width}px")
print(f"  Height: {primary_height}px")
print()

# Get all monitors with their positions
monitors = EnumDisplayMonitors()
print(f"Total Monitors: {len(monitors)}\n")

for i, monitor in enumerate(monitors):
    handle, device, rect = monitor
    x1, y1, x2, y2 = rect
    width = x2 - x1
    height = y2 - y1

    print(f"Monitor {i + 1}:")
    print(f"  Position: ({x1}, {y1}) to ({x2}, {y2})")
    print(f"  Size: {width}x{height}")
    print(f"  Top-left corner: ({x1}, {y1})")

    # Determine if portrait or landscape
    orientation = "Portrait" if height > width else "Landscape"
    print(f"  Orientation: {orientation}")
    print()

print("\n=== Recommendation ===")
print("For your open_paint() function:")
print("- Use the top-left corner coordinates of your target monitor")
print("- The monitor where x1 != 0 is likely your secondary monitor")
