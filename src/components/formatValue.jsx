export default function formatValue(value, label) {
  return value ? { value: value, label: value } : { label };
}
