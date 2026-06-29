import type { ChartSeriesInput } from './types'

export const MAX_DATES = 30

export type ValidationErrorKind =
  | 'too_many_dates'
  | 'no_data'
  | 'length_mismatch'
  | 'date_mismatch'
  | 'invalid_date'
  | 'invalid_value'

export type ValidationError = {
  kind: ValidationErrorKind
  title: string
  message: string
  hint: string
}

export type ValidationResult = { ok: true } | ({ ok: false } & ValidationError)

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const isValidIsoDate = (s: string): boolean => {
  if (!ISO_DATE_RE.test(s)) return false
  const ts = Date.parse(s)
  if (Number.isNaN(ts)) return false
  // Round-trip: reject things like 2026-02-31 that Date.parse may coerce
  const round = new Date(ts).toISOString().slice(0, 10)
  return round === s
}

const fail = (
  kind: ValidationErrorKind,
  title: string,
  message: string,
  hint: string
): ValidationResult => ({ ok: false, kind, title, message, hint })

export const validateChartInputs = (
  area: ChartSeriesInput,
  bar: ChartSeriesInput,
  spline: ChartSeriesInput,
  line: ChartSeriesInput
): ValidationResult => {
  const slots: Array<{ slot: string; series: ChartSeriesInput }> = [
    { slot: 'area', series: area },
    { slot: 'bar', series: bar },
    { slot: 'spline', series: spline },
    { slot: 'line', series: line },
  ]

  // 1. too_many_dates
  if (area.data.length > MAX_DATES) {
    return fail(
      'too_many_dates',
      'Too many dates',
      `You passed ${area.data.length} dates.`,
      `This version supports up to ${MAX_DATES} dates per series — please reduce the input.`
    )
  }

  // 2. no_data
  if (area.data.length === 0) {
    return fail(
      'no_data',
      'No data provided',
      'The series are empty.',
      'Each series must contain at least one `{ date, value }` point.'
    )
  }

  // 3. length_mismatch (against area)
  for (const { slot, series } of slots) {
    if (slot === 'area') continue
    if (series.data.length !== area.data.length) {
      return fail(
        'length_mismatch',
        'Series lengths differ',
        `"${series.label}" has ${series.data.length} points, but "${area.label}" has ${area.data.length}.`,
        'All four series must contain the same number of points.'
      )
    }
  }

  // 4. date_mismatch (against area, index by index)
  for (const { slot, series } of slots) {
    if (slot === 'area') continue
    for (let i = 0; i < area.data.length; i++) {
      if (series.data[i].date !== area.data[i].date) {
        return fail(
          'date_mismatch',
          "Dates don't match",
          `"${series.label}" has "${series.data[i].date}" at index ${i}, but "${area.label}" has "${area.data[i].date}".`,
          'All four series must share the same dates in the same order.'
        )
      }
    }
  }

  // 5. invalid_date
  for (const { series } of slots) {
    for (let i = 0; i < series.data.length; i++) {
      const d = series.data[i].date
      if (!isValidIsoDate(d)) {
        return fail(
          'invalid_date',
          'Invalid date',
          `"${series.label}" has "${d}" at index ${i} — not a valid ISO date.`,
          'Use the `YYYY-MM-DD` format with real calendar dates.'
        )
      }
    }
  }

  // 6. invalid_value
  for (const { series } of slots) {
    for (let i = 0; i < series.data.length; i++) {
      const v = series.data[i].value
      if (!Number.isFinite(v)) {
        return fail(
          'invalid_value',
          'Invalid value',
          `"${series.label}" has a non-finite value (\`${v}\`) at index ${i}.`,
          'Every `value` must be a finite number.'
        )
      }
    }
  }

  return { ok: true }
}
