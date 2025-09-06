"use client";
import { useState } from "react";

interface NeoDateRangePickerProps {
  today: string;
  maxEndDate: string;
  onUpdateRange: (start: string, end: string, minDiameter: number) => void;
}

export default function NeoDateRangePicker({ today, maxEndDate, onUpdateRange }: NeoDateRangePickerProps) {
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(maxEndDate);
  const [minDiameter, setMinDiameter] = useState<string>('');
  const [dateError, setDateError] = useState("");

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const getMaxEndDate = (start: string): string => {
    if (!start) return maxEndDate;
    const startDate = new Date(start);
    const maxDate = new Date(startDate);
    maxDate.setDate(startDate.getDate() + 6);
    return formatDate(maxDate);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    setStartDate(newStart);
    if (new Date(endDate) < new Date(newStart)) {
      const newEnd = new Date(newStart);
      newEnd.setDate(newEnd.getDate() + 6);
      setEndDate(formatDate(newEnd));
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    if (new Date(newEnd) >= new Date(startDate)) {
      setEndDate(newEnd);
      setDateError("");
    } else {
      setDateError("End date cannot be before start date");
    }
  };

  const handleSubmit = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diff > 7) {
      setDateError("Date range cannot exceed 7 days");
      return;
    }
    const diameter = minDiameter ? parseFloat(minDiameter) : 0;
    onUpdateRange(startDate, endDate, diameter);
  };

  const handleDiameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setMinDiameter(value);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" value={startDate} min={today} max={maxEndDate}
            onChange={handleStartDateChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" value={endDate} min={startDate || today} max={getMaxEndDate(startDate)}
            onChange={handleEndDateChange}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Diameter (km)</label>
          <input
            type="text"
            value={minDiameter}
            onChange={handleDiameterChange}
            placeholder="0"
            className="p-2 border border-gray-300 rounded-md w-32"
            inputMode="decimal"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors h-10 self-end"
        >
          Update Range
        </button>
      </div>
      {dateError && <p className="mt-2 text-red-600 text-sm">{dateError}</p>}
    </div>
  );
}
