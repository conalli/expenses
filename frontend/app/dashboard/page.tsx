"use client";

import { useState } from "react";
import GroupDetails from "./(group)/GroupDetails";
import GroupList from "./(group)/GroupList";
import { Group } from "./models";
import useUser from "./useUser";

export default function Dashboard() {
  const { user } = useUser();
  const [selectedGroup, setSelectedGroup] = useState<Group>({} as Group);

  const handleSelectGroup = (group: Group): void => {
    setSelectedGroup(group);
  };
  if (!user) return null;
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-4">
        <div className="col-start-1">
          <GroupList
            groups={user.groups}
            selectedGroup={selectedGroup}
            selectGroup={handleSelectGroup}
          />
        </div>
        <div className="col-span-3">
          <GroupDetails group={selectedGroup} token={user.token} />
        </div>
      </div>
    </main>
  );
}
