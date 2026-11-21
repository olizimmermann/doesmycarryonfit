#!/usr/bin/env python3
"""Write web/version.js with the short commit hash shown in the footer.

Run automatically by wrangler (build.command) before `wrangler dev` / `wrangler deploy`.
Source of the hash: WORKERS_CI_COMMIT_SHA (Cloudflare Workers Builds) or local git.
"""
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def commit_sha() -> str:
    sha = os.environ.get("WORKERS_CI_COMMIT_SHA", "")
    if not sha:
        try:
            sha = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                cwd=ROOT, capture_output=True, text=True, check=True, timeout=10,
            ).stdout.strip()
        except (OSError, subprocess.SubprocessError):
            return "dev"
    # Only hex goes into the generated JS, so the value cannot inject script.
    return sha[:7] if re.fullmatch(r"[0-9a-fA-F]{7,64}", sha) else "dev"


def main() -> None:
    sha = commit_sha()
    (ROOT / "web" / "version.js").write_text(f"window.APP_VERSION='{sha}';\n", encoding="utf-8")
    print(f"version.js -> {sha}")


if __name__ == "__main__":
    main()
