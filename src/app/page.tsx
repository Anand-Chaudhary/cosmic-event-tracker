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

  const formatDate = (date: Date) => date.toISOString().split("T")[0];
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

      <NeoDateRangePicker today={today} maxEndDate={maxEndDate} onUpdateRange={fetchData} />

      {loading && <p className="text-gray-500">Loading NEO data...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {data && (
        <NeoTable
          data={data.near_earth_objects}
          selectedNeos={selectedNeos}
          onSelect={handleSelect}
          onDetails={setSelectedNeoForModal}
        />
      )}
    </div>
  );
}
