
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polygon,
  Popup,
  useMap,
} from "react-leaflet";
import { cellToBoundary } from "h3-js";
import "leaflet/dist/leaflet.css";
import "./BroadbandMap.css";
import broadbandData from "../data/atlantaBroadband.json";

const center = [broadbandData.lat, broadbandData.lng];
const hexBoundary = cellToBoundary(broadbandData.h3_hex);

function ResetView() {
  const map = useMap();

  return (
    <button
      type="button"
      className="btn btn-primary btn-sm broadband-reset"
      onClick={() => map.setView(center, 12)}
    >
      Reset view
    </button>
  );
}

export default function BroadbandMap() {
  const [selected, setSelected] = useState(false);
  
  const hexBoundary = cellToBoundary(broadbandData.h3_hex);

  const providers = [...broadbandData.providers].sort(
    (a, b) => b.max_download_mbps - a.max_download_mbps
  );

  const providerCount = new Set(providers.map((p) => p.name)).size;

  return (
    <div className="broadband-layout">
      <div className="broadband-map-wrapper">
        <MapContainer
          center={center}
          zoom={14}
          scrollWheelZoom={false}
          className="broadband-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon
            positions={hexBoundary}
            pathOptions={{
                color: "#2563eb",
                weight: 3,
                fillColor: "#3b82f6",
                fillOpacity: 0.35,
            }}
            eventHandlers={{
                click: () => setSelected(true),
            }}
          />  
          <CircleMarker
            center={center}
            radius={13}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: "#0b5ed7",
              fillOpacity: 0.95,
            }}
            eventHandlers={{
              click: () => setSelected(true),
            }}
          >
            <Popup>
              <strong>Central Atlanta</strong>
              <div>View reported broadband providers.</div>
            </Popup>
          </CircleMarker>

          <ResetView />
        </MapContainer>
      </div>

      <div className="broadband-panel">
        <div className="broadband-panel-heading">
          <h5 className="fw-bold mb-1">Broadband providers</h5>
          <p className="text-muted small mb-0">
            {selected
              ? "Central Atlanta · Selected location"
              : "Click the blue marker to explore"}
          </p>
        </div>

        {selected ? (
          <>
            <div className="broadband-summary">
              <strong>{providerCount}</strong>
              <span>Distinct providers reported</span>
            </div>

            <div className="broadband-provider-list">
              {providers.map((provider, index) => (
                <div
                  className="broadband-provider"
                  key={`${provider.name}-${provider.technology}-${index}`}
                >
                  <div className="d-flex justify-content-between gap-2">
                    <strong>{provider.name}</strong>
                    <span className="badge text-bg-light">
                      {provider.technology}
                    </span>
                  </div>

                  <div className="broadband-speeds">
                    <span>
                      <strong>
                        {provider.max_download_mbps.toLocaleString()}
                      </strong>{" "}
                      Mbps down
                    </span>
                    <span>
                      <strong>
                        {provider.max_upload_mbps.toLocaleString()}
                      </strong>{" "}
                      Mbps up
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="broadband-empty">
            <div className="broadband-empty-icon">⌖</div>
            <h6>Explore local internet options</h6>
            <p className="text-muted small">
              Click the blue marker in central Atlanta to compare
              providers, technologies, and maximum speeds.
            </p>
          </div>
        )}
      </div>

      <p className="broadband-disclaimer">
        Source: Broadband Map API (FCC-derived, provider-reported data).
        This sample represents a geographic cell near central Atlanta,
        not the entire city. Speeds are reported maximums, not measured
        performance. Confirm availability directly with providers.
      </p>
    </div>
  );
}
