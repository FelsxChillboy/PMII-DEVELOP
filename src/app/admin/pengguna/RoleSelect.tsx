"use client"

import { updateUserRole } from "@/lib/admin-actions"

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-500",
  MEMBER: "bg-blue-500/10 text-blue-500",
  USER: "bg-gray-500/10 text-gray-400",
}

interface Props {
  userId: string
  currentRole: string
}

export default function RoleSelect({ userId, currentRole }: Props) {
  return (
    <form action={updateUserRole}>
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        onChange={(e) => e.target.form?.requestSubmit()}
        className={`text-xs px-2 py-1 rounded border-0 font-medium cursor-pointer ${ROLE_COLORS[currentRole] || ""} bg-transparent`}
      >
        <option value="USER">User</option>
        <option value="MEMBER">Member</option>
        <option value="ADMIN">Admin</option>
      </select>
    </form>
  )
}
