'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Avatar,
  Box,
  Typography,
  Rating,
  IconButton,
  Tooltip,
  LinearProgress,
  useTheme,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Badge
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  LocalOffer,
  LocationOn,
  Star,
  WhatsApp,
  Phone,
  FilterList,
  Search,
  Schedule,
  EcoOutlined,
  Verified,
  GroupWork,
  Speed,
  Security
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import BidDialog from './BidDialog';

interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  trustScore: number;
  totalSales: number;
  joinedDate: string;
  avatar?: string;
  verified: boolean;
}

interface Listing {
  id: string;
  farmer: Farmer;
  cropName: string;
  variety?: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  mspPrice: number;
  currentBid?: number;
  bidCount: number;
  location: string;
  harvestDate: string;
  listedDate: string;
  status: 'active' | 'bidding' | 'sold' | 'expired';
  timeRemaining: string;
  images: string[];
  description?: string;
  quality: 'A' | 'B' | 'C';
  organic: boolean;
  collective?: {
    poolId: string;
    poolName: string;
    targetQuantity: number;
    currentQuantity: number;
    farmerCount: number;
  };
  views: number;
  lastUpdated: string;
}

const ListingsTable: React.FC = () => {
  const theme = useTheme();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Comprehensive mock data with realistic Indian farmer details
  const mockListings: Listing[] = [
    {
      id: 'L001',
      farmer: {
        id: 'F001',
        name: 'Rajesh Kumar Singh',
        phone: '+91 9876543210',
        location: 'Jaipur, Rajasthan',
        trustScore: 4.8,
        totalSales: 47,
        joinedDate: '2023-01-15',
        verified: true
      },
      cropName: 'Tomato',
      variety: 'Roma',
      quantity: 500,
      unit: 'kg',
      pricePerUnit: 45,
      mspPrice: 50,
      currentBid: 48,
      bidCount: 7,
      location: 'Jaipur, Rajasthan',
      harvestDate: '2024-01-10',
      listedDate: '2024-01-12',
      status: 'bidding',
      timeRemaining: '2h 15m',
      images: ['/api/placeholder/200/150'],
      description: 'Fresh Roma tomatoes, pesticide-free, Grade A quality',
      quality: 'A',
      organic: true,
      views: 127,
      lastUpdated: '5 minutes ago'
    },
    {
      id: 'L002',
      farmer: {
        id: 'F002',
        name: 'Priya Sharma',
        phone: '+91 9876543211',
        location: 'Pune, Maharashtra',
        trustScore: 4.6,
        totalSales: 32,
        joinedDate: '2023-03-20',
        verified: true
      },
      cropName: 'Wheat',
      variety: 'Durum',
      quantity: 2000,
      unit: 'kg',
      pricePerUnit: 2280,
      mspPrice: 2275,
      currentBid: 2290,
      bidCount: 12,
      location: 'Pune, Maharashtra',
      harvestDate: '2024-01-05',
      listedDate: '2024-01-11',
      status: 'bidding',
      timeRemaining: '1d 8h',
      images: ['/api/placeholder/200/150'],
      quality: 'A',
      organic: false,
      collective: {
        poolId: 'P001',
        poolName: 'Maharashtra Wheat Collective',
        targetQuantity: 10000,
        currentQuantity: 7200,
        farmerCount: 23
      },
      views: 89,
      lastUpdated: '12 minutes ago'
    },
    {
      id: 'L003',
      farmer: {
        id: 'F003',
        name: 'Amit Patel',
        phone: '+91 9876543212',
        location: 'Ahmedabad, Gujarat',
        trustScore: 4.9,
        totalSales: 89,
        joinedDate: '2022-08-12',
        verified: true
      },
      cropName: 'Cotton',
      variety: 'BT Cotton',
      quantity: 1500,
      unit: 'kg',
      pricePerUnit: 6650,
      mspPrice: 6620,
      currentBid: 6670,
      bidCount: 5,
      location: 'Ahmedabad, Gujarat',
      harvestDate: '2024-01-08',
      listedDate: '2024-01-13',
      status: 'active',
      timeRemaining: '3d 12h',
      images: ['/api/placeholder/200/150'],
      quality: 'A',
      organic: false,
      views: 156,
      lastUpdated: '8 minutes ago'
    },
    {
      id: 'L004',
      farmer: {
        id: 'F004',
        name: 'Sunita Devi',
        phone: '+91 9876543213',
        location: 'Patna, Bihar',
        trustScore: 4.4,
        totalSales: 28,
        joinedDate: '2023-05-10',
        verified: true
      },
      cropName: 'Rice',
      variety: 'Basmati',
      quantity: 800,
      unit: 'kg',
      pricePerUnit: 3200,
      mspPrice: 3000,
      currentBid: 3250,
      bidCount: 9,
      location: 'Patna, Bihar',
      harvestDate: '2024-01-07',
      listedDate: '2024-01-12',
      status: 'bidding',
      timeRemaining: '4h 30m',
      images: ['/api/placeholder/200/150'],
      quality: 'A',
      organic: true,
      views: 203,
      lastUpdated: '3 minutes ago'
    },
    {
      id: 'L005',
      farmer: {
        id: 'F005',
        name: 'Mohammed Ali Khan',
        phone: '+91 9876543214',
        location: 'Hyderabad, Telangana',
        trustScore: 4.7,
        totalSales: 56,
        joinedDate: '2022-11-08',
        verified: true
      },
      cropName: 'Onion',
      quantity: 1200,
      unit: 'kg',
      pricePerUnit: 38,
      mspPrice: 35,
      bidCount: 3,
      location: 'Hyderabad, Telangana',
      harvestDate: '2024-01-09',
      listedDate: '2024-01-13',
      status: 'active',
      timeRemaining: '5d 2h',
      images: ['/api/placeholder/200/150'],
      quality: 'B',
      organic: false,
      views: 74,
      lastUpdated: '15 minutes ago'
    },
    {
      id: 'L006',
      farmer: {
        id: 'F006',
        name: 'Lakshmi Reddy',
        phone: '+91 9876543215',
        location: 'Bangalore, Karnataka',
        trustScore: 4.5,
        totalSales: 41,
        joinedDate: '2023-02-14',
        verified: true
      },
      cropName: 'Sugarcane',
      quantity: 3000,
      unit: 'kg',
      pricePerUnit: 350,
      mspPrice: 340,
      currentBid: 365,
      bidCount: 8,
      location: 'Bangalore, Karnataka',
      harvestDate: '2024-01-06',
      listedDate: '2024-01-10',
      status: 'bidding',
      timeRemaining: '6h 45m',
      images: ['/api/placeholder/200/150'],
      quality: 'A',
      organic: false,
      views: 98,
      lastUpdated: '7 minutes ago'
    },
    {
      id: 'L007',
      farmer: {
        id: 'F007',
        name: 'Ravi Shankar',
        phone: '+91 9876543216',
        location: 'Lucknow, Uttar Pradesh',
        trustScore: 4.3,
        totalSales: 23,
        joinedDate: '2023-07-22',
        verified: true
      },
      cropName: 'Maize',
      variety: 'Sweet Corn',
      quantity: 1800,
      unit: 'kg',
      pricePerUnit: 2100,
      mspPrice: 2090,
      currentBid: 2120,
      bidCount: 6,
      location: 'Lucknow, Uttar Pradesh',
      harvestDate: '2024-01-11',
      listedDate: '2024-01-13',
      status: 'bidding',
      timeRemaining: '1d 2h',
      images: ['/api/placeholder/200/150'],
      quality: 'A',
      organic: true,
      collective: {
        poolId: 'P002',
        poolName: 'UP Maize Collective',
        targetQuantity: 8000,
        currentQuantity: 4200,
        farmerCount: 15
      },
      views: 112,
      lastUpdated: '10 minutes ago'
    },
    {
      id: 'L008',
      farmer: {
        id: 'F008',
        name: 'Geeta Kumari',
        phone: '+91 9876543217',
        location: 'Chandigarh, Punjab',
        trustScore: 4.8,
        totalSales: 67,
        joinedDate: '2022-09-05',
        verified: true
      },
      cropName: 'Mustard',
      quantity: 900,
      unit: 'kg',
      pricePerUnit: 5700,
      mspPrice: 5650,
      bidCount: 4,
      location: 'Chandigarh, Punjab',
      harvestDate: '2024-01-08',
      listedDate: '2024-01-12',
      status: 'active',
      timeRemaining: '2d 14h',
      images: ['/api/placeholder/200/150'],
      quality: 'A',
      organic: false,
      views: 67,
      lastUpdated: '20 minutes ago'
    }
  ];

  // Load mock data on component mount
  useEffect(() => {
    setTimeout(() => {
      setListings(mockListings);
      setFilteredListings(mockListings);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = listings;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (listing.variety && listing.variety.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    // Crop filter
    if (cropFilter !== 'all') {
      filtered = filtered.filter(listing => listing.cropName.toLowerCase() === cropFilter);
    }

    setFilteredListings(filtered);
  }, [listings, searchQuery, statusFilter, cropFilter]);

  const handleBidClick = (listing: Listing) => {
    setSelectedListing(listing);
    setBidDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'bidding': return 'warning';
      case 'sold': return 'info';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getMSPStatus = (price: number, msp: number) => {
    if (price >= msp) {
      return { status: 'above', color: 'success', text: 'Above MSP', icon: '✓' };
    } else {
      const diff = ((msp - price) / msp * 100).toFixed(1);
      return { status: 'below', color: 'error', text: `${diff}% below MSP`, icon: '⚠' };
    }
  };

  const getPriceChangeIcon = (currentBid?: number, originalPrice?: number) => {
    if (!currentBid || !originalPrice) return null;
    return currentBid > originalPrice ? 
      <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} /> : 
      <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />;
  };

  const uniqueCrops = [...new Set(listings.map(l => l.cropName.toLowerCase()))];

  const getTimeUrgency = (timeRemaining: string) => {
    if (timeRemaining.includes('h') && !timeRemaining.includes('d')) {
      return 'urgent';
    } else if (timeRemaining.includes('1d') || timeRemaining.includes('2d')) {
      return 'soon';
    }
    return 'normal';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'error';
      case 'soon': return 'warning';
      default: return 'success';
    }
  };

  if (loading) {
    return (
      <Box>
        {[...Array(8)].map((_, i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <LinearProgress sx={{ width: '100%', borderRadius: 1 }} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {filteredListings.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Active Listings
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
              {filteredListings.filter(l => l.status === 'bidding').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Live Bidding
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
              {filteredListings.filter(l => l.collective).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Collective Pools
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'secondary.main' }}>
              {filteredListings.reduce((sum, l) => sum + l.views, 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Views
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search crops, farmers, locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="bidding">Live Bidding</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Crop Type</InputLabel>
          <Select
            value={cropFilter}
            label="Crop Type"
            onChange={(e) => setCropFilter(e.target.value)}
          >
            <MenuItem value="all">All Crops</MenuItem>
            {uniqueCrops.map(crop => (
              <MenuItem key={crop} value={crop}>
                {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="body2" color="text.secondary">
          {filteredListings.length} listings • Updated live
        </Typography>
      </Box>

      {/* Listings Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.50' }}>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Farmer & Crop</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Details & Quality</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Price & MSP</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Bids & Time</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {filteredListings.map((listing, index) => {
                const mspStatus = getMSPStatus(listing.pricePerUnit, listing.mspPrice);
                const urgency = getTimeUrgency(listing.timeRemaining);
                
                return (
                  <motion.tr
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    component={TableRow}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: 'primary.50',
                        transform: 'scale(1.005)',
                        transition: 'all 0.2s ease',
                        boxShadow: 1
                      },
                      cursor: 'pointer'
                    }}
                  >
                    {/* Farmer & Crop Column */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            listing.farmer.verified ? (
                              <Verified sx={{ color: 'success.main', fontSize: 16 }} />
                            ) : null
                          }
                        >
                          <Avatar 
                            src={listing.farmer.avatar} 
                            sx={{ bgcolor: 'primary.main', width: 45, height: 45 }}
                          >
                            {listing.farmer.name.charAt(0)}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {listing.farmer.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Rating 
                              value={listing.farmer.trustScore} 
                              size="small" 
                              readOnly 
                              precision={0.1}
                              sx={{ fontSize: '1rem' }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              ({listing.farmer.totalSales})
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                            {listing.farmer.location}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Details & Quality Column */}
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {listing.cropName}
                          {listing.variety && (
                            <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                              ({listing.variety})
                            </Typography>
                          )}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                          <Chip 
                            label={`Grade ${listing.quality}`} 
                            size="small" 
                            color={listing.quality === 'A' ? 'success' : listing.quality === 'B' ? 'warning' : 'error'}
                          />
                          {listing.organic && (
                            <Chip 
                              label="Organic" 
                              size="small" 
                              color="success"
                              icon={<EcoOutlined sx={{ fontSize: 14 }} />}
                            />
                          )}
                          {listing.collective && (
                            <Chip 
                              label={`Pool (${listing.collective.farmerCount})`}
                              size="small" 
                              color="warning"
                              icon={<GroupWork sx={{ fontSize: 14 }} />}
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          <Schedule sx={{ fontSize: 12, mr: 0.5 }} />
                          Harvested: {listing.harvestDate} • {listing.views} views
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Quantity Column */}
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {listing.quantity.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {listing.unit}
                      </Typography>
                      {listing.collective && (
                        <LinearProgress
                          variant="determinate"
                          value={(listing.collective.currentQuantity / listing.collective.targetQuantity) * 100}
                          sx={{ 
                            mt: 1, 
                            height: 4, 
                            borderRadius: 2,
                            bgcolor: 'warning.100',
                            '& .MuiLinearProgress-bar': { bgcolor: 'warning.main' }
                          }}
                        />
                      )}
                    </TableCell>

                    {/* Price & MSP Column */}
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ₹{listing.pricePerUnit.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        per {listing.unit}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={mspStatus.text}
                          size="small"
                          color={mspStatus.color as any}
                          icon={<span style={{ fontSize: '0.7rem' }}>{mspStatus.icon}</span>}
                          sx={{ fontSize: '0.65rem', height: 20 }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        MSP: ₹{listing.mspPrice}/{listing.unit}
                      </Typography>
                    </TableCell>

                    {/* Bids & Time Column */}
                    <TableCell>
                      {listing.currentBid ? (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                              ₹{listing.currentBid.toLocaleString()}
                            </Typography>
                            {getPriceChangeIcon(listing.currentBid, listing.pricePerUnit)}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {listing.bidCount} bids
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No bids yet
                        </Typography>
                      )}
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={listing.timeRemaining}
                          size="small"
                          color={getUrgencyColor(urgency) as any}
                          icon={<Speed sx={{ fontSize: 14 }} />}
                          sx={{ fontSize: '0.65rem' }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Updated: {listing.lastUpdated}
                      </Typography>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <Chip 
                        label={listing.status.toUpperCase()} 
                        color={getStatusColor(listing.status) as any}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      {listing.status === 'bidding' && (
                        <Box 
                          sx={{ 
                            width: 8, 
                            height: 8, 
                            bgcolor: 'success.main', 
                            borderRadius: '50%',
                            mt: 1,
                            mx: 'auto',
                            animation: 'pulse 2s infinite'
                          }}
                        />
                      )}
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<LocalOffer />}
                          onClick={() => handleBidClick(listing)}
                          disabled={listing.status === 'sold' || listing.status === 'expired'}
                          sx={{ 
                            minWidth: 120,
                            background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #43a047 30%, #4caf50 90%)'
                            }
                          }}
                        >
                          {listing.currentBid ? 'Bid Higher' : 'Place Bid'}
                        </Button>
                        
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title={`WhatsApp ${listing.farmer.name}`}>
                            <IconButton
                              size="small"
                              onClick={() => window.open(`https://wa.me/${listing.farmer.phone.replace('+', '')}?text=Hi! Interested in your ${listing.cropName} listing ${listing.id}`)}
                              sx={{ 
                                color: '#25d366',
                                bgcolor: 'rgba(37, 211, 102, 0.1)',
                                '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.2)' }
                              }}
                            >
                              <WhatsApp sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={`Call ${listing.farmer.name}`}>
                            <IconButton
                              size="small"
                              onClick={() => window.open(`tel:${listing.farmer.phone}`)}
                              sx={{ 
                                color: 'primary.main',
                                bgcolor: 'primary.50',
                                '&:hover': { bgcolor: 'primary.100' }
                              }}
                            >
                              <Phone sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Secure Transaction">
                            <IconButton
                              size="small"
                              sx={{ 
                                color: 'success.main',
                                bgcolor: 'success.50'
                              }}
                            >
                              <Security sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      {/* No Results Message */}
      {filteredListings.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ textAlign: 'center', py: 6, mt: 3 }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  🔍 No listings found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your filters or search query to find what you're looking for.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCropFilter('all');
                    }}
                  >
                    Clear All Filters
                  </Button>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => window.open('https://wa.me/14155238886?text=LIST%20tomato%20100kg%2045%2Fkg%20YourCity')}
                  >
                    List Your Crop
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card sx={{ mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Live Marketplace:</strong> {filteredListings.length} active listings • 
                  {filteredListings.filter(l => l.status === 'bidding').length} live auctions • 
                  Updated every 30 seconds
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                  <Button 
                    variant="contained"
                    size="small"
                    startIcon={<WhatsApp />}
                    onClick={() => window.open('https://wa.me/14155238886?text=HELP')}
                    sx={{ bgcolor: '#25d366', '&:hover': { bgcolor: '#128c7e' } }}
                  >
                    Get Help
                  </Button>
                  <Button 
                    variant="outlined"
                    size="small"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bid Dialog */}
      <BidDialog
        open={bidDialogOpen}
        onClose={() => setBidDialogOpen(false)}
        listing={selectedListing}
      />

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default ListingsTable;
