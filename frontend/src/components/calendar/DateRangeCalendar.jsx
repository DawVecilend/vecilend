import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import "dayjs/locale/es";

function isOccupied(day, datesOcupades) {
  return datesOcupades.some(({ data_inici, data_fi }) => {
    const start = dayjs(data_inici);
    const end = dayjs(data_fi);
    return (
      day.isSame(start, "day") ||
      day.isSame(end, "day") ||
      (day.isAfter(start, "day") && day.isBefore(end, "day"))
    );
  });
}

function hasOccupiedBetween(start, end, datesOcupades) {
  let cursor = start.add(1, "day");
  while (cursor.isBefore(end, "day")) {
    if (isOccupied(cursor, datesOcupades)) return true;
    cursor = cursor.add(1, "day");
  }
  return false;
}

function CustomDay(props) {
  const {
    day,
    outsideCurrentMonth,
    datesOcupades = [],
    rangeStart,
    rangeEnd,
    ...other
  } = props;

  const occupied = isOccupied(day, datesOcupades);
  const isPast = day.isBefore(dayjs(), "day");
  const isStart = rangeStart && day.isSame(rangeStart, "day");
  const isEnd = rangeEnd && day.isSame(rangeEnd, "day");
  const isInRange =
    rangeStart &&
    rangeEnd &&
    day.isAfter(rangeStart, "day") &&
    day.isBefore(rangeEnd, "day");

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      disabled={occupied || isPast}
      sx={{
        fontFamily: "Inter",
        ...(occupied && {
          textDecoration: "line-through",
          color: "#4B5563 !important",
          opacity: 0.5,
        }),
        ...((isStart || isEnd) && {
          backgroundColor: "#14B8A6 !important",
          color: "#fff !important",
          fontWeight: 700,
          "&:hover": { backgroundColor: "#0F766E !important" },
        }),
        ...(isInRange && {
          backgroundColor: "rgba(20, 184, 166, 0.25) !important",
          color: "#14B8A6 !important",
        }),
      }}
    />
  );
}

/**
 * Selecció de rang en dos clics.
 *
 * @param {Object[]} [datesOcupades=[]]   [{data_inici, data_fi}, ...]
 * @param {Object} [initialRange]         {start: 'YYYY-MM-DD', end: 'YYYY-MM-DD'}
 * @param {Function} onRangeChange        ({start, end}) => void  (dayjs o null)
 */
function DateRangeCalendar({
  datesOcupades = [],
  initialRange,
  onRangeChange,
}) {
  const [rangeStart, setRangeStart] = useState(
    initialRange?.start ? dayjs(initialRange.start) : null,
  );
  const [rangeEnd, setRangeEnd] = useState(
    initialRange?.end ? dayjs(initialRange.end) : null,
  );
  const [hint, setHint] = useState(null);

  useEffect(() => {
    if (initialRange?.start) setRangeStart(dayjs(initialRange.start));
    if (initialRange?.end) setRangeEnd(dayjs(initialRange.end));
  }, [initialRange?.start, initialRange?.end]);

  const reportChange = (start, end) => onRangeChange?.({ start, end });

  const handleDateClick = (date) => {
    setHint(null);

    // Començar de zero
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
      reportChange(date, null);
      return;
    }

    // Click anterior al start → reset amb nou inici
    if (date.isBefore(rangeStart, "day")) {
      setRangeStart(date);
      setRangeEnd(null);
      reportChange(date, null);
      return;
    }

    // Validar dies ocupats al mig
    if (hasOccupiedBetween(rangeStart, date, datesOcupades)) {
      setHint("El rango contiene días no disponibles. Empieza de nuevo.");
      setRangeStart(date);
      setRangeEnd(null);
      reportChange(date, null);
      return;
    }

    setRangeEnd(date);
    reportChange(rangeStart, date);
  };

  const handleClear = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setHint(null);
    reportChange(null, null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div className="rounded-2xl bg-vecilend-dark-card border border-vecilend-dark-border p-2">
        <DateCalendar
          value={rangeStart}
          onChange={handleDateClick}
          slots={{ day: CustomDay }}
          slotProps={{
            day: { datesOcupades, rangeStart, rangeEnd },
          }}
          sx={{
            color: "#F2F4F8",
            "& .MuiPickersCalendarHeader-label": {
              color: "#F2F4F8",
              fontFamily: "Montserrat",
              fontWeight: 600,
            },
            "& .MuiSvgIcon-root": { color: "#F2F4F8" },
            "& .MuiDayCalendar-weekDayLabel": {
              color: "#B6BCC8",
              fontFamily: "Inter",
            },
            "& .MuiPickersDay-root": { color: "#F2F4F8" },
            "& .MuiPickersDay-root.Mui-disabled": {
              color: "#4B5563 !important",
            },
          }}
        />

        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-caption text-vecilend-dark-text-secondary font-body">
            {rangeStart && rangeEnd
              ? `${rangeStart.format("DD/MM/YYYY")} – ${rangeEnd.format("DD/MM/YYYY")}`
              : rangeStart
                ? `Inicio: ${rangeStart.format("DD/MM/YYYY")} · selecciona fin`
                : "Selecciona la fecha de inicio"}
          </span>
          {(rangeStart || rangeEnd) && (
            <button
              type="button"
              onClick={handleClear}
              className="text-caption text-vecilend-dark-primary font-body underline"
            >
              Limpiar
            </button>
          )}
        </div>

        {hint && (
          <p className="px-3 pb-2 text-caption text-yellow-400 font-body">
            {hint}
          </p>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default DateRangeCalendar;
