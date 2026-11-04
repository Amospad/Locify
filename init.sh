
#!/bin/bash
set -e

echo "=== LOCIFY Environment Initialization ==="
echo "Profile: brownfield"
echo "Flow: standard"
echo "Language: en"
echo "Current spec: 005-auth-kyb"
echo

# Check Node.js
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js: $NODE_VERSION"
else
    echo "✗ Node.js not found"
    exit 1
fi

# Check pnpm
if command -v pnpm >/dev/null 2>&1; then
    PNPM_VERSION=$(pnpm --version)
    echo "✓ pnpm: $PNPM_VERSION"
else
    echo "✗ pnpm not found"
    exit 1
fi

# Check TypeScript
if command -v tsc >/dev/null 2>&1; then
    echo "✓ TypeScript compiler found"
else
    echo "✗ TypeScript compiler not found"
    exit 1
fi

# Check git
if command -v git >/dev/null 2>&1; then
    GIT_VERSION=$(git --version)
    echo "✓ Git: $GIT_VERSION"
else
    echo "✗ Git not found"
    exit 1
fi

# Run verification script
if [ -f ".harness/scripts/ps/verify.sh" ]; then
    echo "Running verification script..."
    ./.harness/scripts/ps/verify.sh
else
    echo "✗ Verification script not found"
    exit 1
fi

echo
echo "=============================
LOCIFY Environment Green - Ready for development
============================="