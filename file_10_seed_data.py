import asyncio
from datetime import datetime, timedelta
import random
from database import AsyncSessionLocal, init_db
from models import *
import uuid

# Realistic farmer data from different Indian states
REALISTIC_FARMERS = [
    {"name": "Ramesh Kumar", "phone": "+919876543210", "location": "Jaipur, Rajasthan", "language": "hi", "trust_score": 4.7, "total_ratings": 23},
    {"name": "Suresh Patel", "phone": "+919876543211", "location": "Ahmedabad, Gujarat", "language": "hi", "trust_score": 4.2, "total_ratings": 18},
    {"name": "Manjunath Reddy", "phone": "+919876543212", "location": "Bangalore, Karnataka", "language": "kn", "trust_score": 4.8, "total_ratings": 31},
    {"name": "Krishnamurthy", "phone": "+919876543213", "location": "Coimbatore, Tamil Nadu", "language": "ta", "trust_score": 4.5, "total_ratings": 19},
    {"name": "Ravi Shankar", "phone": "+919876543214", "location": "Ludhiana, Punjab", "language": "pa", "trust_score": 4.9, "total_ratings": 42},
    {"name": "Balram Singh", "phone": "+919876543215", "location": "Meerut, Uttar Pradesh", "language": "hi", "trust_score": 4.1, "total_ratings": 15},
    {"name": "Ganesh Bhosale", "phone": "+919876543216", "location": "Pune, Maharashtra", "language": "mr", "trust_score": 4.6, "total_ratings": 28},
    {"name": "Subash Chandra", "phone": "+919876543217", "location": "Bhubaneswar, Odisha", "language": "or", "trust_score": 4.3, "total_ratings": 21},
    {"name": "Mohan Das", "phone": "+919876543218", "location": "Kolkata, West Bengal", "language": "bn", "trust_score": 4.4, "total_ratings": 17},
    {"name": "Rajesh Thakur", "phone": "+919876543219", "location": "Indore, Madhya Pradesh", "language": "hi", "trust_score": 4.7, "total_ratings": 25},
    {"name": "Vijay Kumar", "phone": "+919876543220", "location": "Hyderabad, Telangana", "language": "te", "trust_score": 4.8, "total_ratings": 33},
    {"name": "Prakash Yadav", "phone": "+919876543221", "location": "Patna, Bihar", "language": "hi", "trust_score": 4.0, "total_ratings": 12},
    {"name": "Deepak Sharma", "phone": "+919876543222", "location": "Chandigarh, Punjab", "language": "hi", "trust_score": 4.5, "total_ratings": 29},
    {"name": "Naresh Jain", "phone": "+919876543223", "location": "Jodhpur, Rajasthan", "language": "hi", "trust_score": 4.3, "total_ratings": 16},
    {"name": "Ashok Verma", "phone": "+919876543224", "location": "Lucknow, Uttar Pradesh", "language": "hi", "trust_score": 4.6, "total_ratings": 22}
]

# Realistic buyer data
REALISTIC_BUYERS = [
    {"name": "Anil Traders", "phone": "+919876543225", "location": "Delhi", "trust_score": 4.5, "total_ratings": 67},
    {"name": "Mumbai Mandi Co.", "phone": "+919876543226", "location": "Mumbai, Maharashtra", "trust_score": 4.8, "total_ratings": 124},
    {"name": "Kolkata Wholesale", "phone": "+919876543227", "location": "Kolkata, West Bengal", "trust_score": 4.2, "total_ratings": 89},
    {"name": "Chennai Agri Corp", "phone": "+919876543228", "location": "Chennai, Tamil Nadu", "trust_score": 4.7, "total_ratings": 156},
    {"name": "Bangalore Fresh Foods", "phone": "+919876543229", "location": "Bangalore, Karnataka", "trust_score": 4.6, "total_ratings": 98},
    {"name": "Hyderabad Exports", "phone": "+919876543230", "location": "Hyderabad, Telangana", "trust_score": 4.9, "total_ratings": 203},
    {"name": "Pune Organic Market", "phone": "+919876543231", "location": "Pune, Maharashtra", "trust_score": 4.4, "total_ratings": 76},
    {"name": "Ahmedabad Traders", "phone": "+919876543232", "location": "Ahmedabad, Gujarat", "trust_score": 4.3, "total_ratings": 54},
    {"name": "Jaipur Spice Co.", "phone": "+919876543233", "location": "Jaipur, Rajasthan", "trust_score": 4.7, "total_ratings": 112},
    {"name": "Kochi Export House", "phone": "+919876543234", "location": "Kochi, Kerala", "trust_score": 4.8, "total_ratings": 145}
]

# Realistic crops with local names and seasonal data
REALISTIC_CROPS = [
    {"name": "tomato", "local": "टमाटर", "msp": 50, "season": "winter", "avg_price": 45},
    {"name": "onion", "local": "प्याज", "msp": 35, "season": "winter", "avg_price": 32},
    {"name": "potato", "local": "आलू", "msp": 25, "season": "winter", "avg_price": 28},
    {"name": "wheat", "local": "गेहूं", "msp": 2275, "season": "rabi", "avg_price": 2300},
    {"name": "rice", "local": "चावल", "msp": 2300, "season": "kharif", "avg_price": 2350},
    {"name": "cotton", "local": "कपास", "msp": 6620, "season": "kharif", "avg_price": 6800},
    {"name": "sugarcane", "local": "गन्ना", "msp": 340, "season": "annual", "avg_price": 350},
    {"name": "maize", "local": "मक्का", "msp": 2090, "season": "kharif", "avg_price": 2150},
    {"name": "mustard", "local": "सरसों", "msp": 5650, "season": "rabi", "avg_price": 5700},
    {"name": "gram", "local": "चना", "msp": 5440, "season": "rabi", "avg_price": 5500},
    {"name": "turmeric", "local": "हल्दी", "msp": 7600, "season": "annual", "avg_price": 7800},
    {"name": "chilli", "local": "मिर्च", "msp": 9200, "season": "annual", "avg_price": 9500},
    {"name": "coriander", "local": "धनिया", "msp": 7645, "season": "rabi", "avg_price": 7800},
    {"name": "cumin", "local": "जीरा", "msp": 8200, "season": "rabi", "avg_price": 8500},
    {"name": "garlic", "local": "लहसुन", "msp": 45, "season": "rabi", "avg_price": 48}
]

# Realistic sponsors (NGOs and corporations)
REALISTIC_SPONSORS = [
    {"name": "Kisan Kalyan Foundation", "org": "Agricultural Development NGO", "funded": 125000},
    {"name": "Bharat Agri Corp", "org": "Corporate Social Responsibility", "funded": 350000},
    {"name": "Grameen Vikas Trust", "org": "Rural Development Foundation", "funded": 89000},
    {"name": "Tata Agriculture Initiative", "org": "Tata Group CSR", "funded": 500000},
    {"name": "Reliance Foundation", "org": "Reliance Industries CSR", "funded": 750000},
    {"name": "Mahindra Rise Foundation", "org": "Mahindra Group", "funded": 400000}
]

# Price forecasting data with realistic trends
PRICE_FORECASTS = [
    {"crop": "tomato", "current": 45, "predicted": 52, "change": 15.6, "reason": "Reduced supply due to unseasonal rains in Maharashtra and Karnataka"},
    {"crop": "onion", "current": 32, "predicted": 28, "change": -12.5, "reason": "Good harvest in major producing states, increased storage capacity"},
    {"crop": "wheat", "current": 2300, "predicted": 2380, "change": 3.5, "reason": "Global wheat prices rising due to geopolitical tensions"},
    {"crop": "rice", "current": 2350, "predicted": 2280, "change": -3.0, "reason": "Bumper harvest expected, government procurement increased"},
    {"crop": "cotton", "current": 6800, "predicted": 7200, "change": 5.9, "reason": "Export demand increasing, textile industry recovery"},
    {"crop": "potato", "current": 28, "predicted": 35, "change": 25.0, "reason": "Storage losses due to heat wave, festival season demand"},
    {"crop": "sugarcane", "current": 350, "predicted": 365, "change": 4.3, "reason": "Sugar mills increasing procurement prices"},
    {"crop": "maize", "current": 2150, "predicted": 2050, "change": -4.7, "reason": "Good monsoon forecast, area under cultivation increased"},
    {"crop": "turmeric", "current": 7800, "predicted": 8500, "change": 9.0, "reason": "Export demand from Europe and US increasing"},
    {"crop": "chilli", "current": 9500, "predicted": 10200, "change": 7.4, "reason": "Pest attacks in Andhra Pradesh, reduced supply"}
]

async def create_realistic_data():
    """Create realistic farmers, buyers, listings, bids, and forecasts"""
    
    print("🌱 Creating realistic farmer marketplace data...")
    print("👨‍💻 Built by Kartik Singh - 17 year old BTech CSE student at MUJ")
    
    # Initialize database
    await init_db()
    
    async with AsyncSessionLocal() as session:
        try:
            # Clear existing data
            print("🧹 Cleaning existing data...")
            await session.execute("DELETE FROM ratings")
            await session.execute("DELETE FROM transactions") 
            await session.execute("DELETE FROM bids")
            await session.execute("DELETE FROM price_forecasts")
            await session.execute("DELETE FROM listings")
            await session.execute("DELETE FROM collectives")
            await session.execute("DELETE FROM sponsors")
            await session.execute("DELETE FROM users")
            await session.commit()
            
            # Create sponsors
            sponsors = []
            for sponsor_data in REALISTIC_SPONSORS:
                sponsor = Sponsor(
                    id=uuid.uuid4(),
                    name=sponsor_data["name"],
                    organization=sponsor_data["org"],
                    total_funded=sponsor_data["funded"],
                    active_sponsorships=random.randint(2, 8)
                )
                sponsors.append(sponsor)
                session.add(sponsor)
            
            await session.commit()
            print(f"✅ Created {len(sponsors)} sponsors")
            
            # Create farmers
            farmers = []
            for farmer_data in REALISTIC_FARMERS:
                farmer = User(
                    id=uuid.uuid4(),
                    phone=farmer_data["phone"],
                    name=farmer_data["name"],
                    user_type=UserType.FARMER,
                    location=farmer_data["location"],
                    language_preference=farmer_data["language"],
                    trust_score=farmer_data["trust_score"],
                    total_ratings=farmer_data["total_ratings"]
                )
                farmers.append(farmer)
                session.add(farmer)
            
            await session.commit()
            print(f"✅ Created {len(farmers)} farmers")
            
            # Create buyers
            buyers = []
            for buyer_data in REALISTIC_BUYERS:
                buyer = User(
                    id=uuid.uuid4(),
                    phone=buyer_data["phone"],
                    name=buyer_data["name"],
                    user_type=UserType.BUYER,
                    location=buyer_data["location"],
                    trust_score=buyer_data["trust_score"],
                    total_ratings=buyer_data["total_ratings"]
                )
                buyers.append(buyer)
                session.add(buyer)
            
            await session.commit()
            print(f"✅ Created {len(buyers)} buyers")
            
            # Create collectives
            collectives = []
            collective_crops = ["tomato", "wheat", "rice", "cotton", "onion"]
            
            for i, crop in enumerate(collective_crops):
                collective = Collective(
                    id=f"C{str(i+1).zfill(3)}",
                    crop_name=crop,
                    location=random.choice([f["location"].split(",")[0] for f in REALISTIC_FARMERS]),
                    total_quantity_kg=0,
                    average_price_per_kg=0,
                    farmer_count=0,
                    sponsor_id=random.choice(sponsors).id if random.random() > 0.3 else None,
                    is_sponsored=random.random() > 0.3
                )
                collectives.append(collective)
                session.add(collective)
            
            await session.commit()
            print(f"✅ Created {len(collectives)} collectives")
            
            # Create realistic listings
            listings = []
            for i in range(45):  # Create 45 listings
                farmer = random.choice(farmers)
                crop = random.choice(REALISTIC_CROPS)
                
                # Determine if this listing joins a collective
                collective = None
                if crop["name"] in collective_crops and random.random() > 0.4:
                    collective = next((c for c in collectives if c.crop_name == crop["name"]), None)
                
                # Generate realistic quantities based on crop type
                if crop["name"] in ["wheat", "rice", "cotton", "sugarcane", "maize"]:
                    quantity = random.randint(500, 5000)  # Large crops
                elif crop["name"] in ["tomato", "onion", "potato"]:
                    quantity = random.randint(100, 1000)   # Vegetables
                else:
                    quantity = random.randint(50, 500)     # Spices
                
                # Price variation around MSP
                price_variation = random.uniform(-0.15, 0.25)  # -15% to +25%
                price = max(crop["msp"] * (1 + price_variation), crop["msp"] * 0.8)
                
                listing = Listing(
                    id=f"L{str(i+1).zfill(3)}",
                    farmer_id=farmer.id,
                    collective_id=collective.id if collective else None,
                    crop_name=crop["name"],
                    crop_name_local=crop["local"],
                    quantity_kg=quantity,
                    price_per_kg=round(price, 2),
                    location=farmer.location,
                    description=f"Fresh {crop['name']} directly from farm. {random.choice(['Organic', 'Premium quality', 'Pesticide-free', 'Grade A'])}.",
                    msp_price=crop["msp"],
                    above_msp=price >= crop["msp"],
                    is_premium=farmer.trust_score >= 4.5,
                    transport_cost_per_kg=round(random.uniform(1.5, 4.0), 2),
                    pickup_distance_km=round(random.uniform(2.0, 15.0), 1),
                    current_bid=round(price + random.uniform(0, 10), 2) if random.random() > 0.6 else None,
                    created_at=datetime.utcnow() - timedelta(days=random.randint(0, 7))
                )
                
                # Update collective stats
                if collective:
                    collective.total_quantity_kg += quantity
                    collective.farmer_count += 1
                    collective.average_price_per_kg = (
                        (collective.average_price_per_kg * (collective.farmer_count - 1) + price) / 
                        collective.farmer_count
                    )
                
                listings.append(listing)
                session.add(listing)
            
            await session.commit()
            print(f"✅ Created {len(listings)} realistic listings")
            
            # Create bids for some listings
            bids = []
            for listing in random.sample(listings, 30):  # 30 listings get bids
                num_bids = random.randint(1, 5)
                
                for j in range(num_bids):
                    buyer = random.choice(buyers)
                    bid_amount = listing.price_per_kg + random.uniform(0.5, 15.0)
                    
                    bid = Bid(
                        id=uuid.uuid4(),
                        listing_id=listing.id,
                        buyer_id=buyer.id,
                        bid_amount=round(bid_amount, 2),
                        total_amount=round(bid_amount * listing.quantity_kg, 2),
                        payment_status=random.choice([PaymentStatus.PENDING, PaymentStatus.HELD, PaymentStatus.RELEASED]),
                        payment_id=f"pay_{random.randint(100000, 999999)}",
                        is_winning=(j == num_bids - 1),  # Last bid is winning
                        created_at=listing.created_at + timedelta(hours=random.randint(1, 48))
                    )
                    
                    # Update listing's current bid
                    if bid.is_winning:
                        listing.current_bid = bid.bid_amount
                    
                    bids.append(bid)
                    session.add(bid)
            
            await session.commit()
            print(f"✅ Created {len(bids)} realistic bids")
            
            # Create price forecasts
            forecasts = []
            for forecast_data in PRICE_FORECASTS:
                forecast = PriceForecast(
                    id=uuid.uuid4(),
                    crop_name=forecast_data["crop"],
                    current_price=forecast_data["current"],
                    predicted_price=forecast_data["predicted"],
                    change_percent=forecast_data["change"],
                    confidence_score=round(random.uniform(75, 95), 1),
                    forecast_period_days=7,
                    reason=forecast_data["reason"],
                    created_at=datetime.utcnow() - timedelta(hours=random.randint(1, 24))
                )
                forecasts.append(forecast)
                session.add(forecast)
            
            await session.commit()
            print(f"✅ Created {len(forecasts)} price forecasts")
            
            print("\n🎉 Realistic data creation complete!")
            print(f"📊 Summary:")
            print(f"   👨‍🌾 Farmers: {len(farmers)}")
            print(f"   🏢 Buyers: {len(buyers)}")
            print(f"   🌾 Listings: {len(listings)}")
            print(f"   💰 Bids: {len(bids)}")
            print(f"   🤝 Collectives: {len(collectives)}")
            print(f"   🏆 Sponsors: {len(sponsors)}")
            print(f"   📈 Forecasts: {len(forecasts)}")
            print(f"\n🚜 Digital Mandi by Kartik Singh is ready!")
            
        except Exception as e:
            print(f"❌ Error creating data: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(create_realistic_data())