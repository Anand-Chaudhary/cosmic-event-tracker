"use client";

interface NeoToolbarProps {
  onCompare: () => void;
  onLogout: () => void;
  disableCompare: boolean;
}

export default function NeoToolbar({ onCompare, onLogout, disableCompare }: NeoToolbarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Near Earth Objects</h1>
      <div className="flex gap-2">
        <button
          onClick={onCompare}
          disabled={disableCompare}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          Compare
        </button>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
