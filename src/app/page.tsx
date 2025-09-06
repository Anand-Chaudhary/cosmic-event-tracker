"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNeoStore } from "@/store/neoStore";
import useAuthStore from "@/store/authStore";
import { NearEarthObject } from "@/types/nasa.types";
import NeoDetailModal from "./(app)/event/[id]/page";
import NeoDateRangePicker from "@/components/NEO/NeoDateRangePicker";
import NeoToolbar from "@/components/NEO/NeoToolbar";
import NeoTable from "@/components/NEO/NeoTable";

export default function HomePage() {
  const router = useRouter();
  const { data, loading, error, fetchData } = useNeoStore();
  const { user } = useAuthStore();
  const [selectedNeos, setSelectedNeos] = useState<Record<string, NearEarthObject>>({});
  const [selectedNeoForModal, setSelectedNeoForModal] = useState<NearEarthObject | null>(null);
  const [minDiameter, setMinDiameter] = useState<number>(0);
  const [filteredData, setFilteredData] = useState<Record<string, NearEarthObject[]> | null>(null);

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const filterAsteroidsByDiameter = (neoData: Record<string, NearEarthObject[]>, minDiam: number) => {
    if (!minDiam) return neoData;
    
    console.log('Filtering NEOs with min diameter:', minDiam);
    const filteredData: Record<string, NearEarthObject[]> = {};
    
    Object.entries(neoData).forEach(([date, neos]) => {
      console.log(`Processing ${neos.length} NEOs for date:`, date);
      
      const filteredNeos = neos.filter(neo => {
        try {
          // Safely access the diameter data
          const diameter = neo.estimated_diameter?.kilometers?.estimated_diameter_max;
          console.log(`NEO ${neo.name || 'Unnamed'} - Diameter:`, diameter);
          
          // If diameter is not available, exclude the NEO
          if (diameter === undefined || diameter === null) {
            console.log(`Excluding ${neo.name || 'Unnamed NEO'} - diameter data not available`);
            return false;
          }
          
          const include = diameter >= minDiam;
          console.log(`NEO ${neo.name || 'Unnamed'} - ${include ? 'Included' : 'Excluded'} - Diameter: ${diameter}km`);
          return include;
        } catch (error) {
          console.error('Error processing NEO:', neo, error);
          return false;
        }
      });
      
      if (filteredNeos.length > 0) {
        filteredData[date] = filteredNeos;
      }
    });
    
    return filteredData;
  };
  const today = formatDate(new Date());
  const maxEndDate = formatDate(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000));

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!data) fetchData(today, maxEndDate);
  }, [user, router, data, fetchData, today, maxEndDate]);

  const handleSelect = (neo: NearEarthObject, checked: boolean) => {
    setSelectedNeos((prev) => {
      const copy = { ...prev };
      if (checked) copy[neo.id] = neo;
      else delete copy[neo.id];
      return copy;
    });
  };

  const handleCompare = () => {
    if (Object.keys(selectedNeos).length === 0) return;
    sessionStorage.setItem("compareNeos", JSON.stringify(Object.values(selectedNeos)));
    router.push("/compare");
  };

  const handleLogout = async () => {
    const { signOut } = useAuthStore.getState();
    await signOut();
    router.push("/login");
  };

  const handleUpdateRange = (start: string, end: string, diameter: number) => {
    setMinDiameter(diameter);
    fetchData(start, end).then(() => {
      if (data) {
        const filtered = filterAsteroidsByDiameter(data.near_earth_objects, diameter);
        setFilteredData({...filtered});
      }
    });
  };

  // Apply filter to existing data
  const applyFilter = () => {
    if (data) {
      const filtered = filterAsteroidsByDiameter(data.near_earth_objects, minDiameter);
      setFilteredData({...filtered});
    }
  };

  return (
    <div className="p-6 relative">
      {/* Modal */}
      {selectedNeoForModal && (
        <NeoDetailModal
          neo={selectedNeoForModal}
          isOpen={true}
          onClose={() => setSelectedNeoForModal(null)}
        />
      )}
      <NeoToolbar onCompare={handleCompare} onLogout={handleLogout} disableCompare={Object.keys(selectedNeos).length === 0} />

      <div className="space-y-4">
        <NeoDateRangePicker today={today} maxEndDate={maxEndDate} onUpdateRange={handleUpdateRange} />
        <div className="flex items-center space-x-4">
          <button
            onClick={applyFilter}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            disabled={!data}
          >
            Apply Diameter Filter
          </button>
          <span className="text-sm text-gray-600">
            {minDiameter > 0 ? `Showing asteroids > ${minDiameter}km in diameter` : 'No diameter filter applied'}
          </span>
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading NEO data...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {data && (
        <NeoTable
          data={filteredData || data.near_earth_objects}
          selectedNeos={selectedNeos}
          onSelect={handleSelect}
          onDetails={setSelectedNeoForModal}
        />
      )}
    </div>
  );
}
