#!/usr/bin/env bash
# Clone the official sample/tool repos listed in scripts/sample-repos.txt (shallow clones).
# Usage: scripts/clone-samples.sh [group ...] [--dest DIR]
#   groups: tools web unity unreal all   (default: tools web)
# Examples:
#   scripts/clone-samples.sh unity --dest ~/xr-samples
#   scripts/clone-samples.sh all
# Some Unity/Unreal samples use Git LFS; install git-lfs first (git lfs install) if a project has missing assets.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
list="$here/sample-repos.txt"
dest="${PWD}/samples"
groups=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dest) dest="$2"; shift 2 ;;
    -h|--help) sed -n '2,9p' "$0"; exit 0 ;;
    *) groups+=("$1"); shift ;;
  esac
done
[[ ${#groups[@]} -eq 0 ]] && groups=(tools web)
mkdir -p "$dest"
ok=0; skip=0; fail=0
while IFS=$'\t' read -r group url; do
  [[ -z "${group:-}" || "$group" == \#* ]] && continue
  want=0
  for g in "${groups[@]}"; do [[ "$g" == all || "$g" == "$group" ]] && want=1; done
  [[ $want -eq 1 ]] || continue
  name="$(basename "$url" .git)"
  target="$dest/$group/$name"
  if [[ -d "$target/.git" ]]; then echo "skip  $group/$name (exists)"; skip=$((skip+1)); continue; fi
  mkdir -p "$dest/$group"
  if git clone --depth 1 "$url" "$target"; then ok=$((ok+1)); else echo "FAIL  $url" >&2; fail=$((fail+1)); fi
done < "$list"
echo "cloned=$ok skipped=$skip failed=$fail -> $dest"
