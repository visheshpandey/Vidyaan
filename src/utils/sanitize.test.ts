import { describe, expect, it } from 'vitest'
import {
  isIsoDate,
  isSafeHttpUrl,
  sanitizeMultiline,
  sanitizeSearch,
  sanitizeText,
  TEXT_LIMITS,
} from './sanitize'

describe('R6.2 sanitizeText', () => {
  it('trims and collapses whitespace, including line breaks', () => {
    expect(sanitizeText('  Priya \n  Sharma\t ', 60)).toBe('Priya Sharma')
  })
  it('strips control characters', () => {
    expect(sanitizeText('Pri\u0000ya\u0007\u007F', 60)).toBe('Priya')
  })
  it('strips zero-width and bidi override characters', () => {
    expect(sanitizeText('Pri​ya‮ evil⁦', 60)).toBe('Priya evil')
    expect(sanitizeText('﻿name', 60)).toBe('name')
  })
  it('caps the length after cleaning', () => {
    expect(sanitizeText('a'.repeat(500), TEXT_LIMITS.name)).toHaveLength(TEXT_LIMITS.name)
  })
  it('leaves markup as plain text (React escapes it on render)', () => {
    expect(sanitizeText('<img src=x onerror=alert(1)>', 60)).toBe('<img src=x onerror=alert(1)>')
  })
  it('returns an empty string for whitespace only', () => {
    expect(sanitizeText(' \n\t ', 60)).toBe('')
  })
})

describe('R6.2 sanitizeMultiline', () => {
  it('keeps line breaks and normalises line endings', () => {
    expect(sanitizeMultiline('a\r\nb\rc', 100)).toBe('a\nb\nc')
  })
  it('does not eat spaces or line breaks the user is still typing', () => {
    expect(sanitizeMultiline('hello ', 100)).toBe('hello ')
    expect(sanitizeMultiline('line one\n\n\n', 100)).toBe('line one\n\n\n')
  })
  it('turns tabs into spaces', () => {
    expect(sanitizeMultiline('a\tb', 100)).toBe('a b')
  })
  it('strips unsafe characters', () => {
    expect(sanitizeMultiline('no\u0000te‮', 100)).toBe('note')
  })
  it('caps the length', () => {
    expect(sanitizeMultiline('x'.repeat(5000), 1000)).toHaveLength(1000)
  })
})

describe('R6.2 R1.1 sanitizeSearch', () => {
  it('caps at 100 characters and flattens to one line', () => {
    expect(sanitizeSearch('a'.repeat(300))).toHaveLength(100)
    expect(sanitizeSearch('aicte\nscholarship')).toBe('aicte scholarship')
  })
})

describe('R6.2 isSafeHttpUrl', () => {
  it('accepts http and https URLs with a host', () => {
    expect(isSafeHttpUrl('https://scholarships.gov.in/')).toBe(true)
    expect(isSafeHttpUrl('http://example.org/path?q=1')).toBe(true)
  })
  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'blob:https://example.org/abc',
    '//example.org',
    '/relative/path',
    'not a url',
    '',
  ])('rejects %s', (value) => {
    expect(isSafeHttpUrl(value)).toBe(false)
  })
})

describe('R6.2 isIsoDate', () => {
  it('accepts real dates only', () => {
    expect(isIsoDate('2026-11-07')).toBe(true)
    expect(isIsoDate('2026-02-30')).toBe(false)
    expect(isIsoDate('07-11-2026')).toBe(false)
    expect(isIsoDate('2026-11-07T10:00:00Z')).toBe(false)
    expect(isIsoDate('')).toBe(false)
  })
})
