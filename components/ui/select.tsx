
export function Select({ children }) {
  return <div className="border rounded-md p-2">{children}</div>;
}
export function SelectTrigger({ children }) {
  return <div className="p-2 bg-gray-100 rounded">{children}</div>;
}
export function SelectContent({ children }) {
  return <div className="mt-1 border rounded">{children}</div>;
}
export function SelectItem({ children }) {
  return <div className="p-2 hover:bg-gray-200 cursor-pointer">{children}</div>;
}
