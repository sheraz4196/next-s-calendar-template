import { create } from "zustand";
import { EventType } from "@/types/zod-types";

type EventStore = {
  events: EventType[];
  addEvent: (event: EventType) => void;
  deleteEvent: (title: string) => void;
  editEvent: (title: string, updatedEvent: EventType) => void;
  getAllEvents: () => EventType[];
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  deleteEvent: (title) =>
    set((state) => ({
      events: state.events.filter((event) => event.title !== title),
    })),
  editEvent: (title, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.title === title ? { ...event, ...updatedEvent } : event
      ),
    })),
  getAllEvents: () => get().events,
}));
