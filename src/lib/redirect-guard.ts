export function isRedirectError(err: unknown): boolean {
  return !!(err instanceof Error && (err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT'))
}
