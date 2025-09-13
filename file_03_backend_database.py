import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Base

# Database URL - use environment variable or default to SQLite for development
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://farmer_user:password123@localhost/farmer_marketplace_kartik"
)

# For development with SQLite (if PostgreSQL not available)
if os.getenv("ENVIRONMENT") == "development" and "postgresql" not in DATABASE_URL:
    DATABASE_URL = "sqlite+aiosqlite:///./farmer_marketplace_kartik.db"

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True if os.getenv("ENVIRONMENT") == "development" else False,
    future=True
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def get_db():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Initialize database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)