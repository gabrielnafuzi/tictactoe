export const formatDate = (
  input: string | number | Date,
  options?: Intl.DateTimeFormatOptions | undefined
) => {
  const date = new Date(input)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour12: false,
    ...options,
  })
}
