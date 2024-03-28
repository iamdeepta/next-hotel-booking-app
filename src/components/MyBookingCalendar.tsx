"use client";

import Calendar, { Selected } from "@demark-pro/react-booking-calendar";

// const reserved = [
//   {
//     startDate: new Date(1970, 1, 1),
//     endDate: new Date(
//       new Date().getFullYear(),
//       new Date().getMonth() + 1,
//       new Date().getDay()
//     ),
//   },
// ];

const MyBookingCalendar = ({
  selectedDates,
  setSelectedDates,
}: {
  selectedDates: Selected[];
  setSelectedDates: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const handleChange = (e: any) => {
    setSelectedDates(e);
    console.log(e);
  };

  return (
    <Calendar
      classNamePrefix="calendar"
      selected={selectedDates}
      onChange={handleChange}
      onOverbook={(e, err) => alert(err)}
      components={{
        DayCellFooter: ({ innerProps }) => (
          <div {...innerProps}>{/* My custom day footer */}</div>
        ),
      }}
      disabled={(date, state) => !state.isSameMonth}
      // reserved={reserved}
      variant="booking"
      dateFnsOptions={{ weekStartsOn: 1 }}
      range={true}
    />
  );
};

export default MyBookingCalendar;
