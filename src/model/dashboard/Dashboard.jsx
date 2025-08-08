import {
  IconTruck,
  IconClockHour6,
  IconAlertCircle,
  IconDoorEnter,
  IconPackageExport,
  IconLoader,
  IconClockPause,
  IconClockCheck,
  IconPackages,
  IconTruckLoading,
  IconCalendarStats,
  IconTimelineEvent,
  IconUserX,
  IconUserCheck,
} from '@tabler/icons-react';
import useFetchAPI from "../../hooks/useFetchAPI";
import { useEffect, useState } from 'react';
import SkeletonTextLoder from "../../components/loaders/SkeletonTextLoder";
import moment from 'moment';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [currentdateAndTime, setCurrentdateAndTime] = useState({
    currentDate: '', currentMonth: ''
  })
  const { currentPlant } = useSelector(
    (state) => state.LoginReducer
  );
  useEffect(() => {
    const now = moment();
    const startOfMonth = moment().startOf('month');

    const currentDate = now.format('D MMMM, YYYY');
    const currentMonth = `${startOfMonth.format('D MMMM')} - ${now.format('D MMMM')}`;

    setCurrentdateAndTime({
      currentDate,
      currentMonth
    });
  }, []);

  // ✅ INDIVIDUAL STATES FOR EACH BOX
  const [truckInPlant, setTruckInPlant] = useState('');
  const [gateInOutTime, setGateInOutTime] = useState('');
  const [trucksUnconfirmed, setTrucksUnconfirmed] = useState('');
  const [pendingForGateEntry, setPendingForGateEntry] = useState('');
  const [shipmentOutToday, setShipmentOutToday] = useState('');
  const [truckInLoading, setTruckInLoading] = useState('');
  const [truckWaiting10Hours, setTruckWaiting10Hours] = useState('');
  const [averageLoadingTime, setAverageLoadingTime] = useState('');

  // Logistic Metrics (can keep array for now as they are static)
  const [noOfShipmentOut, setNoOfShipmentOut] = useState('');
  const [avgGateInOutTime, setAvgGateInOutTime] = useState('');
  const [avgLoadingTime, setAvgLoadingTime] = useState('');
  const [avgShipmentPerDay, setAvgShipmentPerDay] = useState('');
  const [avgTimeInConfirmation, setAvgTimeInConfirmation] = useState('');
  const [avgTimeConfirmationToGateIn, setAvgTimeConfirmationToGateIn] = useState('');
  const [supplierNonMeetingMetrics, setSupplierNonMeetingMetrics] = useState('');
  const [supplierMeetingMetrics, setSupplierMeetingMetrics] = useState('');


  // API 1 — TRUCK DETAILS
  const [getTruckDetailsFetchResponse, getTruckDetailsFetchHandler] = useFetchAPI(
    { url: `/dashboard/truck`, method: "GET" },
    (e) => {
      if (e?.truckinplan !== undefined) setTruckInPlant(e?.truckinplan ?? '');
      if (e?.truckunconfirmed !== undefined) setTrucksUnconfirmed(e?.truckunconfirmed ?? '');
      if (e?.pendingforgetentry !== undefined) setPendingForGateEntry(e?.pendingforgetentry ?? '');
      if (e?.shipmentouttoday !== undefined) setShipmentOutToday(e?.shipmentouttoday ?? '');
      if (e?.truckinloading !== undefined) setTruckInLoading(e?.truckinloading ?? '');
      if (e?.truckwaitingtenhours !== undefined) setTruckWaiting10Hours(e?.truckwaitingtenhours ?? '');
      return e;
    },
    (e) => e?.response ?? true
  );

  // API 2 — LOADING TIME
  const [getTruckLoadingTimeFetchResponse, getTruckLoadingTimeFetchHandler] = useFetchAPI(
    { url: `/dashboard/truckloadingtime`, method: "GET" },
    (e) => {
      if (e?.average_time_truck_loading !== undefined) setAverageLoadingTime(`${e?.average_time_truck_loading} HRS`);
      return e;
    },
    (e) => e?.response ?? true
  );

  // API 3 — GIGO (you can use later if needed)
  const [getNoOfTruckFetchResponse, getNoOfTruckFetchHandler] = useFetchAPI(
    { url: `/dashboard/gigotimedays`, method: "GET" },
    (e) => {
      if (e?.averageDuration !== undefined) setGateInOutTime(`${e?.averageDuration} HRS`);
      return e;
    },
    (e) => e?.response ?? true
  );


  // API 3 — logisticmetrics (you can use later if needed)
  const [getLogisticMetricsFetchResponse, getLogisticMetricsFetchHandler] = useFetchAPI(
    { url: `/dashboard/logisticmetrics`, method: "GET" },
    (e) => {
      if (e?.number_of_shipment_out !== undefined) setNoOfShipmentOut(e?.number_of_shipment_out ?? '');
      if (e?.avrage_shipment_per_days !== undefined) setAvgShipmentPerDay(e?.avrage_shipment_per_days ?? '');
      return e;
    },
    (e) => e?.response ?? true
  );


  // API 3 — supplierandnonsupplier (you can use later if needed)
  const [getsupplierandnonsupplierFetchResponse, getsupplierandnonsupplierFetchHandler] = useFetchAPI(
    { url: `/dashboard/supplierandnonsupplier`, method: "GET" },
    (e) => {
      if (e?.supplier !== undefined) setSupplierMeetingMetrics(e?.supplier);
      if (e?.non_supplier !== undefined) setSupplierNonMeetingMetrics(e?.non_supplier);
      return e;
    },
    (e) => e?.response ?? true
  );



  // API 3 — avragetimelogisticmetrics (you can use later if needed)
  const [getavgGateInOutTimeFetchResponse, getavgGateInOutTimeFetchHandler] = useFetchAPI(
    { url: `/dashboard/avragetimelogisticmetrics`, method: "POST" },
    (e) => {
      if (e?.title !== undefined && e?.title === 'avgGateInOutTime') setAvgGateInOutTime(`${e?.averagetime} HRS`);

      return e;
    },
    (e) => e?.response ?? true
  );

  const [getavgLoadingTimeFetchResponse, getavgLoadingTimeFetchHandler] = useFetchAPI(
    { url: `/dashboard/avragetimelogisticmetrics`, method: "POST" },
    (e) => {

      if (e?.title !== undefined && e?.title === 'avgLoadingTime') setAvgLoadingTime(`${e?.averagetime} HRS`);

      return e;
    },
    (e) => e?.response ?? true
  );

  const [getavgTimeInConfirmationFetchResponse, getavgTimeInConfirmationFetchHandler] = useFetchAPI(
    { url: `/dashboard/avragetimelogisticmetrics`, method: "POST" },
    (e) => {
      if (e?.title !== undefined && e?.title === 'avgTimeInConfirmation') setAvgTimeInConfirmation(`${e?.averagetime} HRS`);


      return e;
    },
    (e) => e?.response ?? true
  );

  const [getavgTimeConfirmationToGateInFetchResponse, getavgTimeConfirmationToGateInFetchHandler] = useFetchAPI(
    { url: `/dashboard/avragetimelogisticmetrics`, method: "POST" },
    (e) => {


      if (e?.title !== undefined && e?.title === 'avgTimeConfirmationToGateIn') setAvgTimeConfirmationToGateIn(`${e?.averagetime} HRS`);

      return e;
    },
    (e) => e?.response ?? true
  );



  useEffect(() => {

    const fetchAllData = () => {
      getTruckDetailsFetchHandler({
        params: {
          plant_id: currentPlant?._id
        }
      });
      getTruckLoadingTimeFetchHandler({
        params: {
          plant_id: currentPlant?._id
        }
      });
      getNoOfTruckFetchHandler({
        params: {
          plant_id: currentPlant?._id
        }
      });
      getLogisticMetricsFetchHandler({
        params: {
          plant_id: currentPlant?._id
        }
      });
      getavgGateInOutTimeFetchHandler({
        body: {
          "status_1": "GateIn",
          "status_2": "GateOut",
          "title": 'avgGateInOutTime',
          plant_id: currentPlant?._id
        }
      });
      getavgLoadingTimeFetchHandler({
        body: {
          "status_1": "Loading",
          "status_2": "Loaded",
          "title": 'avgLoadingTime',
          plant_id: currentPlant?._id
        }
      });
      getavgTimeInConfirmationFetchHandler({
        body: {
          "status_1": "Assigned",
          "status_2": "Confirmed",
          "title": 'avgTimeInConfirmation',
          plant_id: currentPlant?._id
        }
      });
      getavgTimeConfirmationToGateInFetchHandler({
        body: {
          "status_1": "Confirmed",
          "status_2": "GateIn",
          "title": 'avgTimeConfirmationToGateIn',
          plant_id: currentPlant?._id
        }
      });
      getsupplierandnonsupplierFetchHandler({
        params: {
          plant_id: currentPlant?._id
        }
      });
    };

    // Call immediately on mount
    fetchAllData();

    // Set interval to refresh every 5 mins (5 * 60 * 1000 ms)
    const interval = setInterval(() => {
      fetchAllData();
    }, 5 * 60 * 1000);

    // Cleanup when component unmounts
    return () => clearInterval(interval);

  }, []);



  const MetricCard = ({ description, count, icon, color, isLoading }) => (
    <div className={`rounded-lg shadow p-3 flex flex-col justify-between  min-h-[104px] ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <div>{icon}</div>
        {(isLoading) ?
          <SkeletonTextLoder
          /> :
          <div className="text-xl font-bold text-gray-800">
            {count ?? ''}
          </div>
        }

      </div>
      <div className="text-sm text-gray-700 font-medium">{description ?? ''}</div>
    </div>
  );

  return (
    <div className="ps-2 pe-2  bg-gray-50  ">
      <h2 className="text-[22px] font-semibold mb-1">In-Plant Logistics Operations Dashboard</h2>

      {/* Inside Plant Section */}
      <div className="mb-2 ">
        <h3 className="text-[17px] font-semibold mb-1">INSIDE PLANT ({currentdateAndTime?.currentDate ?? ''})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

          <MetricCard description="NUMBER OF TRUCK IN PLANT" count={truckInPlant} icon={<IconTruck size={32} className="text-blue-600" />} color="bg-blue-100" isLoading={getTruckDetailsFetchResponse?.fetching} />

          <MetricCard description="GATE IN GATE OUT TIME" count={gateInOutTime} icon={<IconClockHour6 size={32} className="text-indigo-600" />} color="bg-indigo-100" isLoading={getNoOfTruckFetchResponse?.fetching} />

          <MetricCard description="NO OF TRUCKS UNCONFIRMED" count={trucksUnconfirmed} icon={<IconAlertCircle size={32} className="text-red-600" />} color="bg-red-100" isLoading={getTruckDetailsFetchResponse?.fetching} />

          <MetricCard description="PENDING FOR GATE ENTRY" count={pendingForGateEntry} icon={<IconDoorEnter size={32} className="text-yellow-600" />} color="bg-yellow-100" isLoading={getTruckDetailsFetchResponse?.fetching} />

          <MetricCard description="NO OF SHIPMENT OUT TODAY" count={shipmentOutToday} icon={<IconPackageExport size={32} className="text-green-600" />} color="bg-green-100" isLoading={getTruckDetailsFetchResponse?.fetching} />

          <MetricCard description="TRUCK IN LOADING" count={truckInLoading} icon={<IconLoader size={32} className="text-purple-600" />} color="bg-purple-100" isLoading={getTruckDetailsFetchResponse?.fetching} />

          <MetricCard description="TRUCK WAITING > 10 HOURS" count={truckWaiting10Hours} icon={<IconClockPause size={32} className="text-orange-600" />} color="bg-orange-100" isLoading={getTruckDetailsFetchResponse?.fetching} />

          <MetricCard description="AVERAGE LOADING TIME" count={averageLoadingTime} icon={<IconClockCheck size={32} className="text-teal-600" />} color="bg-teal-100" isLoading={getTruckLoadingTimeFetchResponse?.fetching} />

        </div>
      </div>

      {/* Logistic Metrics Section */}
      <div>
        <h3 className="text-[17px] font-semibold mb-1">LOGISTIC METRICS ({currentdateAndTime?.currentMonth ?? ''})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

          <MetricCard description="NO OF SHIPMENT OUT" count={noOfShipmentOut} icon={<IconPackages size={32} className="text-blue-600" />} color="bg-blue-100" isLoading={getLogisticMetricsFetchResponse?.fetching} />

          <MetricCard description="AVG GATE IN GATE OUT TIME (GIGO)" count={avgGateInOutTime} icon={<IconTruckLoading size={32} className="text-indigo-600" />} color="bg-indigo-100" isLoading={getavgGateInOutTimeFetchResponse?.fetching} />

          <MetricCard description="AVG LOADING TIME" count={avgLoadingTime} icon={<IconClockHour6 size={32} className="text-purple-600" />} color="bg-purple-100" isLoading={getavgLoadingTimeFetchResponse?.fetching} />

          <MetricCard description="AVG SHIPMENT / DAY" count={avgShipmentPerDay} icon={<IconCalendarStats size={32} className="text-green-600" />} color="bg-green-100" isLoading={getLogisticMetricsFetchResponse?.fetching} />

          <MetricCard description="AVG TIME IN CONFIRMATION" count={avgTimeInConfirmation} icon={<IconTimelineEvent size={32} className="text-yellow-600" />} color="bg-yellow-100" isLoading={getavgTimeInConfirmationFetchResponse?.fetching} />

          <MetricCard description="AVG TIME CONFIRMATION TO GATE IN" count={avgTimeConfirmationToGateIn} icon={<IconClockHour6 size={32} className="text-teal-600" />} color="bg-teal-100" isLoading={getavgTimeConfirmationToGateInFetchResponse?.fetching} />

          <MetricCard description="SUPPLIER NON MEETING METRICS" count={supplierNonMeetingMetrics} icon={<IconUserX size={32} className="text-red-600" />} color="bg-red-100" isLoading={getsupplierandnonsupplierFetchResponse?.fetching} />

          <MetricCard description="SUPPLIER MEETING METRICS" count={supplierMeetingMetrics} icon={<IconUserCheck size={32} className="text-green-600" />} color="bg-green-100" isLoading={getsupplierandnonsupplierFetchResponse?.fetching} />

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
