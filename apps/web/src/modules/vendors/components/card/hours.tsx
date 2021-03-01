import {
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core';
import { Vendor, VendorOpeningHours } from '@townhub-libs/vendors';
import React from 'react';
import { DateTime } from 'luxon';

const convertOpeningHoursToRows = (openingHours: VendorOpeningHours[]) => {
  const today = DateTime.local();
  return openingHours
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
    .map((val) => {
      const date = today.startOf('week').plus({
        days: val.dayOfWeek - 1,
        hours: val.startHours,
        minutes: val.startMinutes,
      });

      const dateEnd = date.set({
        hour: val.endHours,
        minute: val.endMinutes,
      });
      return {
        day: date.weekdayLong,
        range: `${date.toLocaleString(
          DateTime.TIME_SIMPLE
        )} - ${dateEnd.toLocaleString(DateTime.TIME_SIMPLE)}`,
        isToday: today.hasSame(date, 'day'),
      };
    });
};
export const HoursTab: React.FC<Vendor> = ({ openingHours }) => {
  const rows = convertOpeningHoursToRows(openingHours);
  return (
    <CardContent>
      <Table>
        <TableBody>
          {rows.map((row, index) =>
            row.isToday ? (
              <TableRow key={index}>
                <TableCell component='th' scope='row'>
                  <strong>{row.day}</strong>
                </TableCell>
                <TableCell>
                  <strong>{row.range}</strong>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={index}>
                <TableCell component='th' scope='row'>
                  {row.day}
                </TableCell>
                <TableCell>{row.range}</TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </CardContent>
  );
};
