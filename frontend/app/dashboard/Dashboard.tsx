"use client";

import { useState } from "react";
import GroupsList from "./GroupsList";
import { Group } from "./User";
import useUser from "./useUser";

export default function Dashboard() {
  const { user } = useUser();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  if (!user) return null;
  return (
    <div>
      <GroupsList groups={user.groups} />
    </div>
  );
}
