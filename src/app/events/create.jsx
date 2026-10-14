import EventForm from '@/components/event-form';
import EventsStatus from '@/components/events-status';
import { useEvents } from '@/context/events-context';

export default function CreateEventScreen() {
  const { loading, error } = useEvents();
  return loading || error ? <EventsStatus /> : <EventForm />;
}
