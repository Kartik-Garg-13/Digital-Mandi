'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  GroupWork,
  Add,
  Timer,
  NaturePeople,
  Star
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Pool {
  id: string;
  crop: string;
  targetQuantity: number;
  currentQuantity: number;
  farmers: {
    name: string;
    avatar: string;
    quantity: number;
  }[];
  endDate: string;
  pricePerKg: number;
  organic: boolean;
}

const mockPools: Pool[] = [
  {
    id: 'POOL-001',
    crop: 'Basmati Rice',
    targetQuantity: 5000,
    currentQuantity: 3200,
    farmers: [
      { name: 'Rajesh Kumar', avatar: '/api/placeholder/32/32', quantity: 800 },
      { name: 'Priya Sharma', avatar: '/api/placeholder/32/32', quantity: 1200 },
      { name: 'Amit Singh', avatar: '/api/placeholder/32/32', quantity: 600 },
      { name: 'Sunita Devi', avatar: '/api/placeholder/32/32', quantity: 600 },
    ],
    endDate: '2025-09-18',
    pricePerKg: 52,
    organic: true,
  },
  {
    id: 'POOL-002',
    crop: 'Wheat',
    targetQuantity: 10000,
    currentQuantity: 7500,
    farmers: [
      { name: 'Mohan Lal', avatar: '/api/placeholder/32/32', quantity: 2000 },
      { name: 'Geeta Rani', avatar: '/api/placeholder/32/32', quantity: 1500 },
      { name: 'Ravi Gupta', avatar: '/api/placeholder/32/32', quantity: 2000 },
      { name: 'Krishna Devi', avatar: '/api/placeholder/32/32', quantity: 2000 },
    ],
    endDate: '2025-09-20',
    pricePerKg: 28,
    organic: false,
  },
];

const CollectivePoolCard: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');

  const handleJoinPool = () => {
    // Simulate joining pool
    setOpenDialog(false);
    setSelectedCrop('');
    setQuantity('');
    setPricePerKg('');
  };

  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupWork sx={{ color: 'primary.main' }} />
            <Typography variant="h6">Collective Pools</Typography>
          </Box>
        }
        action={
          <Button
            startIcon={<Add />}
            variant="outlined"
            size="small"
            onClick={() => setOpenDialog(true)}
          >
            Join Pool
          </Button>
        }
      />
      <CardContent>
        <List sx={{ p: 0 }}>
          <AnimatePresence>
            {mockPools.map((pool, index) => (
              <motion.div
                key={pool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem sx={{ px: 0, pb: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {pool.crop}
                        </Typography>
                        {pool.organic && (
                          <Chip
                            icon={<NaturePeople />}
                            label="Organic"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="primary" fontWeight="medium">
                        ₹{pool.pricePerKg}/kg
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pool.currentQuantity.toLocaleString()}/{pool.targetQuantity.toLocaleString()} kg
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(pool.currentQuantity / pool.targetQuantity) * 100}
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: pool.currentQuantity / pool.targetQuantity > 0.8 ? 'success.main' : 'primary.main'
                          }
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28 } }}>
                        {pool.farmers.map((farmer, idx) => (
                          <Avatar
                            key={idx}
                            src={farmer.avatar}
                            alt={farmer.name}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            {farmer.name.charAt(0)}
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Timer sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(pool.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                {index < mockPools.length - 1 && <Divider />}
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
          <Typography variant="body2" color="primary.main" fontWeight="medium" gutterBottom>
            Benefits of Collective Pooling:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Higher prices through bulk selling power<br/>
            • Shared transport costs<br/>
            • Quality certification support<br/>
            • Market access to premium buyers
          </Typography>
        </Box>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Join Collective Pool</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Crop</InputLabel>
              <Select
                value={selectedCrop}
                label="Select Crop"
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <MenuItem value="basmati-rice">Basmati Rice</MenuItem>
                <MenuItem value="wheat">Wheat</MenuItem>
                <MenuItem value="tomato">Tomato</MenuItem>
                <MenuItem value="cotton">Cotton</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Quantity (kg)"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ min: 100, step: 50 }}
            />
            
            <TextField
              fullWidth
              label="Expected Price per kg (₹)"
              type="number"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              inputProps={{ min: 10, step: 0.5 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleJoinPool} 
            variant="contained"
            disabled={!selectedCrop || !quantity || !pricePerKg}
          >
            Join Pool
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default CollectivePoolCard;
