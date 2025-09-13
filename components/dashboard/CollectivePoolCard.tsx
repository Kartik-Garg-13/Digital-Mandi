'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  GroupWork,
  TrendingUp,
  LocalShipping,
  AccountBalance,
  WhatsApp,
  Add,
  Timer,
  EcoOutlined,
  Star
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface CollectivePool {
  id: string;
  name: string;
  crop: string;
  targetQuantity: number;
  currentQuantity: number;
  farmerCount: number;
  expectedPrice: number;
  mspPrice: number;
  timeRemaining: string;
  status: 'active' | 'filling' | 'ready' | 'completed';
  benefits: string[];
  participants: Array<{
    id: string;
    name: string;
    quantity: number;
    location: string;
    avatar?: string;
  }>;
  estimatedSavings: number;
  qualityGrade: 'A' | 'B' | 'C';
  organic: boolean;
}

const CollectivePoolCard: React.FC = () => {
  const theme = useTheme();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<CollectivePool | null>(null);
  const [joinQuantity, setJoinQuantity] = useState('');

  const pools: CollectivePool[] = [
    {
      id: 'P001',
      name: 'Rajasthan Wheat Collective',
      crop: 'Wheat',
      targetQuantity: 5000,
      currentQuantity: 3700,
      farmerCount: 23,
      expectedPrice: 2350,
      mspPrice: 2275,
      timeRemaining: '2 days',
      status: 'filling',
      benefits: ['18% price premium', 'Shared logistics', 'Bulk buyer access'],
      participants: [
        { id: 'F001', name: 'Rajesh Kumar', quantity: 200, location: 'Jaipur', avatar: '/api/placeholder/40/40' },
        { id: 'F002', name: 'Amit Sharma', quantity: 150, location: 'Jodhpur' },
        { id: 'F003', name: 'Sunil Gupta', quantity: 300, location: 'Bikaner' },
        { id: 'F004', name: 'Priya Devi', quantity: 180, location: 'Udaipur' }
      ],
      estimatedSavings: 25,
      qualityGrade: 'A',
      organic: false
    },
    {
      id: 'P002',
      name: 'Maharashtra Tomato Pool',
      crop: 'Tomato',
      targetQuantity: 2000,
      currentQuantity: 1450,
      farmerCount: 18,
      expectedPrice: 52,
      mspPrice: 50,
      timeRemaining: '1 day',
      status: 'filling',
      benefits: ['15% price boost', 'Quality assurance', 'Fast payments'],
      participants: [
        { id: 'F005', name: 'Priya Sharma', quantity: 120, location: 'Pune' },
        { id: 'F006', name: 'Ravi Patil', quantity: 100, location: 'Mumbai' },
        { id: 'F007', name: 'Sunita Modi', quantity: 80, location: 'Nashik' }
      ],
      estimatedSavings: 20,
      qualityGrade: 'A',
      organic: true
    },
    {
      id: 'P003',
      name: 'Karnataka Maize Alliance',
      crop: 'Maize',
      targetQuantity: 8000,
      currentQuantity: 2100,
      farmerCount: 12,
      expectedPrice: 2150,
      mspPrice: 2090,
      timeRemaining: '5 days',
      status: 'active',
      benefits: ['22% higher returns', 'Export opportunities', 'Tech support'],
      participants: [
        { id: 'F008', name: 'Mohammed Ali', quantity: 300, location: 'Bangalore' },
        { id: 'F009', name: 'Lakshmi Reddy', quantity: 250, location: 'Mysore' }
      ],
      estimatedSavings: 30,
      qualityGrade: 'A',
      organic: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'filling': return 'warning';
      case 'ready': return 'success';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleJoinPool = (pool: CollectivePool) => {
    setSelectedPool(pool);
    setJoinDialogOpen(true);
  };

  const handleJoinSubmit = () => {
    setJoinDialogOpen(false);
    setSelectedPool(null);
    setJoinQuantity('');
  };

  const topPool = pools[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card sx={{ borderRadius: 3, height: '100%' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'warning.main' }}>
              <GroupWork />
            </Avatar>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Collective Pools
            </Typography>
          }
          subheader="Pool resources for better prices"
        />

        <CardContent>
          <Box sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2, 
            bgcolor: 'warning.50',
            border: '1px solid',
            borderColor: 'warning.200'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {topPool.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Chip 
                    label={topPool.crop} 
                    size="small" 
                    color="primary"
                  />
                  <Chip 
                    label={`Grade ${topPool.qualityGrade}`} 
                    size="small"
                  />
                  {topPool.organic && (
                    <Chip 
                      label="Organic" 
                      size="small" 
                      color="success"
                      icon={<EcoOutlined />}
                    />
                  )}
                </Box>
              </Box>
              <Chip 
                label={topPool.status.toUpperCase()} 
                size="small"
                color={getStatusColor(topPool.status) as any}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {topPool.currentQuantity.toLocaleString()} / {topPool.targetQuantity.toLocaleString()} kg
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={getProgressPercentage(topPool.currentQuantity, topPool.targetQuantity)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'warning.100',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: 'warning.main'
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {getProgressPercentage(topPool.currentQuantity, topPool.targetQuantity).toFixed(1)}% complete
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                  ₹{topPool.expectedPrice}
                </Typography>
                <Typography variant="caption" color="text.secondary">Expected Price/kg</Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {topPool.farmerCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">Farmers Joined</Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {topPool.timeRemaining}
                </Typography>
                <Typography variant="caption" color="text.secondary">Time Left</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.8rem' } }}>
                  {topPool.participants.map((participant) => (
                    <Avatar
                      key={participant.id}
                      src={participant.avatar}
                      alt={participant.name}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {participant.name.charAt(0)}
                    </Avatar>
                  ))}
                </AvatarGroup>
                <Typography variant="caption" color="text.secondary">
                  +{topPool.farmerCount - topPool.participants.length} more
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Pool Benefits:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                {topPool.benefits.map((benefit, index) => (
                  <Chip
                    key={index}
                    label={benefit}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.65rem', height: 20 }}
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={() => handleJoinPool(topPool)}
              sx={{ borderRadius: 2 }}
            >
              Join Pool
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Other Active Pools
          </Typography>
          
          <List sx={{ p: 0 }}>
            {pools.slice(1).map((pool) => (
              <motion.div
                key={pool.id}
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                transition={{ duration: 0.2 }}
              >
                <ListItem sx={{ px: 0, py: 1, borderRadius: 1 }}>
                  <ListItemIcon>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${getStatusColor(pool.status)}.main`,
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem'
                      }}
                    >
                      {pool.crop.charAt(0)}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {pool.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {getProgressPercentage(pool.currentQuantity, pool.targetQuantity).toFixed(0)}% filled • 
                          {pool.farmerCount} farmers • ₹{pool.expectedPrice}/kg
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={getProgressPercentage(pool.currentQuantity, pool.targetQuantity)}
                          sx={{ 
                            height: 4, 
                            borderRadius: 2, 
                            mt: 0.5,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: `${getStatusColor(pool.status)}.main`,
                              borderRadius: 2
                            }
                          }}
                        />
                      </Box>
                    }
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleJoinPool(pool)}
                    sx={{ ml: 1 }}
                  >
                    Join
                  </Button>
                </ListItem>
              </motion.div>
            ))}
          </List>

          <Box sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'primary.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.200'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Collective Power Impact
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                  847
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Farmers
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  ₹2.1Cr
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Pool Value
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  23%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Avg. Savings
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<WhatsApp />}
            onClick={() => window.open('https://wa.me/14155238886?text=COLLECTIVE')}
            sx={{ 
              mt: 2,
              color: '#25d366',
              borderColor: '#25d366',
              '&:hover': {
                bgcolor: 'rgba(37, 211, 102, 0.04)',
                borderColor: '#25d366'
              }
            }}
          >
            Get Pool Updates on WhatsApp
          </Button>
        </CardContent>
      </Card>

      <Dialog 
        open={joinDialogOpen} 
        onClose={() => setJoinDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Join Collective Pool
          {selectedPool && (
            <Typography variant="body2" color="text.secondary">
              {selectedPool.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedPool && (
            <Box sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Your Quantity (kg)"
                type="number"
                value={joinQuantity}
                onChange={(e) => setJoinQuantity(e.target.value)}
                inputProps={{ min: 1, max: 1000 }}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Expected Benefits:
              </Typography>
              <List dense>
                {selectedPool.benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={benefit}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJoinDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleJoinSubmit}
            disabled={!joinQuantity}
          >
            Join Pool
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default CollectivePoolCard;
