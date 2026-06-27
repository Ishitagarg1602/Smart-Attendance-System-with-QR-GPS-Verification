/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of the first point
 * @param {number} lon1 - Longitude of the first point
 * @param {number} lat2 - Latitude of the second point
 * @param {number} lon2 - Longitude of the second point
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const R = 6371e3; // Earth's radius in meters
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in meters
    return distance;
};

/**
 * Checks if a scanned coordinate is within the allowed radius of a center point.
 *
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} centerLat - Zone's latitude
 * @param {number} centerLon - Zone's longitude
 * @param {number} radius - Allowed radius in meters
 * @returns {Object} { isWithinRadius, distance }
 */
export const isWithinRadius = (userLat, userLon, centerLat, centerLon, radius) => {
    const distance = calculateDistance(userLat, userLon, centerLat, centerLon);
    return {
        isWithinRadius: distance <= radius,
        distance: Math.round(distance * 100) / 100 // round to 2 decimal places
    };
};
