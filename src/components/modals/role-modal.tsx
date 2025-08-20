import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertRoleSchema } from '@shared/schema';
import type { Role } from '@shared/schema';
import { z } from 'zod';

const roleFormSchema = insertRoleSchema.extend({
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}

const availablePermissions = [
  { id: '*', label: 'All Permissions', description: 'Full system access' },
  { id: 'users.view', label: 'View Users', description: 'Can view user list' },
  { id: 'users.create', label: 'Create Users', description: 'Can create new users' },
  { id: 'users.edit', label: 'Edit Users', description: 'Can modify user information' },
  { id: 'users.delete', label: 'Delete Users', description: 'Can delete users' },
  { id: 'roles.view', label: 'View Roles', description: 'Can view role list' },
  { id: 'roles.create', label: 'Create Roles', description: 'Can create new roles' },
  { id: 'roles.edit', label: 'Edit Roles', description: 'Can modify roles' },
  { id: 'roles.delete', label: 'Delete Roles', description: 'Can delete roles' },
  { id: 'plants.view', label: 'View Plants', description: 'Can view plants and warehouses' },
  { id: 'plants.create', label: 'Create Plants', description: 'Can create plants and warehouses' },
  { id: 'plants.edit', label: 'Edit Plants', description: 'Can modify plants and warehouses' },
  { id: 'plants.delete', label: 'Delete Plants', description: 'Can delete plants and warehouses' },
  { id: 'locations.view', label: 'View Locations', description: 'Can view storage locations' },
  { id: 'locations.create', label: 'Create Locations', description: 'Can create new locations' },
  { id: 'locations.edit', label: 'Edit Locations', description: 'Can modify locations' },
  { id: 'locations.delete', label: 'Delete Locations', description: 'Can delete locations' },
  { id: 'pallets.view', label: 'View Pallets', description: 'Can view pallet information' },
  { id: 'pallets.create', label: 'Create Pallets', description: 'Can generate new pallets' },
  { id: 'pallets.edit', label: 'Edit Pallets', description: 'Can modify pallet information' },
  { id: 'pallets.delete', label: 'Delete Pallets', description: 'Can delete pallets' },
  { id: 'pallets.move', label: 'Move Pallets', description: 'Can perform pallet operations' },
  { id: 'audit.view', label: 'View Audit Logs', description: 'Can view system audit logs' },
];

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      permissions: Array.isArray(role?.permissions) ? role.permissions : [],
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (data: RoleFormValues) => 
      apiRequest('POST', '/api/roles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roles'] });
      toast({
        title: "Role created",
        description: "Role has been successfully created.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create role.",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: RoleFormValues) => 
      apiRequest('PUT', `/api/roles/${role!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roles'] });
      toast({
        title: "Role updated",
        description: "Role has been successfully updated.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RoleFormValues) => {
    if (role) {
      updateRoleMutation.mutate(data);
    } else {
      createRoleMutation.mutate(data);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const currentPermissions = form.getValues('permissions');
    
    if (permissionId === '*') {
      // If "All Permissions" is selected, clear all other permissions
      if (checked) {
        form.setValue('permissions', ['*']);
      } else {
        form.setValue('permissions', []);
      }
    } else {
      // If any specific permission is selected, remove "All Permissions"
      let newPermissions = currentPermissions.filter(p => p !== '*');
      
      if (checked) {
        newPermissions.push(permissionId);
      } else {
        newPermissions = newPermissions.filter(p => p !== permissionId);
      }
      
      form.setValue('permissions', newPermissions);
    }
  };

  const selectedPermissions = form.watch('permissions');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          <DialogDescription>
            {role ? 'Update role information and permissions.' : 'Create a new role with specific permissions.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter role description" 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-3">
                    {availablePermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={permission.id}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {permission.label}
                          </label>
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createRoleMutation.isPending || updateRoleMutation.isPending}
              >
                {createRoleMutation.isPending || updateRoleMutation.isPending 
                  ? (role ? 'Updating...' : 'Creating...') 
                  : (role ? 'Update Role' : 'Create Role')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
