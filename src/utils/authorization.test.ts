import { parseAuthorization } from './authorization'

describe('parseAuthorization', () => {
  it.each([null, undefined, '', 'Bearer', ' Bearer token'])('rejects %j', (header) => {
    expect(parseAuthorization(header)).toBeUndefined()
  })

  it.each([' ', '   ', '\t', ' \t', '\u00a0'])(
    'parses schemes without changing credential case with separator %j',
    (separator) => {
      expect(parseAuthorization(`bEaReR${separator}Token`)).toEqual({
        scheme: 'bEaReR',
        credentials: 'Token',
      })
    }
  )

  it('leaves credential validation to the caller', () => {
    expect(parseAuthorization('Digest username="someone", realm="example"')).toEqual({
      scheme: 'Digest',
      credentials: 'username="someone", realm="example"',
    })
    expect(parseAuthorization('Bearer ')).toEqual({ scheme: 'Bearer', credentials: '' })
  })

  it('supports literal prefixes containing spaces and metacharacters', () => {
    expect(parseAuthorization('bearer (v2) Token', { prefix: 'Bearer (v2)' })).toEqual({
      scheme: 'bearer (v2)',
      credentials: 'Token',
    })
    expect(parseAuthorization('XZY Token', { prefix: 'X.Y' })).toBeUndefined()
    expect(parseAuthorization('BearerSuffix Token', { prefix: 'Bearer' })).toBeUndefined()
  })

  it('supports headers without a prefix', () => {
    expect(parseAuthorization('Token', { prefix: '' })).toEqual({
      scheme: '',
      credentials: 'Token',
    })
  })

  it('allows callers to restrict separators', () => {
    expect(parseAuthorization('Basic\tToken', { separator: / +/ })).toBeUndefined()
    expect(parseAuthorization('Basic  Token', { separator: / +/ })).toEqual({
      scheme: 'Basic',
      credentials: 'Token',
    })
  })
})
