import json
import os
import subprocess
import sys
import unittest

ROOT = os.path.dirname(os.path.dirname(__file__))
SCRIPT = os.path.join(ROOT, "scripts", "main.py")


class TestVastTest(unittest.TestCase):
    def test_compute_stats_cli(self):
        cmd = [sys.executable, SCRIPT, "--nums", "1,2,3"]
        out = subprocess.check_output(cmd, text=True).strip()
        data = json.loads(out)
        self.assertEqual(data["operation"], "stats")
        self.assertEqual(data["count"], 3)
        self.assertEqual(data["sum"], 6.0)
        self.assertAlmostEqual(data["mean"], 2.0)
        self.assertAlmostEqual(data["median"], 2.0)

    def test_echo_cli(self):
        cmd = [sys.executable, SCRIPT, "--op", "echo", "--text", "hello"]
        out = subprocess.check_output(cmd, text=True).strip()
        data = json.loads(out)
        self.assertEqual(data["operation"], "echo")
        self.assertEqual(data["text"], "hello")
        self.assertEqual(data["length"], 5)


if __name__ == "__main__":
    unittest.main()
