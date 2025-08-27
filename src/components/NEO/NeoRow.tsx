"use client";
import { NearEarthObject } from "@/types/nasa.types";

interface NeoRowProps {
  neo: NearEarthObject;
  selected: boolean;
  onSelect: (neo: NearEarthObject, checked: boolean) => void;
  onDetails: (neo: NearEarthObject) => void;
}

export default function NeoRow({ neo, selected, onSelect, onDetails }: NeoRowProps) {
  const diameter =
    (neo.estimated_diameter.kilometers.estimated_diameter_min +
      neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;
  const approach = neo.close_approach_data[0];

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="p-3 text-center">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(neo, e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="p-3 text-left font-medium">{neo.name}</td>
      <td className="p-3 text-center">
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${neo.is_potentially_hazardous_asteroid
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"}`}>
          {neo.is_potentially_hazardous_asteroid ? "Yes" : "No"}
        </span>
      </td>
      <td className="p-3 text-right font-mono">{diameter.toFixed(3)}</td>
      <td className="p-3 text-right whitespace-nowrap">{approach.close_approach_date_full}</td>
      <td className="p-3 text-center">
        <button
          onClick={() => onDetails(neo)}
          className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
        >
          Details
        </button>
      </td>
    </tr>
  );
}
