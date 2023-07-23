import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CollectionMember } from "@/lib/api/models";
import { stringToColor } from "@/lib/styles";

export function CollectionMemberAvatar({
  member,
}: {
  member: CollectionMember;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Avatar>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback
              style={{ backgroundColor: stringToColor(member.username) }}
              className="text-white border-white border-2 shadow"
            >
              {member.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col">
            <p>{`@${member.username}`}</p>
            <p>{member.email}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
