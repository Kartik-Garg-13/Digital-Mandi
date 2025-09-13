from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
import enum

Base = declarative_base()

class UserType(enum.Enum):
    FARMER = "farmer"
    BUYER = "buyer"
    SPONSOR = "sponsor"

class ListingStatus(enum.Enum):
    ACTIVE = "active"
    SOLD = "sold"
    EXPIRED = "expired"
    COLLECTIVE = "collective"

class PaymentStatus(enum.Enum):
    PENDING = "pending"
    HELD = "held"
    RELEASED = "released"
    FAILED = "failed"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone = Column(String(15), unique=True, nullable=False)
    name = Column(String(100))
    user_type = Column(Enum(UserType), nullable=False)
    location = Column(String(100))
    language_preference = Column(String(10), default="en")  # en, hi, ta, etc.
    preferred_channel = Column(String(20), default="whatsapp")  # whatsapp, sms
    trust_score = Column(Float, default=0.0)
    total_ratings = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    listings = relationship("Listing", back_populates="farmer")
    bids = relationship("Bid", back_populates="buyer")
    ratings_given = relationship("Rating", foreign_keys="Rating.reviewer_id", back_populates="reviewer")
    ratings_received = relationship("Rating", foreign_keys="Rating.rated_user_id", back_populates="rated_user")

class Listing(Base):
    __tablename__ = "listings"
    
    id = Column(String(10), primary_key=True)  # L001, L002, etc.
    farmer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    collective_id = Column(String(10), ForeignKey("collectives.id"), nullable=True)
    crop_name = Column(String(50), nullable=False)
    crop_name_local = Column(String(100))  # Local language name
    quantity_kg = Column(Integer, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    location = Column(String(100))
    description = Column(Text)
    image_url = Column(String(500))
    status = Column(Enum(ListingStatus), default=ListingStatus.ACTIVE)
    msp_price = Column(Float)
    current_bid = Column(Float)
    above_msp = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)  # Farmer trust score >= 4.5
    transport_cost_per_kg = Column(Float, default=0.0)
    pickup_distance_km = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    farmer = relationship("User", back_populates="listings")
    collective = relationship("Collective", back_populates="listings")
    bids = relationship("Bid", back_populates="listing")

class Collective(Base):
    __tablename__ = "collectives"
    
    id = Column(String(10), primary_key=True)  # C001, C002, etc.
    crop_name = Column(String(50), nullable=False)
    location = Column(String(100))
    total_quantity_kg = Column(Integer, default=0)
    average_price_per_kg = Column(Float, default=0.0)
    farmer_count = Column(Integer, default=0)
    sponsor_id = Column(UUID(as_uuid=True), ForeignKey("sponsors.id"), nullable=True)
    is_sponsored = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    listings = relationship("Listing", back_populates="collective")
    sponsor = relationship("Sponsor", back_populates="collectives")

class Bid(Base):
    __tablename__ = "bids"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(String(10), ForeignKey("listings.id"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    bid_amount = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    payment_id = Column(String(100))
    razorpay_order_id = Column(String(100))
    is_winning = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    listing = relationship("Listing", back_populates="bids")
    buyer = relationship("User", back_populates="bids")
    transaction = relationship("Transaction", back_populates="bid", uselist=False)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bid_id = Column(UUID(as_uuid=True), ForeignKey("bids.id"), nullable=False)
    razorpay_payment_id = Column(String(100))
    amount = Column(Float, nullable=False)
    status = Column(Enum(PaymentStatus), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    bid = relationship("Bid", back_populates="transaction")

class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rated_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    review_text = Column(Text)
    reviewer_type = Column(Enum(UserType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    rated_user = relationship("User", foreign_keys=[rated_user_id], back_populates="ratings_received")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="ratings_given")

class Sponsor(Base):
    __tablename__ = "sponsors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    organization = Column(String(200))
    total_funded = Column(Float, default=0.0)
    active_sponsorships = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    collectives = relationship("Collective", back_populates="sponsor")

class PriceForecast(Base):
    __tablename__ = "price_forecasts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    crop_name = Column(String(50), nullable=False)
    current_price = Column(Float, nullable=False)
    predicted_price = Column(Float, nullable=False)
    change_percent = Column(Float, nullable=False)
    confidence_score = Column(Float, default=0.0)
    forecast_period_days = Column(Integer, default=7)
    reason = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

# MSP Data (Government Minimum Support Prices)
MSP_DATA = {
    'wheat': 2275,
    'rice': 2300,
    'tomato': 50,
    'onion': 35,
    'cotton': 6620,
    'sugarcane': 340,
    'maize': 2090,
    'potato': 25,
    'mustard': 5650,
    'gram': 5440,
    'turmeric': 7600,
    'chilli': 9200,
    'coriander': 7645,
    'cumin': 8200,
    'garlic': 45
}