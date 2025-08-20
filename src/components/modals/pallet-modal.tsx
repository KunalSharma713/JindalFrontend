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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertPalletSchema } from '@shared/schema';
import type { Pallet, Plant } from '@shared/schema';

type PalletFormValues = typeof insertPalletSchema._type;

interface PalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  pallet?: Pallet | null;
  plants: Plant[];
}

export function PalletModal({ isOpen, onClose, pallet, plants }: PalletModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PalletFormValues>({
    resolver: zodResolver(insertPalletSchema),
    defaultValues: {
      plantId: pallet?.plantId || '',
      status: pallet?.status || 'generated',
      currentLocationId: pallet?.currentLocationId || undefined,
    },
  });

  const createPalletMutation = useMutation({
    mutationFn: (data: PalletFormValues) => 
      apiRequest('POST', '/api/pallets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pallets'] });
      toast({
        title: "Pallet generated",
        description: "New pallet has been successfully generated.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate pallet.",
        variant: "destructive",
      });
    },
  });

  const updatePalletMutation = useMutation({
    mutationFn: (data: PalletFormValues) => 
      apiRequest('PUT', `/api/pallets/${pallet!.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pallets'] });
      toast({
        title: "Pallet updated",
        description: "Pallet has been successfully updated.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update pallet.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PalletFormValues) => {
    if (pallet) {
      updatePalletMutation.mutate(data);
    } else {
      createPalletMutation.mutate(data);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  // Filter active plants
  const activePlants = plants.filter(plant => plant.isActive);

  const statusOptions = [
    { value: 'generated', label: 'Generated', description: 'Pallet has been created but not assigned' },
    { value: 'stored', label: 'Stored', description: 'Pallet is stored in a location' },
    { value: 'moving', label: 'Moving', description: 'Pallet is being moved between locations' },
    { value: 'picked', label: 'Picked', description: 'Pallet has been picked from storage' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{pallet ? 'Edit Pallet' : 'Generate New Pallet'}</DialogTitle>
          <DialogDescription>
            {pallet ? 'Update pallet information and status.' : 'Generate a new pallet with barcode for tracking.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant/Warehouse (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plant or warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No Plant Assignment</SelectItem>
                      {activePlants.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.name} ({plant.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-muted-foreground">
                    Plant association for this pallet
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pallet status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div>
                            <div className="font-medium">{status.label}</div>
                            <div className="text-xs text-muted-foreground">{status.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {pallet && (
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900">Current Pallet Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Code:</span>
                    <span className="font-mono ml-2">{pallet.code}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Barcode:</span>
                    <span className="font-mono ml-2">{pallet.barcode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2">
                      {pallet.createdAt ? new Date(pallet.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Updated:</span>
                    <span className="ml-2">
                      {pallet.updatedAt ? new Date(pallet.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!pallet && (
              <div className="space-y-2 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Generation Information</h4>
                <p className="text-sm text-blue-700">
                  A unique pallet code and barcode will be automatically generated when you create this pallet.
                  The barcode can be used for scanning and tracking operations.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPalletMutation.isPending || updatePalletMutation.isPending}
              >
                {createPalletMutation.isPending || updatePalletMutation.isPending 
                  ? (pallet ? 'Updating...' : 'Generating...') 
                  : (pallet ? 'Update Pallet' : 'Generate Pallet')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
