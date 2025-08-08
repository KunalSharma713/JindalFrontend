import {
  IconChecklist,
  IconLayoutDashboard,
  IconUsers,
  IconTruck,
  IconPackage,
  IconBrandTabler
} from '@tabler/icons-react'
import { PiNuclearPlantBold } from "react-icons/pi";
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
export const sidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Campa Cola',
      logo: Command,
      plan: '',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        // {
        //   title: 'Dashboard',
        //   url: '/dashboard',
        //   icon: IconBrandTabler,
        // },
        {
          title: 'Users',
          url: '/users',
          icon: IconUsers,
        },
        // {
        //   title: 'Transport Vendors',
        //   url: '/companies',
        //   icon: IconChecklist,
        // },
        // {
        //   title: 'Plants',
        //   url: '/plants',
        //   icon: PiNuclearPlantBold,
        // },
        // {
        //   title: 'Truck Types',
        //   url: '/trucks',
        //   icon: IconTruck,
        // },
        // {
        //   title: 'Shipments',
        //   url: '/shipment',
        //   icon: IconPackage,
        // }

      ],
    },

  ],
}
