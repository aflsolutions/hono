import { parseAuthorization, TOKEN68_REGEXP } from './authorization'
import { base64Decode } from './encode'

const USER_PASS_REGEXP = /^([^:]*):(.*)$/
const utf8Decoder = new TextDecoder()

export type Auth = (req: Request) => { username: string; password: string } | undefined

export const auth: Auth = (req: Request) => {
  const authorization = parseAuthorization(req.headers.get('Authorization'), { separator: / +/ })
  if (
    !authorization ||
    authorization.scheme.toLowerCase() !== 'basic' ||
    !TOKEN68_REGEXP.test(authorization.credentials)
  ) {
    return undefined
  }

  let userPass = undefined
  // If an invalid string is passed to atob(), it throws a `DOMException`.
  try {
    userPass = USER_PASS_REGEXP.exec(utf8Decoder.decode(base64Decode(authorization.credentials)))
  } catch {} // Do nothing

  if (!userPass) {
    return undefined
  }

  return { username: userPass[1], password: userPass[2] }
}
