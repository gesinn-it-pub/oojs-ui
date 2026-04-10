#!/usr/bin/env bash
# check-theme-copies.sh
#
# Checks whether semanticcore managed copies of wikimediaui Less files have
# drifted from their upstream originals after a rebase.
#
# Background: layouts.less and tools.less in semanticcore/ are intentional
# copies of their wikimediaui/ counterparts (no SemanticCore changes). They
# cannot be replaced with cross-directory @import references because Less
# resolves nested @import 'common.less' calls relative to the importing file's
# directory — which would load wikimediaui/common.less and override SemanticCore
# variable values. The copies must therefore live in semanticcore/ so that
# @import 'common.less' resolves to semanticcore/common.less.
#
# Usage:
#   ./scripts/check-theme-copies.sh
#
# Returns exit code 1 if drift is detected. Each drifted file is shown with
# a diff against the upstream original.
#
# To sync a drifted file:
#   1. Copy the upstream version: cp src/themes/wikimediaui/${FILE}.less src/themes/semanticcore/${FILE}.less
#   2. Restore the header comment block (see the existing file for the template)

set -euo pipefail

UPSTREAM_DIR="src/themes/wikimediaui"
COPY_DIR="src/themes/semanticcore"
FILES=(layouts tools)
DIVERGED=0

for FILE in "${FILES[@]}"; do
    UPSTREAM="${UPSTREAM_DIR}/${FILE}.less"
    COPY="${COPY_DIR}/${FILE}.less"

    # Compare body of copy (everything from first @import onwards) to upstream.
    # This strips the header comment block we added to the semanticcore copies.
    UPSTREAM_BODY=$(cat "$UPSTREAM")
    COPY_BODY=$(sed -n '/^@import/,$p' "$COPY")

    if [ "$UPSTREAM_BODY" = "$COPY_BODY" ]; then
        echo "OK:      $COPY"
    else
        echo "DRIFTED: $COPY differs from $UPSTREAM"
        echo ""
        diff <(echo "$UPSTREAM_BODY") <(echo "$COPY_BODY") || true
        echo ""
        echo "  To fix: apply the diff above to $COPY (keep the header comment)."
        echo "  Or:     cp $UPSTREAM $COPY && prepend header comment manually."
        DIVERGED=1
    fi
done

if [ $DIVERGED -ne 0 ]; then
    echo "Drift detected. Update the copies before tagging."
    exit 1
fi

echo "All managed copies are in sync with upstream."
