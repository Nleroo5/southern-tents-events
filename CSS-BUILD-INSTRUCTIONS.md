# CSS Build Instructions

## IMPORTANT: How CSS Files Work

The website uses **three separate CSS files**:

1. **`css/variables.css`** - Contains all `:root` CSS custom properties (colors, fonts, spacing, etc.)
2. **`css/main.css`** - Contains all styling rules that use those variables
3. **`css/styles.min.css`** - The combined file that the website actually loads

## How to Update Styles

### Option 1: Edit main.css only (SAFEST)
If you only need to change styling rules (not variables):

1. Edit `css/main.css`
2. Run: `./build-css.sh`
3. Done! The changes are now in `css/styles.min.css`

### Option 2: Edit variables.css
If you need to change colors, fonts, or other design tokens:

1. Edit `css/variables.css`
2. Run: `./build-css.sh`
3. Done!

## Build Script

The `build-css.sh` script safely combines the files:

```bash
./build-css.sh
```

This script:
- Combines `variables.css` + `main.css` → `styles.min.css`
- Preserves all CSS variables
- Does NOT minify (to avoid stripping variables)

## ⚠️ CRITICAL: Do NOT Use clean-css-cli

**NEVER run:**
```bash
npx clean-css-cli -o css/styles.min.css css/main.css  # ❌ BREAKS EVERYTHING
```

This command strips out `:root` variables and breaks the entire website!

## Quick Reference

```bash
# ✅ CORRECT: Safe build
./build-css.sh

# ✅ CORRECT: Manual build
cat css/variables.css css/main.css > css/styles.min.css

# ❌ WRONG: Breaks variables
npx clean-css-cli -o css/styles.min.css css/main.css
```

## Verify Build

After building, check that `:root` exists:

```bash
head -n 1 css/styles.min.css
# Should start with: :root{--color-primary:...
```

## What Each File Does

- **variables.css**: Design system tokens (189 lines)
- **main.css**: All styling rules (~2,300 lines)
- **styles.min.css**: Combined output loaded by HTML pages

The HTML loads only `styles.min.css`, so that file MUST contain both variables and rules!
