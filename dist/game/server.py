#!/usr/bin/env python3
"""Serve the game and persist leaderboard scores to scores.json."""

from __future__ import annotations

import json
import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
SCORES_PATH = ROOT / "scores.json"
HOST = "127.0.0.1"
PORT = 8765
TARGET_MS = 30_000
MAX_NAME = 24
MAX_SCORES = 100


def load_scores() -> dict:
    if not SCORES_PATH.exists():
        return {"scores": []}
    try:
        data = json.loads(SCORES_PATH.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"scores": []}
    if not isinstance(data, dict) or not isinstance(data.get("scores"), list):
        return {"scores": []}
    return data


def save_scores(data: dict) -> None:
    SCORES_PATH.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def sanitize_name(raw: str) -> str | None:
    name = re.sub(r"\s+", " ", (raw or "").strip())
    if not name or len(name) > MAX_NAME:
        return None
    if any(ord(ch) < 32 for ch in name):
        return None
    return name


def rank_key(entry: dict) -> tuple:
    delta = abs(int(entry.get("ms", 0)) - TARGET_MS)
    return (delta, int(entry.get("ms", 0)), str(entry.get("at", "")))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ("/scores", "/scores.json"):
            body = json.dumps(load_scores(), ensure_ascii=False).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if path not in ("/scores", "/scores.json"):
            self.send_error(404, "Not found")
            return

        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0 or length > 4096:
            self.send_error(400, "Bad request")
            return

        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_error(400, "Invalid JSON")
            return

        name = sanitize_name(str(payload.get("name", "")))
        try:
            ms = int(payload.get("ms"))
        except (TypeError, ValueError):
            ms = None

        if name is None or ms is None or ms < 0 or ms > 600_000:
            self.send_error(400, "Invalid score")
            return

        data = load_scores()
        entry = {
            "name": name,
            "ms": ms,
            "delta": ms - TARGET_MS,
            "at": payload.get("at")
            if isinstance(payload.get("at"), str)
            else __import__("datetime").datetime.now(
                __import__("datetime").timezone.utc
            ).isoformat(),
        }

        # Keep each player's closest attempt; otherwise append.
        scores = data["scores"]
        existing_idx = next(
            (i for i, s in enumerate(scores) if s.get("name") == name),
            None,
        )
        if existing_idx is None:
            scores.append(entry)
        else:
            if rank_key(entry) < rank_key(scores[existing_idx]):
                scores[existing_idx] = entry

        scores.sort(key=rank_key)
        data["scores"] = scores[:MAX_SCORES]
        save_scores(data)

        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        print(f"[server] {self.address_string()} - {fmt % args}")


def main() -> None:
    if not SCORES_PATH.exists():
        save_scores({"scores": []})
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"Get to 30 seconds → http://{HOST}:{PORT}/")
    print(f"Scores file → {SCORES_PATH}")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
