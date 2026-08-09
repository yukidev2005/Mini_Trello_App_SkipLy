type HttpError = Error & { statusCode: number }

export const createHttpError = (message: string, statusCode: number): HttpError => {
  const error = new Error(message) as HttpError
  error.statusCode = statusCode
  return error
}
