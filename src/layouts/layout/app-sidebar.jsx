import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "../../components/ui/sidebar"; // Importing UI components for sidebar layout
import { NavGroup } from "./nav-group"; // Navigation group component
import { NavUser } from "./nav-user"; // User-related sidebar footer component
import { TeamSwitcher } from "./team-switcher"; // Component for switching teams
import { sidebarData } from "./data/sidebar-data"; // Sidebar navigation data
import { useSelector } from "react-redux"; // Redux hook to get state data

export function AppSidebar(props) {

  // Accessing user details from the Redux store
  const { userDetails } = useSelector((state) => state.LoginReducer);

  // Default user object structure, populated from Redux store
  let user = {
    name: userDetails?.first_name + " " + userDetails?.last_name, // Combine first and last name
    email: userDetails?.email, // User's email
    avatar: '../assets/img/storelogo.png', // Default avatar image path (static)
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}> {/* Sidebar with collapsible icon and floating variant */}
      <SidebarHeader>
        {/* Display team switching UI */}
        <TeamSwitcher teams={user} />
      </SidebarHeader>
      <SidebarContent>
        {/* Loop through sidebarData to generate navigation groups */}
        {sidebarData.navGroups.map((group) => (
          <NavGroup key={group.title} {...group} /> // Pass navigation group data to NavGroup component
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* Footer with user info */}
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
