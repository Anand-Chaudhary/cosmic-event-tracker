import { NearEarthObject } from "@/types/nasa.types";
import { Calendar, Zap, X, Globe, Orbit, ExternalLink, Ruler } from "lucide-react";

interface NeoDetailProps {
    neo: NearEarthObject | null;
    isOpen: boolean;
    onClose: () => void;
}

// Modal Component for NEO Details
const NeoDetailModal = ({ neo, isOpen, onClose }: NeoDetailProps) => {
  if (!isOpen || !neo) return null;

  const diameter = (neo.estimated_diameter.kilometers.estimated_diameter_min + neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;
  const approach = neo.close_approach_data[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{neo.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">NEO Reference ID:</span>
                  <span className="font-mono text-sm">{neo.neo_reference_id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Absolute Magnitude:</span>
                  <span className="font-mono">{neo.absolute_magnitude_h}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Potentially Hazardous:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    neo.is_potentially_hazardous_asteroid
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Is Sentry Object:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    neo.is_sentry_object
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {neo.is_sentry_object ? 'Yes' : 'No'}
                  </span>
                </div>
                
                {neo.nasa_jpl_url && (
                  <div className="pt-2">
                    <a 
                      href={neo.nasa_jpl_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View on NASA JPL</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Diameter Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Ruler className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Estimated Diameter</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average (km):</span>
                  <span className="font-mono">{diameter.toFixed(3)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Min (km):</span>
                  <span className="font-mono">{neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Max (km):</span>
                  <span className="font-mono">{neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Min (meters):</span>
                  <span className="font-mono">{neo.estimated_diameter.meters.estimated_diameter_min.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Max (meters):</span>
                  <span className="font-mono">{neo.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Min (feet):</span>
                  <span className="font-mono">{neo.estimated_diameter.feet.estimated_diameter_min.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Max (feet):</span>
                  <span className="font-mono">{neo.estimated_diameter.feet.estimated_diameter_max.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Close Approach Data */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold">Close Approach Details</h3>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-mono">{approach.close_approach_date_full}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Epoch:</span>
                  <span className="font-mono">{approach.epoch_date_close_approach}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Orbiting Body:</span>
                  <span className="font-mono">{approach.orbiting_body}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Orbit ID:</span>
                  <span className="font-mono">{approach.orbit_id}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Velocity Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Relative Velocity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {parseFloat(approach.relative_velocity.kilometers_per_second).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">km/s</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {parseFloat(approach.relative_velocity.kilometers_per_hour).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">km/h</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {parseFloat(approach.relative_velocity.miles_per_hour).toFixed(0)}
                </div>
                <div className="text-sm text-gray-600">mph</div>
              </div>
            </div>
          </div>
          
          {/* Miss Distance */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Orbit className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold">Miss Distance</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-red-600">
                  {parseFloat(approach.miss_distance.astronomical).toFixed(4)}
                </div>
                <div className="text-sm text-gray-600">AU</div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {parseFloat(approach.miss_distance.lunar).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Lunar Distance</div>
              </div>
              
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-indigo-600">
                  {parseInt(approach.miss_distance.kilometers).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">km</div>
              </div>
              
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-teal-600">
                  {parseInt(approach.miss_distance.miles).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">miles</div>
              </div>
            </div>
          </div>
          
          {/* Note about orbital data */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Additional orbital data can be fetched using the NEO Reference ID ({neo.neo_reference_id}) 
              via a separate API call to NASA&apos;s NEO API lookup endpoint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeoDetailModal;