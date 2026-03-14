import argparse
import json
import statistics
import sys


def parse_nums(s):
    if not s:
        return []
    parts = [p.strip() for p in s.split(",") if p.strip() != ""]
    nums = []
    for p in parts:
        nums.append(float(p))
    return nums


def compute_stats(nums):
    n = len(nums)
    if n == 0:
        return {"operation": "stats", "count": 0, "sum": 0, "mean": None, "median": None}
    s = sum(nums)
    mean = s / n
    median = statistics.median(nums)
    return {"operation": "stats", "count": n, "sum": s, "mean": mean, "median": float(median)}


def do_echo(text):
    t = text if text is not None else ""
    return {"operation": "echo", "text": t, "length": len(t)}


def main(argv=None):
    parser = argparse.ArgumentParser(prog="vast-test", add_help=True)
    parser.add_argument("--nums", type=str, default=None)
    parser.add_argument("--op", type=str, default="stats", choices=["stats", "echo"])
    parser.add_argument("--text", type=str, default=None)
    args = parser.parse_args(argv)
    if args.op == "stats":
        nums = parse_nums(args.nums) if args.nums else []
        out = compute_stats(nums)
    else:
        out = do_echo(args.text)
    print(json.dumps(out, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
