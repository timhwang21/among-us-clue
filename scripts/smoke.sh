#!/bin/bash
# PostToolUse hook: runs e2e smoke test when index.html or src/ files change.
# Receives tool input JSON on stdin.

input=$(cat)
file=$(echo "$input" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null)

case "$file" in
  *index.html|*/src/*.js)
    cd "$(dirname "$0")/.."
    echo "🔍 Smoke testing game load after edit to $(basename "$file")..."
    result=$(npx playwright test --grep "no console errors" 2>&1)
    if echo "$result" | grep -qE "1 passed|1 flaky"; then
      echo "✅ Smoke test passed — startGame accessible, no JS errors"
    else
      echo "❌ Smoke test FAILED"
      echo "$result" | tail -20
      exit 1
    fi
    ;;
esac
