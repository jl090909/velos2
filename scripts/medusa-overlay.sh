#!/usr/bin/env bash
# Overlay VelosShield-owned Medusa integration files from this repo (velos2) into a
# Medusa backend checkout. Does NOT copy the whole upstream starter, .git, or node_modules.
#
# Usage:
#   scripts/medusa-overlay.sh --source /path/to/velos2 --target /path/to/commerce-upstream
# Defaults: source = repo root of this script; target = /home/administrator/velosshield-commerce-poc/commerce-upstream
set -euo pipefail

SOURCE="${VELos_SOURCE:-}"
TARGET=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --source) SOURCE="$2"; shift 2 ;;
    --target) TARGET="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "$SOURCE" ]]; then
  SOURCE="$(cd "$(dirname "$0")/.." && pwd)"
fi
if [[ -z "$TARGET" ]]; then
  TARGET="/home/administrator/velosshield-commerce-poc/commerce-upstream"
fi

MANIFEST="$SOURCE/integrations/medusa/manifest.json"
if [[ ! -f "$MANIFEST" ]]; then
  echo "Manifest not found: $MANIFEST" >&2
  exit 1
fi

OVERLAY_SRC="$SOURCE/integrations/medusa/backend"
TARGET_ROOT="$TARGET/apps/backend"

if [[ ! -d "$TARGET_ROOT" ]]; then
  echo "Target backend dir not found: $TARGET_ROOT" >&2
  exit 1
fi

# Copy each tracked overlay file with checksum validation.
copy_one() {
  local rel="$1"
  local src="$OVERLAY_SRC/$rel"
  local dst="$TARGET_ROOT/$rel"
  if [[ ! -f "$src" ]]; then
    echo "Missing source file: $src" >&2
    exit 1
  fi
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
  echo "Overlayed: $rel"
}

copy_one "src/subscribers/order-placed-email.ts"
copy_one "src/subscribers/__tests__/order-placed-email.unit.spec.ts"

# Checksum validation against manifest expected values.
python3 - "$MANIFEST" "$OVERLAY_SRC" "$TARGET_ROOT" <<'PY'
import hashlib, json, sys, os
manifest_path, src_root, tgt_root = sys.argv[1], sys.argv[2], sys.argv[3]
m = json.load(open(manifest_path))
for f in m["overlay"]["files"]:
    rel = f["source"]
    for base in (src_root, tgt_root):
        # map source rel to target rel (same relative path under backend)
        pass
    # validate source
    for label, root, relpath in (("source", src_root, f["source"]), ("target", tgt_root, f["target"])):
        p = os.path.join(root, relpath)
        h = hashlib.sha256(open(p, "rb").read()).hexdigest()
        if h != f["sha256"]:
            print(f"CHECKSUM MISMATCH ({label}) {relpath}: {h} != {f['sha256']}", file=sys.stderr)
            sys.exit(1)
print("Checksum validation: OK (all overlay files)")
PY

echo "Overlay complete. Target: $TARGET_ROOT"
echo "Run Medusa unit tests: cd $TARGET && pnpm --filter @dtc/backend test:unit"
