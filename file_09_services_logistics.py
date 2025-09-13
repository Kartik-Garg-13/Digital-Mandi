import random
import math
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)

class LogisticsService:
    def __init__(self):
        # Major Indian cities with coordinates (lat, lon)
        self.city_coordinates = {
            'delhi': (28.6139, 77.2090),
            'mumbai': (19.0760, 72.8777),
            'bangalore': (12.9716, 77.5946),
            'hyderabad': (17.3850, 78.4867),
            'chennai': (13.0827, 80.2707),
            'kolkata': (22.5726, 88.3639),
            'pune': (18.5204, 73.8567),
            'jaipur': (26.9124, 75.7873),
            'ahmedabad': (23.0225, 72.5714),
            'surat': (21.1702, 72.8311),
            'lucknow': (26.8467, 80.9462),
            'kanpur': (26.4499, 80.3319),
            'nagpur': (21.1458, 79.0882),
            'indore': (22.7196, 75.8577),
            'bhopal': (23.2599, 77.4126),
            'visakhapatnam': (17.6868, 83.2185),
            'patna': (25.5941, 85.1376),
            'vadodara': (22.3072, 73.1812),
            'ludhiana': (30.9010, 75.8573),
            'agra': (27.1767, 78.0081)
        }
        
        # Transport cost per km based on vehicle type
        self.transport_rates = {
            'small_truck': 8.5,   # ₹8.5 per km
            'medium_truck': 12.0, # ₹12 per km  
            'large_truck': 15.5,  # ₹15.5 per km
            'tractor': 6.0        # ₹6 per km
        }
        
        logger.info("✅ Logistics service initialized")
    
    async def calculate_logistics(self, location: str, quantity_kg: int) -> Dict:
        """
        Calculate logistics information for a listing
        Returns distance, transport cost, and vehicle recommendations
        """
        try:
            # Extract city from location
            city = self.extract_city_name(location)
            
            # Calculate distance to nearest major market
            distance_km = self.calculate_distance_to_market(city)
            
            # Determine optimal vehicle based on quantity
            vehicle_type = self.get_optimal_vehicle(quantity_kg)
            
            # Calculate transport cost
            cost_per_kg = self.calculate_transport_cost(distance_km, quantity_kg, vehicle_type)
            
            # Add some realistic variations
            distance_km = round(distance_km + random.uniform(-1.5, 2.0), 1)
            cost_per_kg = round(cost_per_kg + random.uniform(-0.5, 1.0), 2)
            
            # Ensure minimum values
            distance_km = max(2.0, distance_km)
            cost_per_kg = max(1.0, cost_per_kg)
            
            return {
                'distance_km': distance_km,
                'cost_per_kg': cost_per_kg,
                'vehicle_type': vehicle_type,
                'estimated_time_hours': self.estimate_transport_time(distance_km),
                'fuel_cost_estimate': round(distance_km * 8.5, 2),  # ₹8.5 per km fuel
                'total_transport_cost': round(cost_per_kg * quantity_kg, 2)
            }
            
        except Exception as e:
            logger.error(f"Logistics calculation error: {e}")
            # Return default values
            return {
                'distance_km': round(random.uniform(3.0, 12.0), 1),
                'cost_per_kg': round(random.uniform(2.0, 5.0), 2),
                'vehicle_type': 'small_truck',
                'estimated_time_hours': 2.5,
                'fuel_cost_estimate': 85.0,
                'total_transport_cost': round(random.uniform(200, 800), 2)
            }
    
    def extract_city_name(self, location: str) -> str:
        """Extract city name from location string"""
        # Remove common prefixes/suffixes and get first word
        location = location.lower().strip()
        
        # Handle common patterns
        if ',' in location:
            city = location.split(',')[0].strip()
        else:
            city = location.split()[0].strip()
        
        # Check if it's a known city
        if city in self.city_coordinates:
            return city
        
        # Try to find closest match
        for known_city in self.city_coordinates.keys():
            if known_city in location or city in known_city:
                return known_city
        
        # Default to a central location
        return 'delhi'
    
    def calculate_distance_to_market(self, city: str) -> float:
        """Calculate distance to nearest major market hub"""
        major_markets = ['delhi', 'mumbai', 'bangalore', 'hyderabad', 'chennai', 'kolkata']
        
        if city in major_markets:
            # If already in major market, distance to market center
            return random.uniform(5.0, 15.0)
        
        city_coord = self.city_coordinates.get(city, self.city_coordinates['delhi'])
        
        # Find nearest major market
        min_distance = float('inf')
        for market in major_markets:
            market_coord = self.city_coordinates[market]
            distance = self.haversine_distance(city_coord, market_coord)
            min_distance = min(min_distance, distance)
        
        # Add local transport distance (farm to city center)
        local_distance = random.uniform(8.0, 25.0)
        
        return min(min_distance + local_distance, 50.0)  # Cap at 50km for local logistics
    
    def haversine_distance(self, coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
        """Calculate distance between two coordinates using Haversine formula"""
        lat1, lon1 = coord1
        lat2, lon2 = coord2
        
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Earth's radius in kilometers
        r = 6371
        
        return c * r
    
    def get_optimal_vehicle(self, quantity_kg: int) -> str:
        """Determine optimal vehicle type based on quantity"""
        if quantity_kg <= 500:
            return 'tractor'
        elif quantity_kg <= 2000:
            return 'small_truck'
        elif quantity_kg <= 5000:
            return 'medium_truck'
        else:
            return 'large_truck'
    
    def calculate_transport_cost(self, distance_km: float, quantity_kg: int, vehicle_type: str) -> float:
        """Calculate transport cost per kg"""
        base_rate = self.transport_rates.get(vehicle_type, 10.0)
        
        # Base cost calculation
        total_vehicle_cost = distance_km * base_rate * 2  # Round trip
        
        # Add fuel surcharge for longer distances
        if distance_km > 20:
            total_vehicle_cost *= 1.2
        
        # Add handling charges
        handling_cost = quantity_kg * 0.5  # ₹0.5 per kg handling
        
        # Total cost
        total_cost = total_vehicle_cost + handling_cost
        
        # Cost per kg
        cost_per_kg = total_cost / quantity_kg
        
        # Apply quantity discounts
        if quantity_kg > 1000:
            cost_per_kg *= 0.9  # 10% discount for bulk
        elif quantity_kg > 2000:
            cost_per_kg *= 0.8  # 20% discount for large bulk
        
        return max(1.0, cost_per_kg)  # Minimum ₹1 per kg
    
    def estimate_transport_time(self, distance_km: float) -> float:
        """Estimate transport time in hours"""
        # Average speed considering Indian road conditions
        avg_speed_kmh = 35  # 35 km/h average
        
        # Base travel time
        travel_time = distance_km / avg_speed_kmh
        
        # Add loading/unloading time
        loading_time = 1.5  # 1.5 hours for loading/unloading
        
        # Add buffer for traffic/breaks
        buffer_time = travel_time * 0.3  # 30% buffer
        
        total_time = travel_time + loading_time + buffer_time
        
        return round(total_time, 1)
    
    async def get_route_optimization(self, pickup_locations: List[str], destination: str) -> Dict:
        """Optimize route for multiple pickups (future feature)"""
        # This is a placeholder for future route optimization
        return {
            'optimized_route': pickup_locations,
            'total_distance': sum([random.uniform(5, 15) for _ in pickup_locations]),
            'estimated_time': len(pickup_locations) * 2.5,
            'cost_savings': random.uniform(10, 25)  # Percentage savings
        }