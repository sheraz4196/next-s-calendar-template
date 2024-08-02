import EventCalender from "@/components/calender/event-calender";
import SideEvents from "@/components/calender/side-events";

export default function Home() {
  return (
    <main className="grid grid-cols-3 p-12 gap-12">
      <EventCalender />
      <SideEvents />
    </main>
  );
}
