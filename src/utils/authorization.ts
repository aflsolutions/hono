export const TOKEN68_REGEXP = /^[A-Za-z0-9._~+/-]+=*$/

/**
 * Splits a header without validating its credentials. Callers choose the separator
 * to preserve their whitespace rules; a literal prefix may itself contain spaces.
 */
export const parseAuthorization = (
  header: string | null | undefined,
  { prefix, separator = /\s+/ }: { prefix?: string; separator?: RegExp } = {}
): { scheme: string; credentials: string } | undefined => {
  if (!header) {
    return undefined
  }
  if (prefix === '') {
    return { scheme: '', credentials: header }
  }

  const offset = prefix?.length ?? 0
  const match = separator.exec(header.slice(offset))
  if (!match || (prefix !== undefined && match.index !== 0)) {
    return undefined
  }

  const scheme = header.slice(0, offset + match.index)
  if (!scheme || (prefix !== undefined && scheme.toLowerCase() !== prefix.toLowerCase())) {
    return undefined
  }

  return {
    scheme,
    credentials: header.slice(offset + match.index + match[0].length),
  }
}
