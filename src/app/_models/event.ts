import { Avatar, Event, EventAttendee } from "@prisma/client";

export interface FormattedCalenderEvent {
  id: string;
  url: string;
  start: Date;
  title: string;
  allDay: boolean;
  end?: Date | null;
}

export interface EventCreateForm {
  title: string;
  description?: string;
  roomId: string;
  location?: string;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  allDay: boolean;
}

export interface ExpandedEvent extends Event {
  attendees?: ExpandedEventAttendee[];
}

export interface ExpandedEventAttendee extends EventAttendee {
  user?: ExpandedAttendeeUser;
}

interface ExpandedAttendeeUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: Avatar | null;
}

export interface CalendarDay {
  date: string | number;
  day: string;
  fullDate: string;
}
