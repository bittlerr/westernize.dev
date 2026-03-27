# Landing Page

## Purpose

Marketing landing page that communicates the product value, demonstrates the before/after transformation, and drives signups. Converted from standalone HTML to Next.js.

## Requirements

### Requirement: Landing Page Sections

The landing page SHALL include all key marketing sections.

#### Scenario: Page structure

- **WHEN** a visitor loads the root `/` URL
- **THEN** display the following sections in order:
  1. **Navigation**: Logo, links (How it works, Pricing, Testimonials), theme toggle, login/signup CTAs
  2. **Hero**: Eyebrow text, 3-line headline ("YOUR CV. REBUILT. WESTERNIZED."), stamp graphic, value proposition, CTAs, country flags
  3. **Ticker**: Animated scrolling feature list
  4. **Before/After**: Side-by-side CV comparison with ATS match score bars (34% → 91%)
  5. **Problems**: 3 cards explaining why CVs fail (ATS filtering, passive voice, wrong market)
  6. **How it works**: 3-step process (Upload, Analyze, Download)
  7. **Metrics**: 3x callbacks, 91% score, <5m time, 12+ countries
  8. **Testimonials**: 3 developer success stories from Moldova, Romania, Ukraine
  9. **Pricing**: Credit-based tiers (Free/Starter/Hunt)
  10. **Final CTA**: "Your next job is one rewrite away"
  11. **Footer**: Logo, privacy/terms links, copyright

### Requirement: Credits-Based Pricing Display

The pricing section SHALL display the credits-based model.

#### Scenario: Pricing cards

- **WHEN** viewing the pricing section
- **THEN** display 3 tiers: Free ($0, 3 optimizations), Starter ($12, 5 optimizations), Hunt ($49, 50 optimizations)
- **AND** CTAs SHALL link to `/signup` with a `?pack` parameter

### Requirement: Responsive Design

The landing page SHALL be responsive across all device sizes.

#### Scenario: Mobile layout

- **WHEN** viewport width is below 800px
- **THEN** collapse multi-column grids to single column
- **AND** hide desktop navigation links
- **AND** maintain readable typography
