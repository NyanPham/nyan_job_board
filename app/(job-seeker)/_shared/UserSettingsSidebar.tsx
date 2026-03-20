import SidebarNavMenuGroup from "@/components/sidebar/SidebarNavMenuGroup";
import { BellIcon, FileUserIcon } from "lucide-react";

const UserSettingsSidebar = () => {
  return (
    <SidebarNavMenuGroup
      items={[
        {
          href: "/user-settings/notifications",
          icon: <BellIcon />,
          label: "Notifications",
        },
        {
          href: "/user-settings/resume",
          icon: <FileUserIcon />,
          label: "Resume",
        },
      ]}
    ></SidebarNavMenuGroup>
  );
};

export default UserSettingsSidebar;
