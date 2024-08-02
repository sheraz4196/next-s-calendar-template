"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEventStore } from "@/stores/useEventsStore";
import Image from "next/image";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EventType } from "@/types/zod-types";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import Link from "next/link";
import CreateEventForm from "./forms/create-event-form";
import { timeEnd } from "console";
export default function EventCalender() {
  const { events, deleteEvent } = useEventStore();
  const [deleteModal, setDeleteModal] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [openEditModal, setOpenEditForm] = useState(false);
  const [selectEvent, setSelectedEvent] = useState<EventType>();
  const [clickInfoToDelete, setClickInfoToDelete] = useState<EventClickArg>();
  const handleEventClick = (clickInfo: EventClickArg) => {
    setOpenEvent(true);
    setClickInfoToDelete(clickInfoToDelete);
    setSelectedEvent({
      title: clickInfo.event.title,
      dateRange: {
        from: clickInfo.event.start as Date,
        to: clickInfo.event.end as Date,
      },
      allDay: clickInfo.event.allDay,
      description: clickInfo.event.extendedProps.description,
      category: clickInfo.event.extendedProps.category,
      thumbnail: clickInfo.event.extendedProps.thumbnail,
      categoryUrl: clickInfo.event.extendedProps.categoryUrl,
      timeStart: clickInfo.event.extendedProps.timeStart,
      timeEnd: clickInfo.event.extendedProps.timeEnd,
    });
  };

  const handleDelete = () => {
    deleteEvent(selectEvent?.title || "");
    clickInfoToDelete?.event.remove();
    setDeleteModal(false);
    setOpenEvent(false);
  };

  return (
    <section className="col-span-3 lg:col-span-2">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.title,
          start: event.dateRange.from,
          end: event.dateRange.to,
          allDay: event.allDay,
          color: event.category === "tournament" ? "green" : "black",
          extendedProps: {
            description: event.description,
            category: event.category,
            thumbnail: event.thumbnail,
            categoryUrl: event.categoryUrl,
            timeStart: event.timeStart,
            timeEnd: event.timeEnd,
          },
        }))}
        eventClick={handleEventClick}
        eventContent={(info) => (
          <div>
            <strong>{info.event.title}</strong>
            <div>{info.event.extendedProps.description}</div>
            <div>Category: {info.event.extendedProps.category}</div>
            {info.event.extendedProps.thumbnail && (
              <Image
                src={URL.createObjectURL(info.event.extendedProps.thumbnail)}
                alt="Thumbnail"
                width={250}
                height={250}
              />
            )}
          </div>
        )}
      />
      <Sheet open={openEvent} onOpenChange={setOpenEvent}>
        <SheetContent className="flex flex-col gap-4 py-12">
          <SheetHeader className="text-3xl font-semibold">
            {selectEvent?.title}
          </SheetHeader>
          <div className="flex flex-col gap-4 items-center">
            {selectEvent?.thumbnail && (
              <Image
                src={URL.createObjectURL(selectEvent?.thumbnail)}
                alt="Thumbnail"
                width={250}
                height={250}
                className="w-full h-full"
              />
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Category</h4>
                <span>{selectEvent?.category}</span>
              </div>
              {selectEvent?.categoryUrl && (
                <div className="flex flex-col gap-2 items-center justify-between">
                  <h4 className="capitalize self-start font-semibold">
                    {selectEvent?.category} Url
                  </h4>
                  <Link
                    className="text-blue-700"
                    href={selectEvent?.categoryUrl as string}
                  >
                    {selectEvent?.categoryUrl}
                  </Link>
                </div>
              )}
              <div className="flex flex-col gap-2 justify-between">
                <h4 className="capitalize self-start font-semibold">
                  Description
                </h4>
                <p>{selectEvent?.description}</p>
              </div>
              <div className="flex flex-col gap-2 justify-between">
                <h4 className="capitalize self-start font-semibold">All day</h4>
                <p>{selectEvent?.allDay ? "Yes" : "No"}</p>
              </div>
              {selectEvent && (
                <div className="flex flex-col">
                  <div className="flex flex-col gap-2 justify-between">
                    <h4 className="font-semibold">Starts At</h4>
                    <span>
                      {selectEvent?.dateRange.from.toString()}{" "}
                      {selectEvent?.timeStart}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 justify-between">
                    <h4 className="font-semibold">Ends At</h4>
                    <span>
                      {selectEvent?.dateRange.to?.toString()}{" "}
                      {selectEvent?.timeEnd}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
              <DialogTrigger asChild>
                <Button variant={"destructive"}>Delete</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Do you want to delete the event?</DialogHeader>
                <DialogFooter>
                  <div className="flex items-center gap-2">
                    <DialogClose asChild>
                      <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDelete} variant={"destructive"}>
                      Delete
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={openEditModal} onOpenChange={setOpenEditForm}>
              <DialogTrigger asChild>
                <Button>Edit</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>Edit {selectEvent?.title} Event</DialogHeader>
                <CreateEventForm
                  setOpen={setOpenEditForm}
                  selectedEvent={selectEvent}
                  update
                />
              </DialogContent>
            </Dialog>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
