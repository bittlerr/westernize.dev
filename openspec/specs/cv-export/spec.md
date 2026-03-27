# CV Export

## Purpose

Generate downloadable DOCX files from optimized CV data with user-accepted bullet point rewrites.

## Requirements

### Requirement: DOCX Generation

The export endpoint SHALL generate a Word document from optimization results.

#### Scenario: Exporting accepted rewrites

- **WHEN** a user sends `POST /api/export` with `optimizationId`, `acceptedBullets[]`, and `cvParsed`
- **THEN** build a DOCX document with:
  - Name and email header
  - Summary section
  - Skills section
  - Experience sections with accepted rewritten bullets
  - Education section
- **AND** return the file as a binary download with `Content-Disposition: attachment`
- **AND** log audit event `cv.exported`

### Requirement: Authentication

The export endpoint SHALL require a valid session.

#### Scenario: Unauthorized export

- **WHEN** the request has no valid session
- **THEN** return 401
