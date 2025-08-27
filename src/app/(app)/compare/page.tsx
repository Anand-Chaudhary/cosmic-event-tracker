"use client";
import { useEffect, useState } from "react";
import { NearEarthObject } from "@/types/nasa.types";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ComparePage() {
    const [neos, setNeos] = useState<NearEarthObject[]>([]);

    useEffect(() => {
        const saved = sessionStorage.getItem("compareNeos");
        if (saved) setNeos(JSON.parse(saved));
    }, []);

    const chartData = neos.map((neo) => {
        const diameter =
            (neo.estimated_diameter.kilometers.estimated_diameter_min +
                neo.estimated_diameter.kilometers.estimated_diameter_max) /
            2;
        const approach = neo.close_approach_data[0];
        return {
            name: neo.name,
            diameter,
            distance: parseFloat(approach.miss_distance.kilometers),
        };
    });

    return (
        <ProtectedRoute>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Compare Selected NEOs</h1>
                {neos.length === 0 ? (
                    <p>No NEOs selected for comparison.</p>
                ) : (
                    <ScatterChart
                        width={800}
                        height={400}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid />
                        <XAxis
                            type="number"
                            dataKey="distance"
                            name="Miss Distance (km)"
                            domain={["auto", "auto"]}
                        />
                        <YAxis type="number" dataKey="diameter" name="Diameter (km)" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter data={chartData} fill="#8884d8" />
                    </ScatterChart>
                )}
            </div>
        </ProtectedRoute>
    );
}
