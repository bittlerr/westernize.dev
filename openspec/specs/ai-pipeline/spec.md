# AI Pipeline

## Purpose

The AI pipeline is the core product feature. It takes a CV and job description as input, runs 4 Claude API calls to parse, analyze, and rewrite CV bullet points for Western tech hiring culture, and streams results to the client via SSE.

## Requirements

### Requirement: Four-Step Pipeline Execution

The pipeline SHALL execute 4 sequential Claude API calls with steps 1 and 2 running in parallel.

#### Scenario: Successful full pipeline run

- **WHEN** a user submits a CV and job description to `POST /api/optimize`
- **THEN** the pipeline SHALL execute:
  1. Parse CV into structured JSON (`CvParsedSchema`) — parallel with step 2
  2. Parse JD into structured JSON (`JdParsedSchema`) — parallel with step 1
  3. Gap analysis comparing CV against JD (`GapAnalysisSchema`)
  4. Rewrite CV bullet points (`RewritesSchema`)
- **AND** steps 1 and 2 SHALL run via `Promise.all`
- **AND** steps 3 and 4 SHALL run sequentially after steps 1 and 2 complete

### Requirement: Structured Output via Zod Schemas

All pipeline steps SHALL use Zod schemas with `zodOutputFormat` for type-safe structured output.

#### Scenario: Claude returns structured output

- **WHEN** calling Claude for any pipeline step
- **THEN** use `claude.messages.parse()` with `output_config: { format: zodOutputFormat(schema) }`
- **AND** the SDK SHALL validate the response against the Zod schema locally
- **AND** return typed `parsed_output`

#### Scenario: CV parsing schema

- **WHEN** parsing a CV (step 1)
- **THEN** output SHALL conform to `CvParsedSchema`: name, email, summary, skills[], experience[{title, company, dates, bullets[]}], education[{degree, school, year}]

#### Scenario: JD parsing schema

- **WHEN** parsing a job description (step 2)
- **THEN** output SHALL conform to `JdParsedSchema`: role, company, required_skills[], preferred_skills[], keywords[], seniority_level, location_type

#### Scenario: Gap analysis schema

- **WHEN** analyzing gaps (step 3)
- **THEN** output SHALL conform to `GapAnalysisSchema`: match_score (0-100), missing_keywords[], missing_skills[], weak_bullets[], strengths[], summary

#### Scenario: Rewrite schema

- **WHEN** rewriting bullets (step 4)
- **THEN** output SHALL conform to `RewritesSchema`: rewrites[{original, rewritten}]

### Requirement: SSE Streaming Progress

The pipeline SHALL stream step-by-step progress to the client via Server-Sent Events.

#### Scenario: Streaming progress events

- **WHEN** the pipeline is executing
- **THEN** send SSE events for each step transition:
  - `{"step":"parsing","message":"Parsing CV and job description..."}`
  - `{"step":"analyzing","message":"Analyzing gaps..."}`
  - `{"step":"rewriting","message":"Rewriting bullet points..."}`
  - `{"step":"done","result":{...}}` on completion
  - `{"step":"error","failedStep":"...","message":"...","partialResult":{...}|null}` on failure

#### Scenario: Response headers

- **WHEN** returning the SSE stream
- **THEN** set `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`

### Requirement: Retry Logic

Each pipeline step SHALL retry up to 3 times with exponential backoff on transient errors.

#### Scenario: Transient error retry

- **WHEN** a Claude API call fails with a retryable error (429, 529, 5xx)
- **THEN** retry up to 3 times with delays of 1s, 2s, 3s (exponential backoff)

#### Scenario: Non-retryable error

- **WHEN** a Claude API call fails with 400, 401, 403, or 404
- **THEN** fail immediately without retrying

### Requirement: Partial Results on Failure

The pipeline SHALL return partial results when a step fails after retries.

#### Scenario: Failure after parsing succeeds

- **WHEN** steps 1 and 2 succeed but step 3 or 4 fails
- **THEN** send an error SSE event with `partialResult` containing `cvParsed` and `jdParsed`
- **AND** if step 3 succeeded, also include `gapAnalysis` and `matchScore`

#### Scenario: Failure during parsing

- **WHEN** step 1 or 2 fails
- **THEN** send an error SSE event with `partialResult: null`

### Requirement: Credit Deduction on Success Only

Credits SHALL only be deducted after the pipeline completes successfully.

#### Scenario: Successful completion

- **WHEN** all 4 steps complete successfully
- **THEN** deduct one credit from the user
- **AND** set optimization status to "done"

#### Scenario: Pipeline failure

- **WHEN** any step fails after all retries
- **THEN** do NOT deduct a credit
- **AND** set optimization status to "error"

### Requirement: Token Usage Tracking

The pipeline SHALL track cumulative token usage across all steps.

#### Scenario: Tracking tokens

- **WHEN** the pipeline completes (success or failure)
- **THEN** sum `input_tokens` and `output_tokens` from all completed steps
- **AND** store in the optimization's `tokenUsage` column as `{ input, output }`

### Requirement: PDF Input Support

The pipeline SHALL accept PDF input as base64-encoded data.

#### Scenario: PDF CV input

- **WHEN** the request includes `pdfBase64`
- **THEN** send it to Claude as an inline document content block with `type: "document"` and `source.type: "base64"`
- **AND** use `media_type: "application/pdf"`

### Requirement: Database Status Tracking

The pipeline SHALL update the optimization's status in the database at each step.

#### Scenario: Status progression

- **WHEN** the pipeline executes
- **THEN** update the optimization status through: `pending` → `parsing` → `analyzing` → `rewriting` → `done`
- **AND** store intermediate results (`cvParsed`, `jdParsed`, `gapAnalysis`, `rewrites`) as each step completes

### Requirement: Pre-Pipeline Validation

The pipeline SHALL validate auth, rate limits, and credits before starting.

#### Scenario: Unauthorized request

- **WHEN** the request has no valid session
- **THEN** return 401

#### Scenario: Rate limited

- **WHEN** the user exceeds their rate limit
- **THEN** return 429

#### Scenario: No credits

- **WHEN** the user has no credits remaining and is not lifetime
- **THEN** return 402

#### Scenario: Missing input

- **WHEN** `cvText` or `jdText` is empty
- **THEN** return 400
