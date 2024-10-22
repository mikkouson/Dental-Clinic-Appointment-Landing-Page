import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentsCol } from "@/app/schema";

const AppointmentTable = ({ data }: any) => {
  return (
    <Table>
      <TableCaption>A list of all appointments.</TableCaption>
      <TableHeader>
        <TableRow className="bg-muted">
          <TableHead>Appointment ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((appointment: AppointmentsCol) => (
          <TableRow key={appointment.id}>
            <TableCell>{appointment.id}</TableCell>
            <TableCell>{appointment.date}</TableCell>
            <TableCell>{appointment?.time_slots?.time}</TableCell>
            <TableCell>{appointment.services?.name}</TableCell>{" "}
            <TableCell>{appointment?.status?.name}</TableCell>{" "}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5} className="text-right">
            Total Appointments: {data?.length || 0}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default AppointmentTable;
