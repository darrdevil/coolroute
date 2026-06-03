import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { getShortcuts } from "./services/shortcutService";
import { getBicyclePoints } from "./services/bicycleService";

function MapMover({ startCoords, endCoords }) {
  const map = useMap();

  if (startCoords && endCoords) {
    map.fitBounds([startCoords, endCoords], { padding: [50, 50] });
  }

  return null;
}

const ROUTES = {
  fastest: "Fastest Route",
  coolest: "Coolest Route",
  sheltered: "Most Sheltered Route",
  bicycle: "Bicycle Comfort Route"
};

const knownSingaporePlaces = {
  "the seletar mall": [1.3919, 103.8769],
  "seletar mall": [1.3919, 103.8769],
  "ang mo kio mrt": [1.3699, 103.8496],
  "amk mrt": [1.3699, 103.8496],
  "amk hub": [1.3695, 103.8498],
  "ang mo kio hub": [1.3695, 103.8498],
  "ite college central": [1.3779, 103.8567],
  "ite central": [1.3779, 103.8567],
  "plaza singapura": [1.3006, 103.845],
  "bukit panjang plaza": [1.38, 103.7649],
  "bpp": [1.38, 103.7649],
  "marina bay sands": [1.2834, 103.8607],
  "bishan mrt": [1.3508, 103.8485],
  "junction 8": [1.3509, 103.8487],
  "toa payoh mrt": [1.3327, 103.8476],
  "orchard mrt": [1.304, 103.8318],
  "somerset mrt": [1.3002, 103.8391],
  "dhoby ghaut mrt": [1.2989, 103.846],
  "city hall mrt": [1.2932, 103.852],
  "raffles place mrt": [1.2845, 103.8514],
  "bugis mrt": [1.3006, 103.8559],
  "serangoon mrt": [1.3506, 103.8728],
  "paya lebar mrt": [1.3182, 103.8929],
  "tampines mrt": [1.3533, 103.9451],
  "pasir ris mrt": [1.373, 103.9493],
  "bedok mrt": [1.324, 103.93],
  "clementi mrt": [1.3151, 103.7652],
  "jurong east mrt": [1.3331, 103.7423],
  "woodlands mrt": [1.4369, 103.7865],
  "yishun mrt": [1.4295, 103.835],
  "sengkang mrt": [1.3917, 103.895],
  "punggol mrt": [1.4052, 103.9023],
  "hougang mrt": [1.3713, 103.8923],
  "harbourfront mrt": [1.2655, 103.8215],
  "chinatown mrt": [1.2845, 103.8439],
  "changi airport mrt": [1.3573, 103.9884],
  "bugis junction": [1.2996, 103.8558],
  "ion orchard": [1.304, 103.8318],
  "vivo city": [1.2644, 103.8222],
  "vivocity": [1.2644, 103.8222],
  "suntec city": [1.293, 103.8572],
  "raffles city": [1.2938, 103.8522],
  "nex": [1.3507, 103.8725],
  "jem": [1.3331, 103.7436],
  "westgate": [1.3342, 103.7428],
  "causeway point": [1.4361, 103.7864],
  "northpoint city": [1.4297, 103.8352],
  "waterway point": [1.4061, 103.9023],
  "compass one": [1.3921, 103.8947],
  "hougang mall": [1.3727, 103.893],
  "tampines mall": [1.3527, 103.9447],
  "bedok mall": [1.3247, 103.9298],
  "parkway parade": [1.3013, 103.9051],
  "hillion mall": [1.3785, 103.762],
  "lot one": [1.3851, 103.7443],
  "great world": [1.2938, 103.8319],
  "tiong bahru plaza": [1.2863, 103.827],
  "city square mall": [1.3114, 103.8567],
  "tan tock seng hospital": [1.3214, 103.8459],
  "ttsh": [1.3214, 103.8459],
  "singapore general hospital": [1.2795, 103.834],
  "sgh": [1.2795, 103.834],
  "national university hospital": [1.2931, 103.7832],
  "nuh": [1.2931, 103.7832],
  "nanyang polytechnic": [1.38, 103.849],
  "nyp": [1.38, 103.849],
  "singapore polytechnic": [1.3098, 103.7775],
  "sp": [1.3098, 103.7775],
  "ngee ann polytechnic": [1.333, 103.7745],
  "temasek polytechnic": [1.3456, 103.9327],
  "republic polytechnic": [1.4421, 103.7857],
  "rp": [1.4421, 103.7857],
  "nus": [1.2966, 103.7764],
  "ntu": [1.3483, 103.6831],
  "smu": [1.2966, 103.8502],
  "changi airport": [1.3644, 103.9915],
  "jewel changi airport": [1.3602, 103.9898],
  "gardens by the bay": [1.2816, 103.8636],
  "merlion park": [1.2868, 103.8545],
  "singapore flyer": [1.2893, 103.8631],
  "sentosa": [1.2494, 103.8303],
  "universal studios singapore": [1.254, 103.8238],
  "uss": [1.254, 103.8238],
  "singapore zoo": [1.4043, 103.793],
  "botanic gardens": [1.3138, 103.8159],
  "east coast park": [1.3008, 103.9122],
  "fort canning park": [1.295, 103.845],
  "macritchie reservoir": [1.3448, 103.8224],
  "bukit timah nature reserve": [1.3547, 103.7764]
};

function isValidPoint(point) {
  return (
    Array.isArray(point) &&
    point.length === 2 &&
    Number.isFinite(Number(point[0])) &&
    Number.isFinite(Number(point[1]))
  );
}

function findKnownPlace(query) {
  const lowerQuery = query.trim().toLowerCase();

  if (knownSingaporePlaces[lowerQuery]) {
    return knownSingaporePlaces[lowerQuery];
  }

  const matchedKey = Object.keys(knownSingaporePlaces).find(
    (place) => place.includes(lowerQuery) || lowerQuery.includes(place)
  );

  return matchedKey ? knownSingaporePlaces[matchedKey] : null;
}

function getKnownPlaceSuggestions(query) {
  const lowerQuery = query.trim().toLowerCase();

  return Object.keys(knownSingaporePlaces)
    .filter((place) => place.includes(lowerQuery) || lowerQuery.includes(place))
    .map((place) => ({
      name: `${place} Singapore`,
      lat: knownSingaporePlaces[place][0],
      lon: knownSingaporePlaces[place][1]
    }));
}

function calculateDistanceKm(line) {
  let total = 0;

  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1];
    const b = line[i];
    const radius = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLon = ((b[1] - a[1]) * Math.PI) / 180;
    const lat1 = (a[0] * Math.PI) / 180;
    const lat2 = (b[0] * Math.PI) / 180;
    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    total += radius * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  return total;
}

function pointDistanceKm(a, b) {
  return calculateDistanceKm([a, b]);
}

function distanceFromPointToRouteKm(point, routeLine) {
  if (!isValidPoint(point) || !Array.isArray(routeLine) || routeLine.length === 0) {
    return Infinity;
  }

  return Math.min(...routeLine.map((routePoint) => pointDistanceKm(point, routePoint)));
}

function findReasonableFeature(baseRoute, features, maxDistanceFromRouteKm, maxDetourRatio) {
  if (!baseRoute?.line || !features?.length) return null;

  const startPoint = baseRoute.line[0];
  const endPoint = baseRoute.line[baseRoute.line.length - 1];
  const baseDistance = Number(baseRoute.distanceKm) || calculateDistanceKm(baseRoute.line);

  const candidates = features
    .filter((feature) => isValidPoint(feature.point))
    .map((feature) => {
      const detourLine = [startPoint, feature.point, endPoint];
      const detourDistance = calculateDistanceKm(detourLine);
      const distanceFromRoute = distanceFromPointToRouteKm(feature.point, baseRoute.line);
      return { feature, detourDistance, distanceFromRoute };
    })
    .filter((item) => item.distanceFromRoute <= maxDistanceFromRouteKm)
    .filter((item) => item.detourDistance <= baseDistance * maxDetourRatio)
    .sort((a, b) => a.detourDistance + a.distanceFromRoute - (b.detourDistance + b.distanceFromRoute));

  return candidates.length > 0 ? candidates[0].feature : null;
}

function ScoreRing({ score }) {
  const radius = 42;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255,255,255,0.18)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#00ffcc"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fill="#00ffcc"
          fontSize="22"
          fontWeight="bold"
          dy=".3em"
        >
          {score}
        </text>
        <text x="50%" y="68%" textAnchor="middle" fill="white" fontSize="10">
          /100
        </text>
      </svg>
    </div>
  );
}

export default function App() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [userLiveCoords, setUserLiveCoords] = useState(null);
  const [routes, setRoutes] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(ROUTES.fastest);
  const [selectedStepIndex, setSelectedStepIndex] = useState(null);
  const [selectedBikeSegment, setSelectedBikeSegment] = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [shelterFeatures, setShelterFeatures] = useState([]);
  const [greeneryFeatures, setGreeneryFeatures] = useState([]);
  const [communityShortcuts, setCommunityShortcuts] = useState([]);
  const [activeShortcuts, setActiveShortcuts] = useState([]);
  const [bicyclePoints, setBicyclePoints] = useState([]);
  const [nearbyBikePickup, setNearbyBikePickup] = useState(null);
  const [nearbyBikeReturn, setNearbyBikeReturn] = useState(null);
  const [bikeJourney, setBikeJourney] = useState(null);
  const [showCommunityShortcutRoute, setShowCommunityShortcutRoute] = useState(false);
  const [greeneryPreference, setGreeneryPreference] = useState("Medium");
  const [shelterPreference, setShelterPreference] = useState("Medium");
  const [weatherData, setWeatherData] = useState({
    temp: 33,
    uv: 9,
    rain: 20,
    source: "Prototype default"
  });

  useEffect(() => {
    setCommunityShortcuts(getShortcuts());
    setBicyclePoints(getBicyclePoints());
  }, []);

  const backgrounds = [
    "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80"
  ];
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  function getShortcutCategoryLabel(category) {
    if (category === "fastest") return ROUTES.fastest;
    if (category === "greenery") return ROUTES.coolest;
    if (category === "shelter") return ROUTES.sheltered;
    if (category === "bicycle") return ROUTES.bicycle;
    return "General";
  }

  function getShortcutBenefit(shortcut) {
    if (!shortcut) {
      return {
        main: "Estimated local route improvement",
        sub: "Community knowledge may improve comfort or travel efficiency."
      };
    }

    if (shortcut.category === "fastest") {
      return {
        main: `Estimated time saving: ${shortcut.timeSaving || 2} mins`,
        sub: "Helps reduce unnecessary walking distance."
      };
    }

    if (shortcut.category === "greenery") {
      return {
        main: `Estimated greenery gain: +${shortcut.greeneryGain || 15}%`,
        sub: "Supports a cooler and more pleasant walking experience."
      };
    }

    if (shortcut.category === "shelter") {
      return {
        main: `Estimated shelter gain: +${shortcut.shelterGain || 20}%`,
        sub: "Supports better rain and heat protection."
      };
    }

    return {
      main: "Estimated local route improvement",
      sub: "Community knowledge may improve comfort or travel efficiency."
    };
  }

  function getShortcutRouteCategory(routeTitle) {
    if (routeTitle === ROUTES.fastest) return "fastest";
    if (routeTitle === ROUTES.coolest) return "greenery";
    if (routeTitle === ROUTES.sheltered) return "shelter";
    if (routeTitle === ROUTES.bicycle) return "bicycle";
    return "general";
  }

  function getShortcutsForRoute(routeTitle) {
    const category = getShortcutRouteCategory(routeTitle);
    return activeShortcuts.filter(
      (shortcut) => shortcut.category === category || shortcut.category === "general"
    );
  }

  function getShortcutBonus(routeTitle) {
    return getShortcutsForRoute(routeTitle).length > 0 ? 4 : 0;
  }

  function getBestChoiceRoute() {
    const scoredRoutes = [ROUTES.coolest, ROUTES.fastest, ROUTES.sheltered, ROUTES.bicycle].map((routeTitle) => ({
      title: routeTitle,
      score: getComfortScore(routeTitle)
    }));

    return scoredRoutes.sort((a, b) => b.score - a.score)[0]?.title || ROUTES.fastest;
  }

  function getRouteTag(routeTitle) {
    if (routeTitle === getBestChoiceRoute()) return "Best Choice Today";
    if (routeTitle === ROUTES.fastest) return "Shortest Walking Option";
    if (routeTitle === ROUTES.coolest) return "Greenery-Focused";
    if (routeTitle === ROUTES.sheltered) return "Rain and Heat Protection";
    if (routeTitle === ROUTES.bicycle) return "Sustainable Mobility";
    return "Route Option";
  }

  function getAiRecommendedRoute() {
    const fastestTime = routes[ROUTES.fastest]?.timeMin || 999;

    if (weatherData.rain >= 60 || weatherData.uv >= 8 || weatherData.temp >= 32) {
      return ROUTES.sheltered;
    }

    if (bikeJourney && bikeJourney.totalMin < fastestTime) {
      return ROUTES.bicycle;
    }

    if (getGreenCorridorLevel() === "High" || getGreenCorridorLevel() === "Medium") {
      return ROUTES.coolest;
    }

    return ROUTES.fastest;
  }

  function getAiRecommendationReasons() {
    const recommendedRoute = getAiRecommendedRoute();
    const reasons = [];

    if (recommendedRoute === ROUTES.sheltered) {
      reasons.push(`Temperature is ${weatherData.temp} deg C and UV index is ${weatherData.uv}.`);
      reasons.push(`Shelter need level is ${getShelterNeedLevel()}.`);
      reasons.push(`Estimated shelter coverage is ${getEstimatedShelterCoverage(ROUTES.sheltered)}%.`);
    } else if (recommendedRoute === ROUTES.bicycle) {
      reasons.push("Bicycle option provides faster sustainable first/last-mile travel.");
      if (bikeJourney) reasons.push(`Estimated walk + bicycle journey is ${bikeJourney.totalMin} mins.`);
      reasons.push("This supports lower-carbon active mobility.");
    } else if (recommendedRoute === ROUTES.coolest) {
      reasons.push(`Green corridor level is ${getGreenCorridorLevel()}.`);
      reasons.push(`Estimated greenery exposure is ${getEstimatedGreeneryExposure(ROUTES.coolest)}%.`);
      reasons.push("Weather condition is suitable for a greenery-focused route.");
    } else {
      reasons.push("Weather risk is manageable for a direct walking route.");
      reasons.push("Fastest route gives the shortest practical walking time.");
      reasons.push("Comfort gains from detours are limited for this journey.");
    }

    return reasons;
  }

  function findRelevantShortcuts(startPoint, endPoint, routeType = "general") {
    return communityShortcuts.filter((shortcut) => {
      const shortcutStart =
        shortcut.start ||
        shortcut.entryPoint ||
        (Array.isArray(shortcut.shortcutLine) ? shortcut.shortcutLine[0] : null);

      const shortcutEnd =
        shortcut.end ||
        shortcut.exitPoint ||
        (Array.isArray(shortcut.shortcutLine)
          ? shortcut.shortcutLine[shortcut.shortcutLine.length - 1]
          : null);

      if (!isValidPoint(shortcutStart) || !isValidPoint(shortcutEnd)) return false;

      const nearStart =
        pointDistanceKm(shortcutStart, startPoint) <= 1.2 ||
        pointDistanceKm(shortcutEnd, startPoint) <= 1.2;
      const nearEnd =
        pointDistanceKm(shortcutStart, endPoint) <= 1.2 ||
        pointDistanceKm(shortcutEnd, endPoint) <= 1.2;
      const categoryMatch = shortcut.category === routeType || shortcut.category === "general";

      return categoryMatch && (nearStart || nearEnd);
    });
  }

  function findNearestBicyclePoint(point) {
    if (!isValidPoint(point) || bicyclePoints.length === 0) return null;

    return bicyclePoints
      .map((bikePoint) => ({
        ...bikePoint,
        distanceKm: pointDistanceKm(point, bikePoint.location)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)[0];
  }

  function getWalkTimeToBikePoint(bikePoint) {
    if (!bikePoint) return "-";
    return `${Math.max(1, Math.round((bikePoint.distanceKm / 5) * 60))} mins walk`;
  }

  async function buildBikeJourney(startPoint, endPoint, pickupPoint, returnPoint) {
    if (!pickupPoint || !returnPoint) return null;

    const walkToPickupKm = pointDistanceKm(startPoint, pickupPoint.location);
    const walkFromReturnKm = pointDistanceKm(returnPoint.location, endPoint);

    let cyclingRoute = await fetchOsrmRouteThroughPoints(
      [pickupPoint.location, returnPoint.location],
      "bike",
      "cycle"
    );

    if (!cyclingRoute) {
      cyclingRoute = await fetchOsrmRouteThroughPoints(
        [pickupPoint.location, returnPoint.location],
        "foot",
        "cycle"
      );
    }

    const cycleKm = cyclingRoute ? Number(cyclingRoute.distanceKm) : pointDistanceKm(pickupPoint.location, returnPoint.location);

    const walkToPickupMin = Math.max(1, Math.round((walkToPickupKm / 5) * 60));
    const cycleMin = cyclingRoute ? cyclingRoute.timeMin : Math.max(1, Math.round((cycleKm / 15) * 60));
    const walkFromReturnMin = Math.max(1, Math.round((walkFromReturnKm / 5) * 60));

    return {
      pickupPoint,
      returnPoint,
      walkToPickupKm,
      cycleKm,
      walkFromReturnKm,
      walkToPickupMin,
      cycleMin,
      walkFromReturnMin,
      totalMin: walkToPickupMin + cycleMin + walkFromReturnMin,
      walkToPickupLine: [startPoint, pickupPoint.location],
      cycleLine: cyclingRoute ? cyclingRoute.line : [pickupPoint.location, returnPoint.location],
      walkFromReturnLine: [returnPoint.location, endPoint],
      cycleSteps: cyclingRoute ? cyclingRoute.steps : [],
      cycleRouteType: cyclingRoute ? "Routed cycling segment" : "Estimated direct cycling segment"
    };
  }

  function getPreferenceSettings(type) {
    const preference = type === "greenery" ? greeneryPreference : shelterPreference;

    if (preference === "Low") {
      return {
        routeDistanceKm: type === "greenery" ? 0.2 : 0.25,
        detourRatio: type === "greenery" ? 1.05 : 1.08,
        label: "Low preference: prioritises shorter walking time."
      };
    }

    if (preference === "High") {
      return {
        routeDistanceKm: type === "greenery" ? 0.6 : 0.7,
        detourRatio: type === "greenery" ? 1.3 : 1.35,
        label: "High preference: accepts a longer walk for more comfort."
      };
    }

    return {
      routeDistanceKm: type === "greenery" ? 0.35 : 0.45,
      detourRatio: type === "greenery" ? 1.15 : 1.2,
      label: "Medium preference: balances comfort and travel time."
    };
  }

  function getShelterNeedLevel() {
    if (weatherData.rain >= 70 || weatherData.uv >= 9 || weatherData.temp >= 33) return "High";
    if (weatherData.rain >= 40 || weatherData.uv >= 6 || weatherData.temp >= 31) return "Medium";
    return "Low";
  }

  function getShelterStrengthScore() {
    let score = 0;

    shelterFeatures.forEach((feature) => {
      const tags = feature.tags || {};

      if (tags.covered === "yes") score += 5;
      else if (tags.roof === "yes") score += 5;
      else if (tags.indoor === "yes") score += 4;
      else if (tags.highway === "corridor") score += 4;
      else if (tags.tunnel === "yes") score += 3;
      else if (tags.amenity === "bus_station") score += 2;
      else if (tags.public_transport === "station") score += 2;
      else score += 1;
    });

    return Math.min(score, 24);
  }

  function getShelterInfrastructureLevel() {
    const strength = getShelterStrengthScore();
    if (strength >= 18) return "High";
    if (strength >= 8) return "Medium";
    if (strength >= 1) return "Low";
    return "None detected";
  }

  function getOsmShelterBonus() {
    const level = getShelterInfrastructureLevel();
    if (level === "High") return 10;
    if (level === "Medium") return 6;
    if (level === "Low") return 3;
    return 0;
  }

  function getShelterExplanation(routeTitle) {
    const level = getShelterInfrastructureLevel();

    if (level === "High") {
      return routeTitle === ROUTES.sheltered
        ? "Strong sheltered infrastructure detected nearby. This route receives the highest rain and heat protection weighting."
        : "Strong shelter exists nearby, but this route does not fully prioritise shelter protection.";
    }

    if (level === "Medium") return "Moderate sheltered infrastructure detected nearby. Shelter contributes meaningfully to comfort.";
    if (level === "Low") return "Some shelter-related features detected nearby. Shelter provides a small comfort bonus.";
    return "No explicit shelter tags detected nearby. The app uses weather-based shelter estimation.";
  }

  function getGreeneryStrengthScore() {
    let score = 0;

    greeneryFeatures.forEach((feature) => {
      const tags = feature.tags || {};

      if (tags.leisure === "park") score += 4;
      else if (tags.leisure === "garden") score += 3;
      else if (tags.leisure === "nature_reserve") score += 5;
      else if (tags.landuse === "forest") score += 5;
      else if (tags.landuse === "grass") score += 2;
      else if (tags.natural === "wood") score += 5;
      else if (tags.natural === "grassland") score += 3;
      else score += 1;
    });

    return Math.min(score, 20);
  }

  function getGreenCorridorLevel() {
    const strength = getGreeneryStrengthScore();
    if (strength >= 15) return "High";
    if (strength >= 7) return "Medium";
    if (strength >= 1) return "Low";
    return "None detected";
  }

  function getGreeneryBonus() {
    const level = getGreenCorridorLevel();
    if (level === "High") return 8;
    if (level === "Medium") return 5;
    if (level === "Low") return 3;
    return 0;
  }

  function getGreeneryScore(routeTitle) {
    const bonus = getGreeneryBonus();

    if (routeTitle === ROUTES.coolest) return Math.min(20, 14 + bonus);
    if (routeTitle === ROUTES.sheltered) return Math.min(20, 10 + Math.round(bonus / 2));
    return Math.min(20, 8 + Math.round(bonus / 3));
  }

  function getEstimatedGreeneryExposure(routeTitle) {
    const bonus = getGreeneryBonus();
    const level = getGreenCorridorLevel();
    let base = routeTitle === ROUTES.coolest ? 55 : routeTitle === ROUTES.sheltered ? 42 : 35;

    if (level === "High") base += 20;
    else if (level === "Medium") base += 12;
    else if (level === "Low") base += 6;

    return Math.min(95, base + bonus * 2);
  }

  function getGreenCorridorExplanation(routeTitle) {
    const level = getGreenCorridorLevel();

    if (level === "High") {
      return routeTitle === ROUTES.coolest
        ? "Strong green corridor detected nearby. This route receives a higher cooling and comfort score."
        : "Strong greenery exists nearby, but this route does not fully prioritise green corridor comfort.";
    }

    if (level === "Medium") return "Moderate greenery detected nearby. Greenery contributes to the comfort score.";
    if (level === "Low") return "Some greenery detected nearby. Greenery provides a small comfort bonus.";
    return "No major greenery detected nearby. The app uses baseline greenery estimation.";
  }

  function getEstimatedShelterCoverage(routeTitle) {
    const shelterNeed = getShelterNeedLevel();
    const osmBonus = getOsmShelterBonus();
    let baseCoverage = 0;

    if (routeTitle === ROUTES.sheltered) baseCoverage = shelterNeed === "High" ? 82 : shelterNeed === "Medium" ? 76 : 68;
    else if (routeTitle === ROUTES.coolest) baseCoverage = shelterNeed === "High" ? 60 : shelterNeed === "Medium" ? 56 : 50;
    else baseCoverage = shelterNeed === "High" ? 34 : shelterNeed === "Medium" ? 40 : 46;

    return Math.min(95, baseCoverage + osmBonus);
  }

  function getShelterScore(routeTitle) {
    return Math.round((getEstimatedShelterCoverage(routeTitle) / 100) * 40);
  }

  async function fetchSuggestions(query, type) {
    if (query.length < 2 || query === "My Current Location") {
      type === "start" ? setStartSuggestions([]) : setEndSuggestions([]);
      return;
    }

    const knownMatches = getKnownPlaceSuggestions(query);
    type === "start" ? setStartSuggestions(knownMatches) : setEndSuggestions(knownMatches);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Singapore")}&countrycodes=sg&limit=5`
      );
      const data = await response.json();
      const osmSuggestions = data.map((item) => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon)
      }));
      const suggestions = [...knownMatches, ...osmSuggestions].slice(0, 5);
      type === "start" ? setStartSuggestions(suggestions) : setEndSuggestions(suggestions);
    } catch (error) {
      console.error(error);
      type === "start" ? setStartSuggestions(knownMatches) : setEndSuggestions(knownMatches);
    }
  }

  function selectSuggestion(suggestion, type) {
    if (type === "start") {
      setStart(suggestion.name);
      setStartCoords([suggestion.lat, suggestion.lon]);
      setStartSuggestions([]);
    } else {
      setEnd(suggestion.name);
      setEndCoords([suggestion.lat, suggestion.lon]);
      setEndSuggestions([]);
    }
  }

  async function fetchWeather(coords) {
    try {
      const [lat, lon] = coords;
      const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m&hourly=uv_index,precipitation_probability&timezone=Asia%2FSingapore`;
      const response = await fetch(url);
      const data = await response.json();
      const currentTemp = Math.round(data.current.temperature_2m);
      const currentHour = new Date().toISOString().slice(0, 13);
      let index = data.hourly.time.findIndex((t) => t.startsWith(currentHour));
      if (index < 0) index = 0;
      setWeatherData({
        temp: currentTemp,
        uv: Math.round(data.hourly.uv_index[index] || 0),
        rain: Math.round(data.hourly.precipitation_probability[index] || 0),
        source: "Open-Meteo live weather"
      });
    } catch {
      setWeatherData({ temp: 33, uv: 9, rain: 20, source: "Fallback weather" });
    }
  }

  async function fetchShelterFeatures(startPoint, endPoint) {
    try {
      const south = Math.min(startPoint[0], endPoint[0]) - 0.01;
      const north = Math.max(startPoint[0], endPoint[0]) + 0.01;
      const west = Math.min(startPoint[1], endPoint[1]) - 0.01;
      const east = Math.max(startPoint[1], endPoint[1]) + 0.01;
      const query = `
        [out:json][timeout:25];
        (
          way["covered"="yes"](${south},${west},${north},${east});
          way["roof"="yes"](${south},${west},${north},${east});
          way["tunnel"="yes"](${south},${west},${north},${east});
          way["indoor"="yes"](${south},${west},${north},${east});
          way["highway"="corridor"](${south},${west},${north},${east});
          way["building"="roof"](${south},${west},${north},${east});
          way["amenity"="bus_station"](${south},${west},${north},${east});
          way["public_transport"="station"](${south},${west},${north},${east});
          way["railway"="station"](${south},${west},${north},${east});
          node["railway"="subway_entrance"](${south},${west},${north},${east});
        );
        out tags center 20;
      `;
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
      });
      const data = await response.json();
      const features = (data.elements || [])
        .map((item, index) => ({
          id: item.id || index,
          name:
            item.tags?.name ||
            item.tags?.highway ||
            item.tags?.covered ||
            item.tags?.roof ||
            item.tags?.tunnel ||
            item.tags?.amenity ||
            item.tags?.railway ||
            "Possible sheltered feature",
          tags: item.tags || {},
          point: item.center ? [item.center.lat, item.center.lon] : null
        }))
        .filter((item) => isValidPoint(item.point))
        .slice(0, 20);
      setShelterFeatures(features);
      return features;
    } catch (error) {
      console.error(error);
      setShelterFeatures([]);
      return [];
    }
  }

  async function fetchGreeneryFeatures(startPoint, endPoint) {
    try {
      const south = Math.min(startPoint[0], endPoint[0]) - 0.015;
      const north = Math.max(startPoint[0], endPoint[0]) + 0.015;
      const west = Math.min(startPoint[1], endPoint[1]) - 0.015;
      const east = Math.max(startPoint[1], endPoint[1]) + 0.015;
      const query = `
        [out:json][timeout:25];
        (
          way["leisure"="park"](${south},${west},${north},${east});
          relation["leisure"="park"](${south},${west},${north},${east});
          way["leisure"="garden"](${south},${west},${north},${east});
          relation["leisure"="garden"](${south},${west},${north},${east});
          way["landuse"="grass"](${south},${west},${north},${east});
          way["landuse"="forest"](${south},${west},${north},${east});
          relation["landuse"="forest"](${south},${west},${north},${east});
          way["natural"="wood"](${south},${west},${north},${east});
          relation["natural"="wood"](${south},${west},${north},${east});
          way["natural"="grassland"](${south},${west},${north},${east});
          way["leisure"="nature_reserve"](${south},${west},${north},${east});
          relation["leisure"="nature_reserve"](${south},${west},${north},${east});
          way["highway"="cycleway"]["name"~"Park|Connector|PCN",i](${south},${west},${north},${east});
          way["highway"="footway"]["name"~"Park|Connector|PCN",i](${south},${west},${north},${east});
        );
        out tags center 30;
      `;
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query
      });
      const data = await response.json();
      const features = (data.elements || [])
        .map((item, index) => ({
          id: item.id || index,
          name:
            item.tags?.name ||
            item.tags?.leisure ||
            item.tags?.landuse ||
            item.tags?.natural ||
            item.tags?.highway ||
            "Nearby greenery feature",
          tags: item.tags || {},
          point: item.center ? [item.center.lat, item.center.lon] : null
        }))
        .filter((item) => isValidPoint(item.point))
        .slice(0, 25);
      setGreeneryFeatures(features);
      return features;
    } catch (error) {
      console.error(error);
      setGreeneryFeatures([]);
      return [];
    }
  }

  function getRealisticWalkingTime(distanceKm) {
    return Math.round((distanceKm / 5) * 60);
  }

  function getRealisticCyclingTime(distanceKm) {
    return Math.round((distanceKm / 15) * 60);
  }

  function calculateWeatherScore() {
    const tempScore = weatherData.temp <= 28 ? 10 : weatherData.temp <= 31 ? 7 : 4;
    const uvScore = weatherData.uv <= 3 ? 10 : weatherData.uv <= 6 ? 7 : 3;
    const rainScore = weatherData.rain <= 30 ? 10 : weatherData.rain <= 60 ? 6 : 3;
    return Math.round(((tempScore + uvScore + rainScore) / 30) * 30);
  }

  function getRouteProfile(routeTitle) {
    const shelterNeed = getShelterNeedLevel();
    const shelterCoverage = getEstimatedShelterCoverage(routeTitle);
    const greeneryExposure = getEstimatedGreeneryExposure(routeTitle);

    if (routeTitle === ROUTES.coolest) {
      return {
        shelter: getShelterScore(routeTitle),
        greenery: getGreeneryScore(routeTitle),
        distance: 7,
        shelterCoverage,
        shelterNeed,
        shelterInfrastructureLevel: getShelterInfrastructureLevel(),
        shelterExplanation: getShelterExplanation(routeTitle),
        greeneryExposure,
        greenCorridorLevel: getGreenCorridorLevel(),
        greenCorridorExplanation: getGreenCorridorExplanation(routeTitle),
        explanation: "Prioritises greenery and lower heat exposure. It may accept a small detour depending on the selected greenery preference."
      };
    }

    if (routeTitle === ROUTES.sheltered) {
      return {
        shelter: getShelterScore(routeTitle),
        greenery: getGreeneryScore(routeTitle),
        distance: 6,
        shelterCoverage,
        shelterNeed,
        shelterInfrastructureLevel: getShelterInfrastructureLevel(),
        shelterExplanation: getShelterExplanation(routeTitle),
        greeneryExposure,
        greenCorridorLevel: getGreenCorridorLevel(),
        greenCorridorExplanation: getGreenCorridorExplanation(routeTitle),
        explanation: "Prioritises shelter protection. It may accept a small detour depending on the selected shelter preference."
      };
    }

    if (routeTitle === ROUTES.bicycle) {
      return {
        shelter: Math.round(getShelterScore(routeTitle) * 0.7),
        greenery: Math.min(20, getGreeneryScore(routeTitle) + 2),
        distance: 12,
        shelterCoverage: Math.max(35, Math.round(shelterCoverage * 0.75)),
        shelterNeed,
        shelterInfrastructureLevel: getShelterInfrastructureLevel(),
        shelterExplanation: "Cycling route considers weather comfort, but shelter protection may be lower than walking through covered paths.",
        greeneryExposure: Math.min(95, greeneryExposure + 10),
        greenCorridorLevel: getGreenCorridorLevel(),
        greenCorridorExplanation: "Cycling mode benefits from greener corridors and park connectors where available.",
        explanation: "Estimates a sustainable cycling option with shorter travel time and higher active-mobility benefit."
      };
    }

    return {
      shelter: getShelterScore(routeTitle),
      greenery: getGreeneryScore(routeTitle),
      distance: 10,
      shelterCoverage,
      shelterNeed,
      shelterInfrastructureLevel: getShelterInfrastructureLevel(),
      shelterExplanation: getShelterExplanation(routeTitle),
      greeneryExposure,
      greenCorridorLevel: getGreenCorridorLevel(),
      greenCorridorExplanation: getGreenCorridorExplanation(routeTitle),
      explanation: "Prioritises shortest practical walking time using the real walking route."
    };
  }

  function getComfortScore(routeTitle) {
    const profile = getRouteProfile(routeTitle);
    return Math.min(
      100,
      profile.shelter + calculateWeatherScore() + profile.greenery + profile.distance + getShortcutBonus(routeTitle)
    );
  }

  function getRouteColor(routeTitle) {
    if (routeTitle === ROUTES.coolest) return "#00ff66";
    if (routeTitle === ROUTES.sheltered) return "#ffb703";
    if (routeTitle === ROUTES.bicycle) return "#8a5cf6";
    return "#2d9cdb";
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Current location is not supported by this browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setStartCoords(coords);
        setUserLiveCoords(coords);
        setStart("My Current Location");
        setStartSuggestions([]);
        setLoading(false);
      },
      () => {
        alert("Unable to get your current location.");
        setLoading(false);
      }
    );
  }

  function showUserLiveLocation() {
    if (!navigator.geolocation) {
      alert("Current location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setUserLiveCoords(coords);
      },
      () => {
        alert("Unable to get your current location.");
      }
    );
  }

  async function searchLocation(query, existingCoords) {
    if (query === "My Current Location" && startCoords) return startCoords;
    if (existingCoords && isValidPoint(existingCoords)) return existingCoords;

    const knownPlace = findKnownPlace(query);
    if (knownPlace) return knownPlace;

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", Singapore")}&countrycodes=sg&limit=1`
    );
    const data = await response.json();
    if (data.length === 0) return null;

    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }

  function buildInstruction(step) {
    const type = step.maneuver.type;
    const modifier = step.maneuver.modifier;
    const road = step.name || "the path";

    if (type === "depart") return `Start on ${road}`;
    if (type === "arrive") return "Arrive at destination";
    if (modifier) return `${type} ${modifier} onto ${road}`;
    return `${type} onto ${road}`;
  }

  function convertOsrmRoute(route, mode = "walk") {
    const line = route.geometry.coordinates.map((coord) => [coord[1], coord[0]]);
    const steps = route.legs.flatMap((leg) =>
      leg.steps.map((step) => ({
        instruction: buildInstruction(step),
        distance: step.distance,
        line: step.geometry?.coordinates
          ? step.geometry.coordinates.map((coord) => [coord[1], coord[0]])
          : []
      }))
    );
    const routeDistance = route.distance / 1000;

    return {
      line,
      distanceKm: routeDistance.toFixed(2),
      timeMin: mode === "cycle" ? getRealisticCyclingTime(routeDistance) : getRealisticWalkingTime(routeDistance),
      mode,
      steps,
      dataDriven: true
    };
  }

  async function fetchOsrmRouteThroughPoints(points, profile = "foot", mode = "walk") {
    const coordinateString = points.map((point) => `${point[1]},${point[0]}`).join(";");
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${profile}/${coordinateString}?overview=full&geometries=geojson&steps=true`
    );
    const data = await response.json();
    if (!data.routes || data.routes.length === 0) return null;
    return convertOsrmRoute(data.routes[0], mode);
  }

  async function createDifferentiatedRoute(baseRoute, routeType, shelterList = [], greeneryList = []) {
    const startPoint = baseRoute.line[0];
    const endPoint = baseRoute.line[baseRoute.line.length - 1];

    if (routeType === "coolest") {
      const greenerySetting = getPreferenceSettings("greenery");
      const greenFeature = findReasonableFeature(
        baseRoute,
        greeneryList,
        greenerySetting.routeDistanceKm,
        greenerySetting.detourRatio
      );

      if (greenFeature) {
        const routedPath = await fetchOsrmRouteThroughPoints([startPoint, greenFeature.point, endPoint]);
        if (routedPath && Number(routedPath.distanceKm) <= Number(baseRoute.distanceKm) * greenerySetting.detourRatio) {
          return { ...routedPath, dataDriven: true, waypointName: greenFeature.name };
        }
      }
    }

    if (routeType === "sheltered") {
      const shelterSetting = getPreferenceSettings("shelter");
      const shelterFeature = findReasonableFeature(
        baseRoute,
        shelterList,
        shelterSetting.routeDistanceKm,
        shelterSetting.detourRatio
      );

      if (shelterFeature) {
        const routedPath = await fetchOsrmRouteThroughPoints([startPoint, shelterFeature.point, endPoint]);
        if (routedPath && Number(routedPath.distanceKm) <= Number(baseRoute.distanceKm) * shelterSetting.detourRatio) {
          return { ...routedPath, dataDriven: true, waypointName: shelterFeature.name };
        }
      }
    }

    return { ...baseRoute, dataDriven: false };
  }

  async function getRouteOptions(startPoint, endPoint, shelterList = [], greeneryList = []) {
    const fastestRoute = await fetchOsrmRouteThroughPoints([startPoint, endPoint], "foot", "walk");
    if (!fastestRoute) return null;

    let bicycleRoute = await fetchOsrmRouteThroughPoints([startPoint, endPoint], "bike", "cycle");
    if (!bicycleRoute) {
      bicycleRoute = {
        ...fastestRoute,
        timeMin: getRealisticCyclingTime(Number(fastestRoute.distanceKm)),
        mode: "cycle",
        dataDriven: false
      };
    }

    return {
      [ROUTES.fastest]: fastestRoute,
      [ROUTES.coolest]: await createDifferentiatedRoute(fastestRoute, "coolest", shelterList, greeneryList),
      [ROUTES.sheltered]: await createDifferentiatedRoute(fastestRoute, "sheltered", shelterList, greeneryList),
      [ROUTES.bicycle]: bicycleRoute
    };
  }

  async function handleFindRoute() {
    if (!start || !end) {
      alert("Please enter both start and destination.");
      return;
    }

    setLoading(true);
    setLoadingStage("Checking locations...");

    try {
      const foundStart = await searchLocation(start, startCoords);
      const foundEnd = await searchLocation(end, endCoords);

      if (!foundStart || !foundEnd) {
        alert("Could not find one of the locations. Try selecting from suggestions.");
        setLoading(false);
        setLoadingStage("");
        return;
      }

      const midpoint = [(foundStart[0] + foundEnd[0]) / 2, (foundStart[1] + foundEnd[1]) / 2];
      setLoadingStage("Fetching live weather...");
      await fetchWeather(midpoint);

      setLoadingStage("Checking shelter signals...");
      const detectedShelter = await fetchShelterFeatures(foundStart, foundEnd);

      setLoadingStage("Detecting green corridors...");
      const detectedGreenery = await fetchGreeneryFeatures(foundStart, foundEnd);

      const relevantShortcuts = [
        ...findRelevantShortcuts(foundStart, foundEnd, "fastest"),
        ...findRelevantShortcuts(foundStart, foundEnd, "greenery"),
        ...findRelevantShortcuts(foundStart, foundEnd, "shelter"),
        ...findRelevantShortcuts(foundStart, foundEnd, "bicycle"),
        ...findRelevantShortcuts(foundStart, foundEnd, "general")
      ];
      setActiveShortcuts(relevantShortcuts);

      const pickupPoint = findNearestBicyclePoint(foundStart);
      const returnPoint = findNearestBicyclePoint(foundEnd);
      setNearbyBikePickup(pickupPoint);
      setNearbyBikeReturn(returnPoint);
      setLoadingStage("Building walk and bicycle journey...");
      const bicycleJourney = await buildBikeJourney(foundStart, foundEnd, pickupPoint, returnPoint);
      setBikeJourney(bicycleJourney);

      setLoadingStage("Generating route options...");
      const routeOptions = await getRouteOptions(foundStart, foundEnd, detectedShelter, detectedGreenery);

      if (!routeOptions) {
        alert("Could not generate walking routes.");
        setLoading(false);
        setLoadingStage("");
        return;
      }

      setStartCoords(foundStart);
      setEndCoords(foundEnd);
      setRoutes(routeOptions);
      setSelectedRoute(ROUTES.fastest);
      setSelectedStepIndex(null);
      setSelectedBikeSegment(null);
      setShowCommunityShortcutRoute(false);
      setShowResults(true);
    } catch (error) {
      alert("Something went wrong while finding the route.");
      console.error(error);
    }

    setLoading(false);
    setLoadingStage("");
  }

  const routeOptions = [ROUTES.coolest, ROUTES.fastest, ROUTES.sheltered, ROUTES.bicycle].map((title) => {
    const route = routes[title];
    const profile = getRouteProfile(title);

    return {
      title,
      score: getComfortScore(title),
      time: route ? `${route.timeMin} mins` : "-",
      distance: route ? `${route.distanceKm} km` : "-",
      desc: profile.explanation,
      shelterCoverage: profile.shelterCoverage,
      shelterInfrastructureLevel: profile.shelterInfrastructureLevel,
      greeneryExposure: profile.greeneryExposure,
      greenCorridorLevel: profile.greenCorridorLevel,
      dataDriven: route?.dataDriven
    };
  });

  const selectedData = routes[selectedRoute];
  const selectedProfile = getRouteProfile(selectedRoute);

  function getNearestRouteIndex(line, point) {
    if (!Array.isArray(line) || line.length === 0 || !isValidPoint(point)) return 0;

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    line.forEach((routePoint, index) => {
      const distance = pointDistanceKm(routePoint, point);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }

  function getCommunityShortcutSegments(shortcut) {
    const shortcutLine = shortcut.shortcutLine || [shortcut.start, shortcut.end];
    const entryPoint = shortcut.entryPoint || shortcutLine[0] || shortcut.start;
    const exitPoint = shortcut.exitPoint || shortcutLine[shortcutLine.length - 1] || shortcut.end;

    if (!isValidPoint(entryPoint) || !isValidPoint(exitPoint)) {
      return { beforeLine: [], shortcutLine: [], afterLine: [] };
    }

    const normalLine = selectedData?.line || [];

    if (normalLine.length < 2) {
      return {
        beforeLine: startCoords ? [startCoords, entryPoint] : [],
        shortcutLine,
        afterLine: endCoords ? [exitPoint, endCoords] : []
      };
    }

    const entryIndex = getNearestRouteIndex(normalLine, entryPoint);
    const exitIndex = getNearestRouteIndex(normalLine, exitPoint);
    const firstIndex = Math.min(entryIndex, exitIndex);
    const secondIndex = Math.max(entryIndex, exitIndex);

    const beforeLine = [...normalLine.slice(0, firstIndex + 1), entryPoint];
    const afterLine = [exitPoint, ...normalLine.slice(secondIndex)];

    return { beforeLine, shortcutLine, afterLine };
  }


  function getDirectionTexts() {
    if (selectedRoute === ROUTES.bicycle && bikeJourney) {
      return [
        `Walk from start to ${bikeJourney.pickupPoint.name}.`,
        `Rent a bicycle and cycle to ${bikeJourney.returnPoint.name}.`,
        "Return the bicycle and walk to destination."
      ];
    }

    if (selectedRoute === ROUTES.fastest && showCommunityShortcutRoute) {
      return [
        "Walk from the start point toward the community shortcut entry.",
        "Follow the user-defined community shortcut through the neighbourhood pedestrian path.",
        "Continue along the remaining path toward the destination.",
        "Arrive at destination."
      ];
    }

    return selectedData?.steps?.slice(0, 8).map(
      (step, index) => `Step ${index + 1}. ${step.instruction}. Continue for ${Math.round(step.distance)} metres.`
    ) || [];
  }

  function speakDirections() {
    if (!("speechSynthesis" in window)) {
      alert("Voice output is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const directionText = getDirectionTexts().join(" ");

    if (!directionText) {
      alert("No directions available to read yet.");
      return;
    }

    const speech = new SpeechSynthesisUtterance(directionText);
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  return (
    <div style={{ backgroundImage: `url('${randomBg}')`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "100vh", fontFamily: "Arial", color: "white" }}>
      <div style={overlayStyle}>
        {!showResults ? (
          <>
            <h1 style={{ color: "white", textAlign: "center" }}>CoolRoute</h1>
            <p style={{ color: "white", textAlign: "center" }}>AI-Powered Sustainable Comfort Route Planner</p>

            <div style={cardStyle}>
              <button onClick={useCurrentLocation} style={{ ...buttonStyle, backgroundColor: "#2d9cdb", marginBottom: "12px" }}>
                Use My Current Location
              </button>

              <div style={{ position: "relative" }}>
                <input
                  placeholder="Start location, e.g. Ang Mo Kio MRT"
                  value={start}
                  onChange={(e) => {
                    setStart(e.target.value);
                    setStartCoords(null);
                    fetchSuggestions(e.target.value, "start");
                  }}
                  style={inputStyle}
                />
                {startSuggestions.length > 0 && (
                  <div style={suggestionBoxStyle}>
                    {startSuggestions.map((s, index) => (
                      <div key={index} onClick={() => selectSuggestion(s, "start")} style={suggestionItemStyle}>
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <input
                  placeholder="Destination, e.g. Plaza Singapura"
                  value={end}
                  onChange={(e) => {
                    setEnd(e.target.value);
                    setEndCoords(null);
                    fetchSuggestions(e.target.value, "end");
                  }}
                  style={inputStyle}
                />
                {endSuggestions.length > 0 && (
                  <div style={suggestionBoxStyle}>
                    {endSuggestions.map((s, index) => (
                      <div key={index} onClick={() => selectSuggestion(s, "end")} style={suggestionItemStyle}>
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleFindRoute} style={buttonStyle}>
                {loading ? "Finding routes..." : "Find Cool Route"}
              </button>
              {loadingStage && <p style={{ color: "#00ffcc", textAlign: "center", fontWeight: "bold" }}>{loadingStage}</p>}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setShowResults(false)} style={{ ...buttonStyle, maxWidth: "220px", marginBottom: "15px" }}>
              Back to Search
            </button>

            <h1 style={{ color: "white", textAlign: "center" }}>CoolRoute Results</h1>
            <p style={{ color: "white", textAlign: "center" }}>
              From <b>{start}</b> to <b>{end}</b>
            </p>
            <div style={weatherBoxStyle}>
              <h2 style={{ color: "#00ffcc" }}>Weather Context</h2>
              <p>Temperature: {weatherData.temp} deg C</p>
              <p>UV Index: {weatherData.uv}</p>
              <p>Rain Probability: {weatherData.rain}%</p>
              <p>Shelter Need Level: {selectedProfile.shelterNeed}</p>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Source: {weatherData.source}</p>
            </div>

            <div style={aiRecommendationBoxStyle}>
              <h2 style={{ color: "#00ffcc" }}>AI Recommended Route</h2>
              <h3 style={{ marginTop: 0 }}>{getAiRecommendedRoute()}</h3>
              <p style={{ color: "#00ffcc", fontWeight: "bold" }}>
                Comfort Score: {getComfortScore(getAiRecommendedRoute())}/100
              </p>
              <ul style={{ textAlign: "left", marginBottom: 0 }}>
                {getAiRecommendationReasons().map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>

            {(nearbyBikePickup || nearbyBikeReturn) && (
              <div style={bicycleBoxStyle}>
                <h2 style={{ color: "#8a5cf6" }}>Bicycle Rental Locations</h2>
                <p>This prototype estimates nearby bicycle pickup and return points for sustainable first/last-mile travel.</p>

                <div style={bikeGridStyle}>
                  <div style={bikeCardStyle}>
                    <b>Nearest Pick-Up Point</b>
                    <p>{nearbyBikePickup ? nearbyBikePickup.name : "No nearby point found"}</p>
                    {nearbyBikePickup && <p>{getWalkTimeToBikePoint(nearbyBikePickup)} from start</p>}
                    {nearbyBikePickup && <p>Type: {nearbyBikePickup.type}</p>}
                  </div>

                  <div style={bikeCardStyle}>
                    <b>Nearest Return Point</b>
                    <p>{nearbyBikeReturn ? nearbyBikeReturn.name : "No nearby point found"}</p>
                    {nearbyBikeReturn && <p>{getWalkTimeToBikePoint(nearbyBikeReturn)} from destination</p>}
                    {nearbyBikeReturn && <p>Type: {nearbyBikeReturn.type}</p>}
                  </div>
                </div>

              </div>
            )}

            <div style={comparisonBoxStyle}>
              <h2 style={{ color: "#00ffcc" }}>Route Comparison</h2>
              <table style={comparisonTableStyle}>
                <thead>
                  <tr>
                    <th style={tableCellStyle}>Route</th>
                    <th style={tableCellStyle}>Score</th>
                    <th style={tableCellStyle}>Time</th>
                    <th style={tableCellStyle}>Distance</th>
                    <th style={tableCellStyle}>Shelter</th>
                    <th style={tableCellStyle}>Greenery</th>
                    <th style={tableCellStyle}>Path Type</th>
                    <th style={tableCellStyle}>Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {routeOptions.map((route, index) => (
                    <tr key={index}>
                      <td style={tableCellStyle}>{route.title}</td>
                      <td style={tableCellStyle}>{route.score}/100</td>
                      <td style={tableCellStyle}>{route.time}</td>
                      <td style={tableCellStyle}>{route.distance}</td>
                      <td style={tableCellStyle}>{route.shelterCoverage}%</td>
                      <td style={tableCellStyle}>{route.greeneryExposure}%</td>
                      <td style={tableCellStyle}>{route.dataDriven ? "Data-guided" : "Prototype"}</td>
                      <td style={tableCellStyle}>{route.title === ROUTES.bicycle ? "Cycle" : "Walk"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={resultsGridStyle}>
              {routeOptions.map((route, index) => {
                const isSelected = selectedRoute === route.title;
                const routeShortcuts = getShortcutsForRoute(route.title);

                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedRoute(route.title);
                      setSelectedStepIndex(null);
                      setSelectedBikeSegment(null);
                      setShowCommunityShortcutRoute(false);
                    }}
                    style={{
                      ...resultCardStyle,
                      border: isSelected ? "3px solid #00ffcc" : "1px solid rgba(255,255,255,0.18)",
                      transform: "none",
                      boxShadow: isSelected ? "0 0 25px rgba(0,255,204,0.45)" : "none",
                      cursor: "pointer"
                    }}
                  >
                    <h2>{route.title}</h2>
                    <div style={badgeStyle}>{getRouteTag(route.title)}</div>
                    <ScoreRing score={route.score} />
                    <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>{route.desc}</p>
                    <div style={metricRowStyle}>
                      <span>Shelter: {route.shelterCoverage}%</span>
                      <span>Greenery: {route.greeneryExposure}%</span>
                    </div>
                    <div style={metricRowStyle}>
                      <span>Shelter Infra: {route.shelterInfrastructureLevel}</span>
                      <span>Green Corridor: {route.greenCorridorLevel}</span>
                    </div>
                    {route.title === ROUTES.coolest && <p>Preference: {greeneryPreference}</p>}
                    {route.title === ROUTES.sheltered && <p>Preference: {shelterPreference}</p>}
                    <p>{route.dataDriven ? "Data-guided path" : "Prototype path"}</p>

                    {route.title === ROUTES.bicycle ? (
                      <div style={bicycleMiniStyle}>
                        <b>Bicycle Comfort Mode</b>
                        <p>Estimated cycling time based on about 15 km/h.</p>
                        <p>Lower carbon travel and faster first/last-mile mobility.</p>
                      </div>
                    ) : null}

                    {routeShortcuts.length > 0 ? (
                      <div style={shortcutBenefitMiniStyle}>
                        <b>Community Shortcut Available</b>
                        <p>{routeShortcuts[0].name}</p>
                        <p>{getShortcutBenefit(routeShortcuts[0]).main}</p>

                        {route.title === ROUTES.fastest && routeShortcuts[0].shortcutLine ? (
                          <div style={shortcutToggleBoxStyle}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCommunityShortcutRoute(false);
                              }}
                              style={{
                                ...smallToggleButtonStyle,
                                backgroundColor: !showCommunityShortcutRoute ? "#2d9cdb" : "rgba(255,255,255,0.16)"
                              }}
                            >
                              Recommended Route
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCommunityShortcutRoute(true);
                              }}
                              style={{
                                ...smallToggleButtonStyle,
                                backgroundColor: showCommunityShortcutRoute ? "#7fb800" : "rgba(255,255,255,0.16)"
                              }}
                            >
                              Community Shortcut
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div style={metricRowStyle}>
                      <span>Time: {route.time}</span>
                      <span>Distance: {route.distance}</span>
                    </div>
                    <p style={{ color: "#00ffcc", fontWeight: "bold" }}>{isSelected ? "Selected" : "Tap to select"}</p>
                  </div>
                );
              })}
            </div>

            <div style={intelligenceBoxStyle}>
              <h2>Why This Route?</h2>
              <h3>{selectedRoute}</h3>
              <p>{selectedProfile.explanation}</p>
              {selectedRoute === ROUTES.coolest && <p style={{ color: "#00ffcc" }}>{getPreferenceSettings("greenery").label}</p>}
              {selectedRoute === ROUTES.sheltered && <p style={{ color: "#00ffcc" }}>{getPreferenceSettings("shelter").label}</p>}
              <div style={breakdownGridStyle}>
                <div style={miniScoreStyle}>
                  <b>Shelter Protection</b>
                  <p>{selectedProfile.shelter}/40</p>
                  <small>{selectedProfile.shelterExplanation}</small>
                </div>
                <div style={miniScoreStyle}>
                  <b>Weather Comfort</b>
                  <p>{calculateWeatherScore()}/30</p>
                </div>
                <div style={miniScoreStyle}>
                  <b>Greenery Exposure</b>
                  <p>{selectedProfile.greenery}/20</p>
                  <small>{selectedProfile.greenCorridorExplanation}</small>
                </div>
                <div style={miniScoreStyle}>
                  <b>Distance Efficiency</b>
                  <p>{selectedProfile.distance}/10</p>
                </div>
              </div>
              <p style={{ color: "#00ffcc", fontWeight: "bold" }}>Final Comfort Score: {getComfortScore(selectedRoute)}/100</p>
            </div>

            <h2 style={{ color: "white", textAlign: "center" }}>Selected: {selectedRoute}</h2>
            <div style={legendBoxStyle}>
              <button onClick={showUserLiveLocation} style={{ ...buttonStyle, maxWidth: "230px", marginBottom: "10px", backgroundColor: "#2d9cdb" }}>
                Show My Current Location
              </button>
              <br />
              <b>Map Legend:</b> <span style={{ color: "#2d9cdb" }}>Fastest</span> | <span style={{ color: "#00ff66" }}>Coolest</span> | <span style={{ color: "#ffb703" }}>Most Sheltered</span> | <span style={{ color: "#8a5cf6" }}>Bicycle</span> | <span style={{ color: "#ff00ff" }}>Selected Step</span> | <span style={{ color: "#b8ff00" }}>Community Shortcut</span> | <span style={{ color: "#8a5cf6" }}>Bike Segment</span>
            </div>

            <div style={mapBoxStyle}>
              <MapContainer center={[1.3521, 103.8198]} zoom={12} style={{ height: "100%", width: "100%" }}>
                <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapMover startCoords={startCoords} endCoords={endCoords} />

                {startCoords && (
                  <Marker position={startCoords}>
                    <Popup>Start: {start}</Popup>
                  </Marker>
                )}

                {userLiveCoords && (
                  <Marker position={userLiveCoords}>
                    <Popup>Your current phone location</Popup>
                  </Marker>
                )}

                {endCoords && (
                  <Marker position={endCoords}>
                    <Popup>Destination: {end}</Popup>
                  </Marker>
                )}

                {selectedData && selectedStepIndex === null && selectedBikeSegment === null && !(selectedRoute === ROUTES.fastest && showCommunityShortcutRoute) && (
                  <Polyline key={selectedRoute} positions={selectedData.line} color={getRouteColor(selectedRoute)} weight={9} opacity={0.95} />
                )}

                {selectedData && selectedStepIndex !== null && selectedBikeSegment === null && selectedData.steps[selectedStepIndex]?.line?.length > 0 && (
                  <Polyline key={`step-${selectedStepIndex}`} positions={selectedData.steps[selectedStepIndex].line} color="#ff00ff" weight={10} opacity={1} />
                )}

                {bicyclePoints.map((bikePoint) => (
                  <Marker key={`bike-${bikePoint.id}`} position={bikePoint.location}>
                    <Popup>
                      <b>{bikePoint.name}</b><br />
                      Bicycle point<br />
                      Type: {bikePoint.type}
                    </Popup>
                  </Marker>
                ))}

                {selectedRoute === ROUTES.bicycle && bikeJourney && selectedBikeSegment === null && (
                  <>
                    <Polyline
                      positions={bikeJourney.walkToPickupLine}
                      color="#2d9cdb"
                      weight={6}
                      opacity={0.9}
                      dashArray="6, 8"
                    />
                    <Polyline
                      positions={bikeJourney.cycleLine}
                      color="#8a5cf6"
                      weight={9}
                      opacity={0.95}
                    />
                    <Polyline
                      positions={bikeJourney.walkFromReturnLine}
                      color="#2d9cdb"
                      weight={6}
                      opacity={0.9}
                      dashArray="6, 8"
                    />
                  </>
                )}

                {selectedRoute === ROUTES.bicycle && bikeJourney && selectedBikeSegment === "walkToPickup" && (
                  <Polyline
                    positions={bikeJourney.walkToPickupLine}
                    color="#ff00ff"
                    weight={10}
                    opacity={1}
                    dashArray="6, 8"
                  />
                )}

                {selectedRoute === ROUTES.bicycle && bikeJourney && selectedBikeSegment === "cycle" && (
                  <Polyline
                    positions={bikeJourney.cycleLine}
                    color="#ff00ff"
                    weight={10}
                    opacity={1}
                  />
                )}

                {selectedRoute === ROUTES.bicycle && bikeJourney && selectedBikeSegment === "walkFromReturn" && (
                  <Polyline
                    positions={bikeJourney.walkFromReturnLine}
                    color="#ff00ff"
                    weight={10}
                    opacity={1}
                    dashArray="6, 8"
                  />
                )}

                {selectedRoute === ROUTES.fastest && showCommunityShortcutRoute &&
                  getShortcutsForRoute(selectedRoute).map((shortcut) => {
                    if (!shortcut.shortcutLine) return null;

                    const segments = getCommunityShortcutSegments(shortcut);

                    return (
                      <React.Fragment key={`community-shortcut-route-${shortcut.id}`}>
                        {segments.beforeLine.length > 1 && (
                          <Polyline
                            positions={segments.beforeLine}
                            color="#2d9cdb"
                            weight={8}
                            opacity={0.95}
                          />
                        )}

                        {segments.shortcutLine.length > 1 && (
                          <Polyline
                            positions={segments.shortcutLine}
                            color="#b8ff00"
                            weight={9}
                            opacity={0.98}
                            dashArray="10, 10"
                          >
                            <Popup>
                              <b>{shortcut.name}</b>
                              <br />
                              {shortcut.description}
                              <br />
                              Estimated saving: {shortcut.timeSaving || 3} mins
                              <br />
                              Confidence: {shortcut.confidence || "High"}
                            </Popup>
                          </Polyline>
                        )}

                        {segments.afterLine.length > 1 && (
                          <Polyline
                            positions={segments.afterLine}
                            color="#2d9cdb"
                            weight={8}
                            opacity={0.95}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
              </MapContainer>
            </div>

            <div style={directionsBoxStyle}>
              <h2>Directions</h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                <button
                  onClick={speakDirections}
                  style={{ ...buttonStyle, flex: "1 1 180px", backgroundColor: "#00c2a8" }}
                >
                  🔊 Read Directions
                </button>
                <button
                  onClick={stopSpeaking}
                  style={{ ...buttonStyle, flex: "1 1 180px", backgroundColor: "#666" }}
                >
                  Stop Voice
                </button>
              </div>
              {selectedRoute === ROUTES.bicycle && bikeJourney && (
                <div style={bikeJourneyStyle}>
                  <h3 style={{ color: "#8a5cf6" }}>Walk + Bicycle Directions</h3>
                  <button
                    onClick={() => setSelectedBikeSegment(null)}
                    style={{ ...buttonStyle, maxWidth: "260px", marginBottom: "10px", backgroundColor: "#8a5cf6" }}
                  >
                    Show Full Walk + Bicycle Route
                  </button>

                  <div
                    onClick={() => {
                      setSelectedBikeSegment("walkToPickup");
                      setSelectedStepIndex(null);
                    }}
                    style={{
                      ...bikeStepStyle,
                      border: selectedBikeSegment === "walkToPickup" ? "2px solid #ff00ff" : "1px solid rgba(255,255,255,0.18)"
                    }}
                  >
                    <b>Step 1:</b> Walk from start to {bikeJourney.pickupPoint.name}.
                  </div>

                  <div
                    onClick={() => {
                      setSelectedBikeSegment("cycle");
                      setSelectedStepIndex(null);
                    }}
                    style={{
                      ...bikeStepStyle,
                      border: selectedBikeSegment === "cycle" ? "2px solid #ff00ff" : "1px solid rgba(255,255,255,0.18)"
                    }}
                  >
                    <b>Step 2:</b> Rent a bicycle and cycle to {bikeJourney.returnPoint.name}.
                    <br />
                    <span style={{ opacity: 0.85 }}>{bikeJourney.cycleRouteType}</span>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedBikeSegment("walkFromReturn");
                      setSelectedStepIndex(null);
                    }}
                    style={{
                      ...bikeStepStyle,
                      border: selectedBikeSegment === "walkFromReturn" ? "2px solid #ff00ff" : "1px solid rgba(255,255,255,0.18)"
                    }}
                  >
                    <b>Step 3:</b> Return the bicycle and walk to destination.
                  </div>
                  <p style={{ color: "#00ffcc", fontWeight: "bold" }}>Estimated Total: {bikeJourney.totalMin} mins</p>
                  {bikeJourney.cycleSteps.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <b>Key cycling directions:</b>
                      {bikeJourney.cycleSteps.slice(0, 4).map((step, index) => (
                        <p key={index} style={{ marginBottom: "4px" }}>
                          Cycle {index + 1}: {step.instruction} ({Math.round(step.distance)} m)
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p style={{ color: "#00ffcc", fontWeight: "bold" }}>Showing directions for: {selectedRoute}</p>
              <button onClick={() => setSelectedStepIndex(null)} style={{ ...buttonStyle, maxWidth: "260px", marginBottom: "12px", backgroundColor: "#2d9cdb" }}>
                Show Full Route
              </button>
              {selectedRoute === ROUTES.fastest && showCommunityShortcutRoute ? (
                <>
                  <div style={stepItemStyle}>
                    <b>Step 1:</b> Walk from the start point toward the community shortcut entry.
                  </div>

                  <div style={stepItemStyle}>
                    <b>Step 2:</b> Follow the user-defined community shortcut through the neighbourhood pedestrian path.
                  </div>

                  <div style={stepItemStyle}>
                    <b>Step 3:</b> Continue along the remaining path toward the destination.
                  </div>

                  <div style={stepItemStyle}>
                    <b>Step 4:</b> Arrive at destination.
                  </div>
                </>
              ) : (
                selectedData?.steps.slice(0, 8).map((step, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedStepIndex(index);
                      setSelectedBikeSegment(null);
                    }}
                    style={{
                      ...stepItemStyle,
                      border: selectedStepIndex === index ? "2px solid #ff00ff" : "1px solid rgba(255,255,255,0.18)",
                      backgroundColor: selectedStepIndex === index ? "rgba(255,0,255,0.18)" : "rgba(255,255,255,0.08)"
                    }}
                  >
                    <b>Step {index + 1}:</b> {step.instruction} <span style={{ opacity: 0.8 }}>({Math.round(step.distance)} m)</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle = { backgroundColor: "rgba(0,0,0,0.65)", minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" };
const cardStyle = { width: "100%", maxWidth: "420px", backgroundColor: "rgba(255,255,255,0.14)", padding: "20px", borderRadius: "16px", backdropFilter: "blur(8px)" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "none", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#00c2a8", color: "white", fontWeight: "bold", cursor: "pointer" };
const preferenceBoxStyle = { backgroundColor: "rgba(255,255,255,0.08)", padding: "12px", borderRadius: "12px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.16)" };
const labelStyle = { display: "block", marginBottom: "6px", fontWeight: "bold", color: "white" };
const suggestionBoxStyle = { backgroundColor: "white", color: "#222", borderRadius: "8px", marginTop: "-8px", marginBottom: "12px", maxHeight: "180px", overflowY: "auto", fontSize: "0.85rem", position: "relative", zIndex: 1000 };
const suggestionItemStyle = { padding: "10px", borderBottom: "1px solid #ddd", cursor: "pointer" };
const panelStyle = { width: "100%", maxWidth: "1000px", backgroundColor: "rgba(0,0,0,0.45)", padding: "16px", borderRadius: "16px", marginBottom: "20px", color: "white", border: "1px solid rgba(255,255,255,0.18)" };
const weatherBoxStyle = panelStyle;
const aiRecommendationBoxStyle = { ...panelStyle, border: "1px solid rgba(0,255,204,0.35)", backgroundColor: "rgba(0,70,80,0.45)" };
const shelterBoxStyle = panelStyle;
const greeneryBoxStyle = panelStyle;
const detectionBoxStyle = { width: "100%", maxWidth: "1000px", backgroundColor: "rgba(0,0,0,0.45)", padding: "14px", borderRadius: "16px", marginBottom: "20px", color: "white", border: "1px solid rgba(255,255,255,0.18)", display: "flex", gap: "14px", alignItems: "stretch", flexWrap: "wrap" };
const detectionColumnStyle = { flex: "1 1 300px", minWidth: "260px" };
const verticalDividerStyle = { width: "1px", backgroundColor: "rgba(255,255,255,0.25)" };
const compactTextStyle = { fontSize: "0.9rem", margin: "5px 0" };
const compactListStyle = { textAlign: "left", fontSize: "0.85rem", marginTop: "6px", paddingLeft: "18px" };
const shortcutBoxStyle = panelStyle;
const bicycleBoxStyle = panelStyle;
const comparisonBoxStyle = { ...panelStyle, overflowX: "auto" };
const comparisonTableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" };
const tableCellStyle = { border: "1px solid rgba(255,255,255,0.25)", padding: "8px", textAlign: "center" };
const resultsGridStyle = {
  width: "100%",
  maxWidth: "1400px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "14px",
  marginBottom: "20px",
  alignItems: "stretch"
};
const resultCardStyle = {
  backgroundColor: "rgba(0,0,0,0.45)",
  padding: "14px",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
  color: "white",
  transition: "0.2s ease",
  minWidth: "0",
  height: "auto",
  marginBottom: "16px"
};
const scoreStyle = { color: "#00ffcc", fontSize: "2.3rem", margin: "6px 0", textShadow: "0 0 10px rgba(0,255,204,0.5)" };
const badgeStyle = { display: "inline-block", backgroundColor: "rgba(0,255,204,0.16)", color: "#00ffcc", padding: "6px 10px", borderRadius: "999px", fontWeight: "bold", fontSize: "0.85rem", marginBottom: "8px", border: "1px solid rgba(0,255,204,0.35)" };
const metricRowStyle = { display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", fontSize: "0.9rem", margin: "6px 0" };
const intelligenceBoxStyle = { width: "100%", maxWidth: "1000px", backgroundColor: "rgba(0,0,0,0.5)", padding: "20px", borderRadius: "16px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", marginBottom: "20px", color: "white", textAlign: "center" };
const breakdownGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginTop: "15px" };
const miniScoreStyle = { backgroundColor: "rgba(255,255,255,0.1)", padding: "12px", borderRadius: "12px" };
const legendBoxStyle = { width: "100%", maxWidth: "1000px", backgroundColor: "rgba(0,0,0,0.45)", padding: "10px", borderRadius: "12px", marginBottom: "12px", textAlign: "center", color: "white", border: "1px solid rgba(255,255,255,0.18)" };
const mapBoxStyle = { width: "100%", maxWidth: "1000px", height: "500px", borderRadius: "16px", overflow: "hidden", marginBottom: "20px" };
const directionsBoxStyle = { width: "100%", maxWidth: "1000px", backgroundColor: "rgba(0,0,0,0.45)", padding: "18px", borderRadius: "16px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)", color: "white" };
const stepItemStyle = { padding: "10px", borderRadius: "10px", marginBottom: "8px", cursor: "pointer", color: "white" };
const routeShortcutGroupStyle = { backgroundColor: "rgba(255,255,255,0.08)", padding: "12px", borderRadius: "12px", marginTop: "12px", border: "1px solid rgba(255,255,255,0.16)" };
const shortcutBenefitMiniStyle = { backgroundColor: "rgba(184,255,0,0.12)", padding: "10px", borderRadius: "10px", marginTop: "8px", border: "1px solid rgba(184,255,0,0.35)", color: "white" };
const shortcutToggleBoxStyle = { display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" };
const smallToggleButtonStyle = { flex: "1 1 130px", padding: "9px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.24)", color: "white", fontWeight: "bold", cursor: "pointer" };
const bikeGridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginTop: "12px" };
const bikeCardStyle = { backgroundColor: "rgba(138,92,246,0.15)", padding: "12px", borderRadius: "12px", border: "1px solid rgba(138,92,246,0.45)" };
const bikeJourneyStyle = { backgroundColor: "rgba(138,92,246,0.12)", padding: "12px", borderRadius: "12px", marginTop: "12px", border: "1px solid rgba(138,92,246,0.45)", color: "white" };
const bikeStepStyle = { backgroundColor: "rgba(255,255,255,0.08)", padding: "10px", borderRadius: "10px", marginBottom: "8px", cursor: "pointer", color: "white" };
const bicycleMiniStyle = { backgroundColor: "rgba(138,92,246,0.15)", padding: "10px", borderRadius: "10px", marginTop: "8px", border: "1px solid rgba(138,92,246,0.45)", color: "white" };
