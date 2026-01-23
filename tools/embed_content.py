#!/usr/bin/env python3
"""
Embed data/content.json into index.html so content renders immediately.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CONTENT_PATH = ROOT / "data" / "content.json"
INDEX_PATH = ROOT / "index.html"

SCRIPT_PATTERN = re.compile(
    r'(<script\b[^>]*\bid=["\']content-data["\'][^>]*\btype=["\']application/json["\'][^>]*>)'
    r'(.*?)'
    r'(</script>)',
    re.IGNORECASE | re.DOTALL,
)

SCRIPT_INCLUDE_PATTERN = re.compile(
    r'^[ \t]*<script\s+src=["\']assets/js/script\.js["\']></script>\s*$',
    re.IGNORECASE | re.MULTILINE,
)


def load_content_text() -> str:
    content_text = CONTENT_PATH.read_text(encoding="utf-8")
    json.loads(content_text)
    return content_text.rstrip("\n")


def indent_lines(text: str, prefix: str) -> str:
    lines = text.splitlines()
    return "\n".join(prefix + line if line else prefix for line in lines)


def build_block(indent: str, content_text: str) -> str:
    indented_content = indent_lines(content_text, indent)
    return (
        f'{indent}<script id="content-data" type="application/json">\n'
        f"{indented_content}\n"
        f"{indent}</script>"
    )


def embed_content(html: str, content_text: str) -> tuple[str, bool]:
    match = SCRIPT_PATTERN.search(html)
    if match:
        line_start = html.rfind("\n", 0, match.start(1)) + 1
        indent = re.match(r"[ \t]*", html[line_start:match.start(1)]).group(0)
        block = (
            f"{match.group(1)}\n"
            f"{indent_lines(content_text, indent)}\n"
            f"{indent}{match.group(3)}"
        )
        new_html = html[: match.start(1)] + block + html[match.end(3) :]
        return new_html, True

    include_match = SCRIPT_INCLUDE_PATTERN.search(html)
    if include_match:
        indent = re.match(r"[ \t]*", include_match.group(0)).group(0)
        block = build_block(indent, content_text)
        insert_at = include_match.start(0)
        new_html = html[:insert_at] + block + "\n\n" + html[insert_at:]
        return new_html, True

    body_end = html.lower().rfind("</body>")
    if body_end != -1:
        block = build_block("  ", content_text)
        new_html = html[:body_end] + block + "\n" + html[body_end:]
        return new_html, True

    return html, False


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Embed data/content.json into index.html.",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Exit with non-zero status if index.html is out of date.",
    )
    args = parser.parse_args()

    content_text = load_content_text()
    html = INDEX_PATH.read_text(encoding="utf-8")
    new_html, updated = embed_content(html, content_text)

    if not updated:
        print("Could not find a place to embed content-data.", file=sys.stderr)
        return 2

    if new_html == html:
        return 0

    if args.check:
        print("index.html is out of date. Run tools/embed_content.py to update.", file=sys.stderr)
        return 1

    INDEX_PATH.write_text(new_html, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
