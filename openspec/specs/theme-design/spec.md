# Theme and Design System

## Purpose

Consistent visual design with dark mode (default) and light mode support, using CSS custom properties integrated with Tailwind CSS 4.

## Requirements

### Requirement: Dark and Light Mode

The app SHALL support dark mode (default) and light mode toggled via next-themes.

#### Scenario: Dark mode (default)

- **WHEN** the app loads with no user preference
- **THEN** use dark theme: `--bg: #0b0b0b`, `--text: #f2ede6`, `--red: #ff4422`

#### Scenario: Light mode

- **WHEN** the user toggles to light mode
- **THEN** apply `.light` class to `<html>`: `--bg: #ffffff`, `--text: #1a1a1a`, `--red: #e63b1a`

#### Scenario: Theme toggle

- **WHEN** the user clicks the theme toggle button
- **THEN** switch between dark and light themes
- **AND** persist the preference via next-themes

### Requirement: Typography

The app SHALL use three Google Fonts for distinct typographic roles.

#### Scenario: Font usage

- **WHEN** rendering text
- **THEN** use:
  - **Unbounded** (`--font-display`) for headings and display text
  - **Lora** (`--font-serif`) for italic accents and serif touches
  - **Figtree** (`--font-body`) for body text (default)

### Requirement: Color System

The design system SHALL use CSS custom properties exposed via Tailwind's `@theme inline`.

#### Scenario: Tailwind integration

- **WHEN** using Tailwind classes
- **THEN** custom colors SHALL be available as `bg-bg`, `bg-bg2`, `bg-bg3`, `text-foreground`, `text-muted`, `text-red`, `bg-red-dim`, `bg-red-glow`
- **AND** custom fonts as `font-display`, `font-serif`, `font-body`

### Requirement: Score Color Coding

Match scores SHALL use consistent color coding across all components.

#### Scenario: Score colors

- **WHEN** displaying a match score
- **THEN** use red for scores below 50, amber for 50-75, green for 75 and above
