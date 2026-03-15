// components/sidebar.tsx
import Link from "next/link"

const links = [
  "Dashboard",
  "Records",
  "Medication",
  "Calendar",
  "Profile",
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-6 hidden md:block">
      <h2 className="font-semibold text-xl mb-6">Medicare Assist</h2>
      <nav className="space-y-3">
        {links.map(link => (
          <Link
            key={link}
            href="#"
            className="block rounded-md px-3 py-2 hover:bg-muted"
          >
            {link}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
