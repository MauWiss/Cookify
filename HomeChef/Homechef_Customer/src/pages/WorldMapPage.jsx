import Globe from "react-globe.gl";
import { useEffect, useRef, useState } from "react";
import { fetchRecipesByCountry } from "../api/api";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import * as topojson from "topojson-client";
import Flag from "react-world-flags";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale); // רישום אנגלית

export default function WorldMapPage() {
  const globeEl = useRef();
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dish, setDish] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCountryCode = (countryName) => {
    const code = countries.getAlpha2Code(countryName?.trim(), "en");
    return code || "UN"; // fallback
  };

  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((res) => res.json())
      .then((data) => {
        const features = topojson.feature(
          data,
          data.objects.countries,
        ).features;
        setCountriesData(features);
      });
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ altitude: 2.2 }, 1000);
    }
  }, [countriesData]);

  const handleCountryClick = async (country) => {
    const name = country.properties.name;
    setSelectedCountry(name);
    setIsOpen(true);
    setLoading(true);
    setDish(null);
    try {
      const res = await fetchRecipesByCountry(name);
      setDish(res);
    } catch (err) {
      toast.error("❌ Failed to load national dish.");
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (!globeEl.current) return;
    const current = globeEl.current.pointOfView();
    globeEl.current.pointOfView(
      { altitude: Math.max(0.5, current.altitude - 0.5) },
      500,
    );
  };

  const handleZoomOut = () => {
    if (!globeEl.current) return;
    const current = globeEl.current.pointOfView();
    globeEl.current.pointOfView({ altitude: current.altitude + 0.5 }, 500);
  };

  return (
    <div className="relative h-screen w-full bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Zoom Controls */}
      <div className="absolute left-4 top-4 z-50 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="rounded bg-white p-2 text-black shadow hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          🔍 +
        </button>
        <button
          onClick={handleZoomOut}
          className="rounded bg-white p-2 text-black shadow hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          🔍 −
        </button>
      </div>

      {/* Globe */}
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        polygonsData={countriesData}
        polygonCapColor={() => "rgba(0, 150, 255, 0.25)"}
        polygonSideColor={() => "rgba(0, 100, 255, 0.1)"}
        polygonStrokeColor={() => "#444"}
        polygonLabel={({ properties: d }) => d.name}
        onPolygonClick={handleCountryClick}
      />

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50"
      >
        <div className="flex min-h-screen items-center justify-center bg-black bg-opacity-50 p-4">
          <Dialog.Panel className="w-full max-w-xl rounded-xl bg-white p-6 text-black shadow-xl dark:bg-gray-800 dark:text-white">
            <Dialog.Title className="mb-4 flex items-center justify-center gap-2 text-center text-xl font-bold">
              National Dish of {selectedCountry}
              <Flag
                code={getCountryCode(selectedCountry)}
                style={{ width: 32, height: 20, borderRadius: 3 }}
              />
            </Dialog.Title>

            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : dish ? (
              <div className="text-center">
                <img
                  src={dish.imageUrl}
                  alt={dish.title}
                  className="mb-4 max-h-64 w-full rounded object-cover"
                />
                <h2 className="text-lg font-medium">{dish.title}</h2>
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No dish found.
              </p>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
