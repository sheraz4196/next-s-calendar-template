"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateEventForm from "./forms/create-event-form";

export default function SideEvents() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full col-span-3 lg:col-span-1">
      <div className="flex flex-col">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-full" asChild>
            <Button>Create Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <CreateEventForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
