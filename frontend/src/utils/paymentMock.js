const KEY = 'vecilend_paid_transactions'

function readSet() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed.map(Number) : [])
  } catch {
    return new Set()
  }
}

export function isPaid(id) {
  return readSet().has(Number(id))
}

export function markAsPaid(id) {
  const s = readSet()
  s.add(Number(id))
  localStorage.setItem(KEY, JSON.stringify([...s]))
}

export function getPaidIds() {
  return [...readSet()]
}