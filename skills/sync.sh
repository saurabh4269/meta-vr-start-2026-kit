#!/usr/bin/env bash
# Copy the canonical skills in meta-vr/skills/ into every project's .claude/skills/.
# Edit skills only here, never in a project copy; then run:  bash skills/sync.sh
# Idempotent: rsync -a --delete makes each copy identical; diff -rq then confirms it.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS="$(dirname "$HERE")"
SKILLS=(quest-hands-first-webxr quest-mr-tutor quest-mr-game)
PROJECTS=(hands-of-a-master chausar repo-city giants-and-hiders flyby-chair sadak-vr)

command -v rsync >/dev/null || { echo "rsync not found" >&2; exit 1; }

ok=0; bad=0; changed=0; skipped=0
for p in "${PROJECTS[@]}"; do
  if [ ! -d "$WS/$p" ]; then
    echo "skip  $p (no such project)"; skipped=$((skipped + 1)); continue
  fi
  dest="$WS/$p/.claude/skills"
  mkdir -p "$dest"
  for s in "${SKILLS[@]}"; do
    n=$(rsync -a --delete --exclude '__pycache__' --itemize-changes "$HERE/$s/" "$dest/$s/" | wc -l)
    if diff -rq --exclude '__pycache__' "$HERE/$s" "$dest/$s" >/dev/null; then
      ok=$((ok + 1))
      [ "$n" -gt 0 ] && { changed=$((changed + 1)); echo "sync  $p/.claude/skills/$s ($n changes)"; } \
                     || echo "same  $p/.claude/skills/$s"
    else
      bad=$((bad + 1)); echo "DIFF  $p/.claude/skills/$s"
    fi
  done
done
echo "summary: ${#SKILLS[@]} skills x ${#PROJECTS[@]} projects: $ok identical ($changed updated), $bad differ, $skipped projects missing"
[ "$bad" -eq 0 ]
