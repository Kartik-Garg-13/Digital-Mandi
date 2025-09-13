'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Phone,
  WhatsApp,
  LocationOn,
  TrendingUp,
  TrendingDown,
  Schedule,
  Security,
  Verified,
  GroupWork,
  LocalOffer,
  Speed,
  NaturePeople,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import BidDialog from './BidDialog';

interface Listing {
  id: string;
  farmer: {
    name: string;
    avatar: string;
    rating: number;
    totalSales: number;
    location: string;
    verified: boolean;
    phone: string;
    whatsapp: string;
  };
  crop: {
    name: string;
    variety: string;
    quantity: string;
    unit: string;
    quality: 'A' | 'B' | 'C';
    organic: boolean;
    harvestDate: string;
  };
  pricing: {
    current: number;
    msp: number;
    marketPrice: number;
  };
  location: string;
  posted: string;
  bidsCount: number;
  highestBid: number;
  collectivePool: boolean;
  urgency: 'low' | 'medium' | 'high';
  views: number;
  lastUpdated: string;
}

// Enhanced mock data with more realistic farmers
const mockListings: Listing[] = [
  {
    id: 'L001',
    farmer: {
      name: 'Rajesh Kumar',
      avatar: '/api/placeholder/40/40',
      rating: 4.8,
      totalSales: 156,
      location: 'Jaipur, Rajasthan',
      verified: true,
      phone: '+91-9876543210',
      whatsapp: '+919876543210'
    },
    crop: {
      name: 'Tomato',
      variety: 'Roma',
      quantity: '500',
      unit: 'kg',
      quality: 'A',
      organic: true,
      harvestDate: '2025-09-10'
    },
    pricing: {
      current: 45,
      msp: 42,
      marketPrice: 48
    },
    location: 'Jaipur, Rajasthan',
    posted: '2 hours ago',
    bidsCount: 12,
    highestBid: 47,
    collectivePool: false,
    urgency: 'high',
    views: 89,
    lastUpdated: '30 mins ago'
  },
  {
    id: 'L002',
    farmer: {
      name: 'Priya Sharma',
      avatar: '/api/placeholder/40/40',
      rating: 4.9,
      totalSales: 203,
      location: 'Udaipur, Rajasthan',
      verified: true,
      phone: '+91-9876543211',
      whatsapp: '+919876543211'
    },
    crop: {
      name: 'Wheat',
      variety: 'Durum',
      quantity: '2000',
      unit: 'kg',
      quality: 'A',
      organic: false,
      harvestDate: '2025-09-08'
    },
    pricing: {
      current: 28,
      msp: 25,
      marketPrice: 30
    },
    location: 'Udaipur, Rajasthan',
    posted: '4 hours ago',
    bidsCount: 8,
    highestBid: 29,
    collectivePool: true,
    urgency: 'medium',
    views: 67,
    lastUpdated: '1 hour ago'
  },
  {
    id: 'L003',
    farmer: {
      name: 'Amit Singh',
      avatar: '/api/placeholder/40/40',
      rating: 4.6,
      totalSales: 89,
      location: 'Jodhpur, Rajasthan',
      verified: true,
      phone: '+91-9876543212',
      whatsapp: '+919876543212'
    },
    crop: {
      name: 'Cotton',
      variety: 'BT Cotton',
      quantity: '1500',
      unit: 'kg',
      quality: 'B',
      organic: false,
      harvestDate: '2025-09-12'
    },
    pricing: {
      current: 68,
      msp: 65,
      marketPrice: 72
    },
    location: 'Jodhpur, Rajasthan',
    posted: '6 hours ago',
    bidsCount: 15,
    highestBid: 70,
    collectivePool: false,
    urgency: 'low',
    views: 134,
    lastUpdated: '2 hours ago'
  },
  {
    id: 'L004',
    farmer: {
      name: 'Sunita Devi',
      avatar: '/api/placeholder/40/40',
      rating: 4.7,
      totalSales: 167,
      location: 'Kota, Rajasthan',
      verified: true,
      phone: '+91-9876543213',
      whatsapp: '+919876543213'
    },
    crop: {
      name: 'Rice',
      variety: 'Basmati',
      quantity: '800',
      unit: 'kg',
      quality: 'A',
      organic: true,
      harvestDate: '2025-09-09'
    },
    pricing: {
      current: 52,
      msp: 48,
      marketPrice: 55
    },
    location: 'Kota, Rajasthan',
    posted: '8 hours ago',
    bidsCount: 23,
    highestBid: 54,
    collectivePool: true,
    urgency: 'medium',
    views: 198,
    lastUpdated: '3 hours ago'
  },
  {
    id: 'L005',
    farmer: {
      name: 'Mohan Lal',
      avatar: '/api/placeholder/40/40',
      rating: 4.5,
      totalSales: 112,
      location: 'Bikaner, Rajasthan',
      verified: false,
      phone: '+91-9876543214',
      whatsapp: '+919876543214'
    },
    crop: {
      name: 'Mustard',
      variety: 'Yellow Sarson',
      quantity: '600',
      unit: 'kg',
      quality: 'B',
      organic: false,
      harvestDate: '2025-09-11'
    },
    pricing: {
      current: 75,
      msp: 70,
      marketPrice: 78
    },
    location: 'Bikaner, Rajasthan',
    posted: '12 hours ago',
    bidsCount: 6,
    highestBid: 76,
    collectivePool: false,
    urgency: 'low',
    views: 45,
    lastUpdated: '4 hours ago'
  },
  {
    id: 'L006',
    farmer: {
      name: 'Geeta Rani',
      avatar: '/api/placeholder/40/40',
      rating: 4.9,
      totalSales: 298,
      location: 'Ajmer, Rajasthan',
      verified: true,
      phone: '+91-9876543215',
      whatsapp: '+919876543215'
    },
    crop: {
      name: 'Onion',
      variety: 'Red Onion',
      quantity: '1200',
      unit: 'kg',
      quality: 'A',
      organic: true,
      harvestDate: '2025-09-07'
    },
    pricing: {
      current: 22,
      msp: 18,
      marketPrice: 25
    },
    location: 'Ajmer, Rajasthan',
    posted: '1 day ago',
    bidsCount: 19,
    highestBid: 24,
    collectivePool: true,
    urgency: 'high',
    views: 156,
    lastUpdated: '5 hours ago'
  },
  {
    id: 'L007',
    farmer: {
      name: 'Ravi Gupta',
      avatar: '/api/placeholder/40/40',
      rating: 4.4,
      totalSales: 73,
      location: 'Alwar, Rajasthan',
      verified: true,
      phone: '+91-9876543216',
      whatsapp: '+919876543216'
    },
    crop: {
      name: 'Barley',
      variety: 'Six-row',
      quantity: '900',
      unit: 'kg',
      quality: 'C',
      organic: false,
      harvestDate: '2025-09-13'
    },
    pricing: {
      current: 32,
      msp: 28,
      marketPrice: 35
    },
    location: 'Alwar, Rajasthan',
    posted: '1 day ago',
    bidsCount: 4,
    highestBid: 33,
    collectivePool: false,
    urgency: 'medium',
    views: 32,
    lastUpdated: '6 hours ago'
  },
  {
    id: 'L008',
    farmer: {
      name: 'Krishna Devi',
      avatar: '/api/placeholder/40/40',
      rating: 4.8,
      totalSales: 234,
      location: 'Bharatpur, Rajasthan',
      verified: true,
      phone: '+91-9876543217',
      whatsapp: '+919876543217'
    },
    crop: {
      name: 'Chickpea',
      variety: 'Kabuli',
      quantity: '700',
      unit: 'kg',
      quality: 'A',
      organic: true,
      harvestDate: '2025-09-06'
    },
    pricing: {
      current: 88,
      msp: 85,
      marketPrice: 92
    },
    location: 'Bharatpur, Rajasthan',
    posted: '2 days ago',
    bidsCount: 31,
    highestBid: 91,
    collectivePool: true,
    urgency: 'low',
    views: 267,
    lastUpdated: '8 hours ago'
  }
];

const ListingsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);

  const filteredListings = mockListings.filter(listing =>
    listing.crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBidClick = (listing: Listing) => {
    setSelectedListing(listing);
    setBidDialogOpen(true);
  };

  const handleBidSubmit = (bidData: any) => {
    console.log('Bid submitted:', bidData);
    setBidDialogOpen(false);
    setSelectedListing(null);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const openWhatsApp = (listing: Listing) => {
    const message = `Hi ${listing.farmer.name}, I saw your ${listing.crop.name} listing. Can we discuss?`;
    window.open(`https://wa.me/${listing.farmer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
  };

  return (
    <Box>
      {/* Header Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {mockListings.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Listings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {mockListings.reduce((sum, listing) => sum + listing.bidsCount, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live Bids
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {mockListings.filter(l => l.collectivePool).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Collective Pools
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {mockListings.reduce((sum, listing) => sum + listing.views, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Views
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by crop, farmer, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600 }}
        />
      </Box>

      {/* Enhanced Listings Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'primary.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Farmer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Crop Details</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pricing</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence>
              {filteredListings.map((listing, index) => (
                <motion.tr
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  component={TableRow}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    cursor: 'pointer',
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          listing.farmer.verified ? (
                            <Verified sx={{ fontSize: 16, color: 'primary.main' }} />
                          ) : null
                        }
                      >
                        <Avatar src={listing.farmer.avatar} sx={{ width: 40, height: 40 }}>
                          {listing.farmer.name.charAt(0)}
                        </Avatar>
                      </Badge>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {listing.farmer.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            ⭐ {listing.farmer.rating}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            • {listing.farmer.totalSales} sales
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <LocationOn sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {listing.farmer.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {listing.crop.name} - {listing.crop.variety}
                        </Typography>
                        <Chip
                          label={`Grade ${listing.crop.quality}`}
                          size="small"
                          color={
                            listing.crop.quality === 'A' ? 'success' :
                            listing.crop.quality === 'B' ? 'warning' : 'error'
                          }
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {listing.crop.quantity} {listing.crop.unit}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {listing.crop.organic && (
                          <Chip
                            icon={<NaturePeople />}
                            label="Organic"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                        {listing.collectivePool && (
                          <Chip
                            icon={<GroupWork />}
                            label="Pool"
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ₹{listing.pricing.current}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">/kg</Typography>
                        {listing.pricing.current > listing.pricing.msp ? (
                          <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          MSP: ₹{listing.pricing.msp}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Market: ₹{listing.pricing.marketPrice}
                        </Typography>
                      </Box>
                      {listing.highestBid > 0 && (
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 'medium' }}>
                          Highest Bid: ₹{listing.highestBid}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={listing.urgency.charAt(0).toUpperCase() + listing.urgency.slice(1)}
                          color={getUrgencyColor(listing.urgency) as any}
                          size="small"
                        />
                        {listing.bidsCount > 0 && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <Badge badgeContent={listing.bidsCount} color="error">
                              <LocalOffer sx={{ color: 'primary.main' }} />
                            </Badge>
                          </motion.div>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {listing.posted}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Speed sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {listing.views} views
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleBidClick(listing)}
                        startIcon={<LocalOffer />}
                        sx={{ minWidth: 100 }}
                      >
                        Place Bid
                      </Button>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Call Farmer">
                          <IconButton
                            size="small"
                            onClick={() => window.open(`tel:${listing.farmer.phone}`)}
                            sx={{ bgcolor: 'action.hover' }}
                          >
                            <Phone sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="WhatsApp">
                          <IconButton
                            size="small"
                            onClick={() => openWhatsApp(listing)}
                            sx={{ bgcolor: '#25D366', color: 'white', '&:hover': { bgcolor: '#128C7E' } }}
                          >
                            <WhatsApp sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Secure Payment">
                          <IconButton
                            size="small"
                            sx={{ bgcolor: 'action.hover' }}
                          >
                            <Security sx={{ fontSize: 16, color: 'success.main' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No listings found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search criteria or check back later for new listings
          </Typography>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </Box>
      )}

      {/* Footer Stats */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              <motion.span
                animate={{ color: ['#666', '#2196F3', '#666'] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                🟢 Live Marketplace
              </motion.span>
              • Updated every 30 seconds
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Total Volume: ₹18.75L+ • Zero Fraud • 23% Avg Savings
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
              {mockListings.filter(l => l.farmer.verified).length}/{mockListings.length} Verified Farmers
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Bid Dialog */}
      <BidDialog
        open={bidDialogOpen}
        onClose={() => setBidDialogOpen(false)}
        listing={selectedListing}
        onBidSubmit={handleBidSubmit}
      />
    </Box>
  );
};

export default ListingsTable;
