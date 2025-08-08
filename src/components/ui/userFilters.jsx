import { Input } from "./input";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./dropdown-menu";

export function UserFilters({ filter, setFilter, selectedRole, setSelectedRole }) {
  return (
    <div className="flex space-x-4 ">
      <Input
        placeholder="Filter users..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className=""
      />



{/*    
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{selectedRole || "Role"}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {["Admin", "Superadmin", "Manager", "Cashier"].map((role) => (
            <DropdownMenuItem key={role} onClick={() => setSelectedRole(role)}>
              {role}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={() => setSelectedRole("")}>Clear</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
