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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertPlantSchema } from '@shared/schema';
import type { Plant, User } from '@shared/schema';

type PlantFormValues = typeof insertPlantSchema._type;

interface PlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  plant?: Plant | null;
  users: User[];
}

export function PlantModal({ isOpen, onClose, plant, users }: PlantModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(insertPlantSchema),
    defaultValues: {
      name: plant?.name || '',
      type: plant?.type || 'plant',
      address: plant?.address || '',
      managerId: plant?.managerId || undefined,
      isActive: plant?.isActive ?? true,
    },
  });

  const createPlantMutation = useMutation({
    mutationFn: (data: PlantFormValues) => 
      apiRequest('POST', '/api/plants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plants'] });
      toast({
        title: "Plant created",
        description: "Plant has been successfully created.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create plant.",
        variant: "destructive",
      });
    },
  });

  const updatePlantMutation = useMutation({
    mutationFn: (data: PlantFormValues) => 
      apiRequest('PUT', `/api/plants/${plant!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plants'] });
      toast({
        title: "Plant updated",
        description: "Plant has been successfully updated.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update plant.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PlantFormValues) => {
    if (plant) {
      updatePlantMutation.mutate(data);
    } else {
      createPlantMutation.mutate(data);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  // Filter users who could be managers (exclude operators for example)
  const potentialManagers = users.filter(user => user.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{plant ? 'Edit Plant/Warehouse' : 'Create New Plant/Warehouse'}</DialogTitle>
          <DialogDescription>
            {plant ? 'Update plant or warehouse information.' : 'Add a new plant or warehouse to the system.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plant/warehouse name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="plant">Plant</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter facility address" 
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
              name="managerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility manager" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No Manager</SelectItem>
                      {potentialManagers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Facility</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Facility is operational and can be used for operations
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPlantMutation.isPending || updatePlantMutation.isPending}
              >
                {createPlantMutation.isPending || updatePlantMutation.isPending 
                  ? (plant ? 'Updating...' : 'Creating...') 
                  : (plant ? 'Update Facility' : 'Create Facility')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
