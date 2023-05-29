"use client";

import { GroupDetails } from "@/components/groups/GroupDetails";
import { GroupList } from "@/components/groups/GroupList";
import { useUser } from "@/hooks/useUser";
import { Group } from "@/lib/models";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const [selectedGroup, setSelectedGroup] = useState<Group>({} as Group);

  const handleSelectGroup = (group: Group): void => {
    setSelectedGroup(group);
  };
  if (!user) return null;
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-5">
        <div className="col-start-1">
          <GroupList
            groups={user.groups}
            selectedGroup={selectedGroup}
            selectGroup={handleSelectGroup}
          />
        </div>
        <div className="col-start-3 col-span-2 p-8">
          <GroupDetails group={selectedGroup} token={user.token} />
        </div>
      </div>
    </main>
  );
}
