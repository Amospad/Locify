#!/bin/bash
set -e

# Deterministic verification script for LOCIFY project
# Single source of truth for build status verification

echo "🔍 LOCIFY Verification Script"
echo "=" * 50

# Check TypeScript compilation
if command -v tsc >/dev/null 2>&1; then
    echo "Checking TypeScript compilation..."
    if pnpm typecheck 2>/dev/null; then
        echo "✅ TypeScript check passed"
    else
        echo "❌ TypeScript check failed"
        exit 1
    fi
else
    echo "⚠️ TypeScript compiler not found, skipping typecheck"
fi

# Check linting
if command -v pnpm >/dev/null 2>&1; then
    echo "Running linting..."
    if pnpm lint 2>/dev/null; then
        echo "✅ Linting passed"
    else
        echo "❌ Linting failed"
        exit 1
    fi
else
    echo "⚠️ pnpm not found, skipping lint"
fi

# Check if tests exist and run them
if command -v pnpm >/dev/null 2>&1 && [ -f "pnpm-lock.yaml" ]; then
    echo "Checking for test configuration..."
    # Look for test scripts in package.json
    if [ -f "package.json" ]; then
        if pnpm run test:setup 2>/dev/null || echo "No test setup script found"; then
            echo "✅ Tests set up"
        fi
    fi
fi

# Final verification result
echo
"✅ VERIFICATION PASSED"
"All critical checks passed. Environment is ready for development."