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
import { insertLocationSchema } from '@shared/schema';
import type { Location, Plant } from '@shared/schema';

type LocationFormValues = typeof insertLocationSchema._type;

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: Location | null;
  plants: Plant[];
}

export function LocationModal({ isOpen, onClose, location, plants }: LocationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(insertLocationSchema),
    defaultValues: {
      code: location?.code || '',
      plantId: location?.plantId || '',
      zone: location?.zone || '',
      aisle: location?.aisle || '',
      rack: location?.rack || '',
      level: location?.level || '',
      capacity: location?.capacity || 1,
      isActive: location?.isActive ?? true,
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: (data: LocationFormValues) => 
      apiRequest('POST', '/api/locations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locations'] });
      toast({
        title: "Location created",
        description: "Location has been successfully created.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create location.",
        variant: "destructive",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: (data: LocationFormValues) => 
      apiRequest('PUT', `/api/locations/${location!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locations'] });
      toast({
        title: "Location updated",
        description: "Location has been successfully updated.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update location.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LocationFormValues) => {
    if (location) {
      updateLocationMutation.mutate(data);
    } else {
      createLocationMutation.mutate(data);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const generateLocationCode = () => {
    const zone = form.getValues('zone');
    const aisle = form.getValues('aisle');
    const rack = form.getValues('rack');
    
    if (zone && aisle && rack) {
      const code = `${zone}-${aisle.padStart(2, '0')}-${rack.padStart(2, '0')}`;
      form.setValue('code', code);
    }
  };

  // Filter active plants
  const activePlants = plants.filter(plant => plant.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{location ? 'Edit Location' : 'Create New Location'}</DialogTitle>
          <DialogDescription>
            {location ? 'Update location information and capacity.' : 'Add a new storage location to the system.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant/Warehouse</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plant or warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activePlants.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.name} ({plant.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., A" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setTimeout(generateLocationCode, 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aisle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aisle</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 01" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setTimeout(generateLocationCode, 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rack</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 15" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          setTimeout(generateLocationCode, 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Will be auto-generated" {...field} />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    Format: Zone-Aisle-Rack (e.g., A-01-15)
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="1" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <div className="text-sm text-muted-foreground">
                    Number of pallets this location can hold
                  </div>
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
                    <FormLabel>Active Location</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Location is available for storage operations
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
                disabled={createLocationMutation.isPending || updateLocationMutation.isPending}
              >
                {createLocationMutation.isPending || updateLocationMutation.isPending 
                  ? (location ? 'Updating...' : 'Creating...') 
                  : (location ? 'Update Location' : 'Create Location')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
