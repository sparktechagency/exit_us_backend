const calculateFlightDetails = (
    lat1: number, lon1: number, lat2: number, lon2: number, speed: number = 900
): { distance: number; flightTime: string } => {

    const toRadians = (value: number): number => (value * Math.PI) / 180;
    const R = 6371; // Radius of Earth in km

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = (R * c); // Distance in km

    const totalMinutes = (distance / speed) * 60; // Flight time in minutes
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    return { distance, flightTime: `${hours}h ${minutes}m` };
};

const countryDetailsFromApi = async (country:string)=>{
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`)
    const countryData = await response.json();
    return countryData[0]
}

export const countriesHelper = {
    calculateFlightDetails,
    countryDetailsFromApi,  // fetch country details from API
}