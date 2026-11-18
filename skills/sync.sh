#!/usr/bin/env bash
# Copy the canonical skills in skills/ into every project's .claude/skills/.
# Add a new project by appending its folder name to PROJECTS below.
# Edit skills only here, never in a project copy; then run:  bash skills/sync.sh
# Idempotent: rsync -a --delete makes each copy identical; diff -rq then confirms it.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WS="$(dirname "$HERE")"
SKILLS=(quest-hands-first-webxr quest-mr-tutor quest-mr-game)
PROJECTS=(hands-of-a-master ink-and-ivory chausar repo-city giants-and-hiders flyby-chair sadak-vr)
# Genre add-ons a project does not use (its repo stays about that project only).
declare -A SKIP=([chausar]="quest-mr-tutor")

command -v rsync >/dev/null || { echo "rsync not found" >&2; exit 1; }

ok=0; bad=0; changed=0; skipped=0
for p in "${PROJECTS[@]}"; do
  # Projects sit next to skills/ (local workspace) or under projects/ (the kit repo).
  if [ -d "$WS/$p" ]; then dir="$WS/$p"
  elif [ -d "$WS/projects/$p" ]; then dir="$WS/projects/$p"
  else
    echo "skip  $p (no such project)"; skipped=$((skipped + 1)); continue
  fi
  dest="$dir/.claude/skills"
  mkdir -p "$dest"
  for s in "${SKILLS[@]}"; do
    case " ${SKIP[$p]:-} " in *" $s "*)
      rm -rf "${dest:?}/$s"; echo "skip  $p/.claude/skills/$s (not used by $p)"; continue ;;
    esac
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
