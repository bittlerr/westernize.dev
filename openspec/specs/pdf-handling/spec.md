# PDF Handling

## Purpose

Validate uploaded PDF files locally before sending to Claude for extraction. Enforce size and page limits based on user tier.

## Requirements

### Requirement: PDF Validation

The system SHALL validate PDF files before processing.

#### Scenario: Valid PDF magic bytes

- **WHEN** a file is uploaded
- **THEN** check that it starts with `%PDF` magic bytes
- **AND** reject files that are not valid PDFs

#### Scenario: Free tier limits

- **WHEN** a free user uploads a PDF
- **THEN** enforce max 5MB file size and max 5 pages
- **AND** return a clear error message if exceeded

#### Scenario: Paid tier limits

- **WHEN** a paid or lifetime user uploads a PDF
- **THEN** enforce max 10MB file size and max 7 pages

### Requirement: PDF Upload Endpoint

The parse-pdf endpoint SHALL accept multipart form data and return base64-encoded PDF.

#### Scenario: Successful upload

- **WHEN** a valid PDF is uploaded to `POST /api/parse-pdf`
- **THEN** validate the PDF using `lib/pdf.ts`
- **AND** return `{ base64: string, pageCount: number }`
- **AND** the client SHALL pass `pdfBase64` to `/api/optimize`

#### Scenario: Invalid PDF

- **WHEN** validation fails
- **THEN** return an error with the specific reason (too large, too many pages, not a PDF)
