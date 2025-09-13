from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from database import get_db
from models import Listing, User, Collective, Bid, Rating, PriceForecast, MSP_DATA

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/")
async def get_listings(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    location: Optional[str] = Query(None, description="Filter by location"),
    above_msp: Optional[bool] = Query(None, description="Filter by MSP compliance"),
    premium: Optional[bool] = Query(None, description="Filter by premium farmers"),
    collective: Optional[bool] = Query(None, description="Filter by collective listings"),
    limit: Optional[int] = Query(50, description="Number of results"),
    db: AsyncSession = Depends(get_db)
):
    """Get listings with filtering"""
    try:
        query = select(Listing).options(
            selectinload(Listing.farmer),
            selectinload(Listing.collective),
            selectinload(Listing.bids)
        ).where(Listing.status == "active")
        
        if crop:
            query = query.where(Listing.crop_name.ilike(f"%{crop}%"))
        if location:
            query = query.where(Listing.location.ilike(f"%{location}%"))
        if above_msp is not None:
            query = query.where(Listing.above_msp == above_msp)
        if premium is not None:
            query = query.where(Listing.is_premium == premium)
        if collective is not None:
            if collective:
                query = query.where(Listing.collective_id.isnot(None))
            else:
                query = query.where(Listing.collective_id.is_(None))
        
        query = query.order_by(Listing.created_at.desc()).limit(limit)
        
        result = await db.execute(query)
        listings = result.scalars().all()
        
        formatted_listings = []
        for listing in listings:
            formatted_listing = {
                "id": listing.id,
                "crop_name": listing.crop_name,
                "crop_name_local": listing.crop_name_local,
                "quantity_kg": listing.quantity_kg,
                "price_per_kg": listing.price_per_kg,
                "location": listing.location,
                "description": listing.description,
                "current_bid": listing.current_bid,
                "msp_price": listing.msp_price,
                "above_msp": listing.above_msp,
                "is_premium": listing.is_premium,
                "transport_cost_per_kg": listing.transport_cost_per_kg,
                "pickup_distance_km": listing.pickup_distance_km,
                "collective_id": listing.collective_id,
                "farmer": {
                    "name": listing.farmer.name,
                    "trust_score": listing.farmer.trust_score,
                    "phone": listing.farmer.phone,
                    "total_ratings": listing.farmer.total_ratings
                },
                "collective": {
                    "id": listing.collective.id,
                    "farmer_count": listing.collective.farmer_count,
                    "total_quantity_kg": listing.collective.total_quantity_kg,
                    "is_sponsored": listing.collective.is_sponsored
                } if listing.collective else None,
                "created_at": listing.created_at.isoformat(),
                "bid_count": len(listing.bids) if listing.bids else 0
            }
            formatted_listings.append(formatted_listing)
        
        return {"listings": formatted_listings, "total": len(formatted_listings)}
        
    except Exception as e:
        logger.error(f"Error fetching listings: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch listings")

@router.get("/stats")
async def get_marketplace_stats(db: AsyncSession = Depends(get_db)):
    """Get marketplace statistics"""
    try:
        # Get basic counts
        farmer_count = await db.execute(select(func.count(User.id)).where(User.user_type == "farmer"))
        buyer_count = await db.execute(select(func.count(User.id)).where(User.user_type == "buyer"))
        listing_count = await db.execute(select(func.count(Listing.id)).where(Listing.status == "active"))
        
        # Transaction value
        transaction_sum = await db.execute(
            select(func.sum(Bid.total_amount)).where(
                and_(Bid.is_winning == True, Bid.payment_status == "released")
            )
        )
        
        # Trust score average
        trust_avg = await db.execute(select(func.avg(User.trust_score)).where(User.trust_score > 0))
        
        # MSP compliance
        msp_compliance = await db.execute(
            select(
                func.count(Listing.id).filter(Listing.above_msp == True),
                func.count(Listing.id)
            ).where(Listing.status == "active")
        )
        compliance_data = msp_compliance.first()
        msp_rate = (compliance_data[0] / compliance_data[1] * 100) if compliance_data[1] > 0 else 0
        
        return {
            "total_farmers": farmer_count.scalar() or 0,
            "active_buyers": buyer_count.scalar() or 0,
            "total_listings": listing_count.scalar() or 0,
            "transaction_value": transaction_sum.scalar() or 0,
            "avg_trust_score": round(trust_avg.scalar() or 0, 1),
            "msp_compliance_rate": round(msp_rate, 1),
            "avg_price_increase": 23.4  # Mock value
        }
        
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")