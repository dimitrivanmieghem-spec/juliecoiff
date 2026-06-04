"use client";

import { useState, useEffect } from "react";
import {
  startOfMonth, endOfMonth, eachDayOfInterval,
  addMonths, subMonths, isBefore, isToday,
  isSunday, isSameDay, getDay, format, startOfDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBookedSlots } from "@/app/actions/booking";

const END_MINUTES  = 18 * 60 + 30;
const TRAVEL_BUFFER = 30;

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let m = 9 * 60; m <= 18 * 60; m += 30) {
    const h   = String(Math.floor(m / 60)).padStart(2, "0");
    const min = String(m % 60).padStart(2, "0");
    slots.push(`${h}:${min}`);
  }
  return slots;
})();

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function toMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function paddingDays(date: Date): number {
  return (getDay(startOfMonth(date)) + 6) % 7;
}

interface BookedSlot {
  appointment_time: string;
  totalDuration: number;
}

interface Props {
  totalDuration: number;
  onSelectDateTime: (date: string, time: string) => void;
}

export default function BookingCalendar({ totalDuration, onSelectDateTime }: Props) {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots]   = useState<BookedSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today   = startOfDay(new Date());
  const days    = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const padding = paddingDays(currentMonth);

  useEffect(() => {
    if (!selectedDate) return;
    setBookedSlots([]);
    setLoadingSlots(true);
    getBookedSlots(format(selectedDate, "yyyy-MM-dd")).then((slots) => {
      setBookedSlots(slots);
      setLoadingSlots(false);
    });
  }, [selectedDate]);

  function isSlotDisabled(slotStr: string): boolean {
    const slotMin = toMin(slotStr);
    const slotEnd = slotMin + totalDuration + TRAVEL_BUFFER;

    if (slotEnd > END_MINUTES) return true;

    if (selectedDate && isToday(selectedDate)) {
      const now = new Date();
      if (slotMin <= now.getHours() * 60 + now.getMinutes()) return true;
    }

    for (const b of bookedSlots) {
      const bStart = toMin(b.appointment_time);
      const bEnd   = bStart + b.totalDuration + TRAVEL_BUFFER;
      if (slotMin < bEnd && slotEnd > bStart) return true;
    }

    return false;
  }

  function selectDate(day: Date) {
    setSelectedDate(day);
    setSelectedTime(null);
  }

  function selectTime(slot: string) {
    setSelectedTime(slot);
    if (selectedDate) onSelectDateTime(format(selectedDate, "yyyy-MM-dd"), slot);
  }

  return (
    <div className="bg-white/80 border border-primary/15 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-primary/10">
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), today)}
          className="p-1.5 rounded-lg text-text-main/50 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-serif text-base font-semibold text-text-main capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="p-1.5 rounded-lg text-text-main/50 hover:text-primary hover:bg-primary/5 transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-primary/5">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-2 ${d === "Dim" ? "text-text-main/25" : "text-text-main/40"}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-primary/5 p-px">
        {Array.from({ length: padding }).map((_, i) => (
          <div key={`pad-${i}`} className="bg-white/60 h-10" />
        ))}
        {days.map((day) => {
          const past   = isBefore(day, today) && !isToday(day);
          const sunday = isSunday(day);
          const off    = past || sunday;
          const sel    = selectedDate ? isSameDay(day, selectedDate) : false;
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={off}
              onClick={() => selectDate(day)}
              aria-pressed={sel}
              aria-label={format(day, "d MMMM yyyy", { locale: fr })}
              className={`h-10 flex items-center justify-center text-sm rounded-none transition-colors
                ${off
                  ? "text-text-main/20 cursor-not-allowed bg-white/60"
                  : sel
                  ? "bg-primary text-white font-semibold"
                  : "bg-white hover:bg-primary/8 text-text-main"}
                ${isToday(day) && !sel ? "ring-1 ring-primary/40" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="px-4 py-5 border-t border-primary/10">
          <p className="text-xs font-medium text-text-main/50 mb-3">
            Créneaux disponibles —{" "}
            <span className="text-primary">{format(selectedDate, "EEEE d MMMM", { locale: fr })}</span>
          </p>

          {loadingSlots ? (
            <p className="text-xs text-text-main/40 py-2">Chargement des disponibilités…</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {TIME_SLOTS.map((slot) => {
                const disabled = isSlotDisabled(slot);
                const active   = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={disabled}
                    onClick={() => selectTime(slot)}
                    aria-pressed={active}
                    className={`py-2 text-xs font-medium rounded-lg border transition-all duration-150
                      ${disabled
                        ? "border-transparent text-text-main/20 bg-transparent cursor-not-allowed"
                        : active
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-primary/20 text-text-main hover:border-primary hover:bg-primary/5"}
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}

          {totalDuration > 0 && !loadingSlots && (
            <p className="mt-3 text-xs text-text-main/40">
              Les créneaux grisés ne permettent pas de terminer avant 18h30 ({totalDuration} min + 30 min trajet) ou sont déjà réservés.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
