export const gradeConfig: Record<number, { label: string; className: string }> = {
  1: { label: '1', className: 'bg-emerald-100 text-emerald-800' },
  2: { label: '2', className: 'bg-green-100 text-green-800' },
  3: { label: '3', className: 'bg-yellow-100 text-yellow-800' },
  4: { label: '4', className: 'bg-orange-100 text-orange-800' },
  5: { label: '5', className: 'bg-red-100 text-red-800' },
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    return new Intl.DateTimeFormat('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  if (!dateStr) return '-'
  try {
    return new Intl.DateTimeFormat('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function toDateInputValue(dateStr: string): string {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

export function toDateTimeInputValue(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
