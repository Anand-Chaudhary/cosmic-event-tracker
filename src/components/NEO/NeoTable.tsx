"use client";
import { NearEarthObject } from "@/types/nasa.types";
import NeoRow from "./NeoRow";

interface NeoTableProps {
  data: Record<string, NearEarthObject[]>;
  selectedNeos: Record<string, NearEarthObject>;
  onSelect: (neo: NearEarthObject, checked: boolean) => void;
  onDetails: (neo: NearEarthObject) => void;
}

export default function NeoTable({ data, selectedNeos, onSelect, onDetails }: NeoTableProps) {
  const sortedDates = Object.keys(data).sort();

  return (
    <div className="overflow-x-auto">
      {sortedDates.map((date) => (
        <div key={date} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{date}</h2>
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-center w-1/7">Select</th>
                <th className="p-3 text-left w-1/7">Name</th>
                <th className="p-3 text-center w-1/7">Hazardous</th>
                <th className="p-3 text-right w-1/7">Diameter (km)</th>
                <th className="p-3 text-right w-2/7">Closest Approach</th>
                <th className="p-3 text-center w-1/7">Learn More</th>
              </tr>
            </thead>
            <tbody>
              {data[date].map((neo) => (
                <NeoRow
                  key={neo.id}
                  neo={neo}
                  selected={!!selectedNeos[neo.id]}
                  onSelect={onSelect}
                  onDetails={onDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
