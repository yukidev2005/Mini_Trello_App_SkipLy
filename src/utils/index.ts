import crypto from 'crypto'
export const generateOtp = (): string => crypto.randomInt(100000, 1000000).toString()
