#!/usr/bin/env bash
# Make the Manage and More brand skill available to Claude Code in every project.
# Usage: scripts/install-skill.sh [target-skills-dir]   (default: ~/.claude/skills)
set -euo pipefail
REPO="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-$HOME/.claude/skills}"
mkdir -p "$TARGET"
ln -sfn "$REPO/skills/manage-and-more-brand" "$TARGET/manage-and-more-brand"
echo "Linked $TARGET/manage-and-more-brand -> $REPO/skills/manage-and-more-brand"
echo "Tip: export MM_DESIGN_SYSTEM=\"$REPO\" in your shell profile so the skill finds the assets."
