'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Slider,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Close,
  Star,
  Verified,
  Phone,
  WhatsApp,
  Security,
  LocalShipping,
  TrendingUp,
  TrendingDown,
  EcoOutlined,
  Assignment,
  Schedule,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  Payment,
  Shield,
  AccessTime,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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
}

interface BidDialogProps {
  open: boolean;
  onClose: () => void;
  listing: Listing | null;
  onBidSubmit: (bidData: any) => void;
}

const steps = ['Place Bid', 'Secure Payment', 'Confirmation'];

const BidDialog: React.FC<BidDialogProps> = ({ open, onClose, listing, onBidSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const [transportOption, setTransportOption] = useState('self');
  const [loading, setLoading] = useState(false);
  const [showMarketComparison, setShowMarketComparison] = useState(false);
  const [bidData, setBidData] = useState<any>(null);

  if (!listing) return null;

  const totalCost = bidAmount * quantity + (transportOption === 'arrange' ? 500 : 0);
  const savings = (listing.pricing.marketPrice - bidAmount) * quantity;
  const mspCompliant = bidAmount >= listing.pricing.msp;

  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate bid
      if (bidAmount < listing.pricing.msp) {
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Process payment
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newBidData = {
        id: `BID-${Date.now()}`,
        amount: bidAmount,
        quantity,
        totalCost,
        transportOption,
        farmer: listing.farmer,
        crop: listing.crop,
      };
      setBidData(newBidData);
      setLoading(false);
      setActiveStep(2);
    } else {
      // Complete
      onBidSubmit(bidData);
      onClose();
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const openWhatsApp = () => {
    const message = `Hi ${listing.farmer.name}, I'm interested in your ${listing.crop.name} (${listing.crop.variety}) listing. Quantity: ${quantity}kg at ₹${bidAmount}/kg. Can we discuss?`;
    window.open(`https://wa.me/${listing.farmer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
  };

  const renderBidForm = () => (
    <Box sx={{ mt: 2 }}>
      {/* Farmer Profile */}
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={listing.farmer.avatar} sx={{ width: 60, height: 60 }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6">{listing.farmer.name}</Typography>
                {listing.farmer.verified && (
                  <Verified sx={{ color: 'primary.main', fontSize: 20 }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Star sx={{ color: 'warning.main', fontSize: 18 }} />
                  <Typography variant="body2">{listing.farmer.rating}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {listing.farmer.totalSales} sales
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.farmer.location}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<Phone />}
                  onClick={() => window.open(`tel:${listing.farmer.phone}`)}
                >
                  Call
                </Button>
                <Button
                  size="small"
                  startIcon={<WhatsApp />}
                  onClick={openWhatsApp}
                  sx={{ color: '#25D366' }}
                >
                  WhatsApp
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Crop Details */}
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Crop Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Crop & Variety</Typography>
              <Typography variant="body1" fontWeight="medium">
                {listing.crop.name} - {listing.crop.variety}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Available Quantity</Typography>
              <Typography variant="body1" fontWeight="medium">
                {listing.crop.quantity}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Quality Grade</Typography>
              <Chip 
                label={`Grade ${listing.crop.quality}`}
                color={listing.crop.quality === 'A' ? 'success' : listing.crop.quality === 'B' ? 'warning' : 'error'}
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Certifications</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {listing.crop.organic && (
                  <Chip
                    icon={<NaturePeople />}
                    label="Organic"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
                {listing.collectivePool && (
                  <Chip
                    label="Pool"
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Market Price Comparison */}
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">Market Insights</Typography>
            <IconButton
              size="small"
              onClick={() => setShowMarketComparison(!showMarketComparison)}
            >
              {showMarketComparison ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Current Ask</Typography>
                <Typography variant="h6" color="primary">
                  ₹{listing.pricing.current}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">MSP</Typography>
                <Typography variant="h6" color="success.main">
                  ₹{listing.pricing.msp}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">Market Rate</Typography>
                <Typography variant="h6" color="warning.main">
                  ₹{listing.pricing.marketPrice}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Collapse in={showMarketComparison}>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Price Comparison vs Traditional Markets:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TrendingDown sx={{ color: 'success.main', fontSize: 18 }} />
                <Typography variant="body2">
                  Save ₹{(listing.pricing.marketPrice - listing.pricing.current).toFixed(2)}/kg vs market
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Shield sx={{ color: 'primary.main', fontSize: 18 }} />
                <Typography variant="body2">
                  {mspCompliant ? 'MSP Compliant - Fair price guaranteed' : 'Below MSP - Consider higher bid'}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Bid Form */}
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Your Bid</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Bid Amount (₹ per kg)
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              inputProps={{ min: listing.pricing.msp, step: 0.5 }}
              error={bidAmount > 0 && bidAmount < listing.pricing.msp}
              helperText={
                bidAmount > 0 && bidAmount < listing.pricing.msp 
                  ? `Minimum bid: ₹${listing.pricing.msp} (MSP)`
                  : `Recommended: ₹${listing.pricing.current} - ₹${listing.pricing.current + 2}`
              }
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Quantity: {quantity} kg
            </Typography>
            <Slider
              value={quantity}
              onChange={(_, value) => setQuantity(value as number)}
              min={10}
              max={parseInt(listing.crop.quantity)}
              step={10}
              valueLabelDisplay="auto"
              marks={[
                { value: 10, label: '10kg' },
                { value: parseInt(listing.crop.quantity) / 2, label: `${parseInt(listing.crop.quantity) / 2}kg` },
                { value: parseInt(listing.crop.quantity), label: listing.crop.quantity }
              ]}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Transport</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button
                  variant={transportOption === 'self' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => setTransportOption('self')}
                >
                  Self Pickup
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant={transportOption === 'arrange' ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => setTransportOption('arrange')}
                  endIcon={<Typography variant="caption">+₹500</Typography>}
                >
                  Arrange Transport
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Cost Summary */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Crop Cost ({quantity}kg × ₹{bidAmount})</Typography>
              <Typography variant="body2">₹{(bidAmount * quantity).toFixed(2)}</Typography>
            </Box>
            {transportOption === 'arrange' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Transport</Typography>
                <Typography variant="body2">₹500.00</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">Total Cost</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                ₹{totalCost.toFixed(2)}
              </Typography>
            </Box>
            {savings > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="success.main">You Save</Typography>
                <Typography variant="body2" color="success.main">
                  ₹{savings.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>

          {!mspCompliant && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Your bid is below MSP (₹{listing.pricing.msp}). Consider supporting farmers with fair pricing.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderPayment = () => (
    <Box sx={{ mt: 2 }}>
      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'primary.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Security sx={{ color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h6">Secure Escrow Payment</Typography>
              <Typography variant="body2" color="text.secondary">
                Your money is held safely until delivery confirmation
              </Typography>
            </Box>
          </Box>
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Shield sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="100% Fraud Protection"
                secondary="Money released only after quality verification"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Payment sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Bank-Grade Security"
                secondary="SSL encrypted, RBI compliant payment gateway"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AccessTime sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Quick Release"
                secondary="Funds released within 24 hours of delivery"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Payment Summary</Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Crop: {listing.crop.name} ({quantity}kg)</Typography>
              <Typography>₹{(bidAmount * quantity).toFixed(2)}</Typography>
            </Box>
            {transportOption === 'arrange' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Transport</Typography>
                <Typography>₹500.00</Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                ₹{totalCost.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
              <CircularProgress sx={{ mr: 2 }} />
              <Typography>Processing secure payment...</Typography>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              Click "Confirm Payment" to proceed with Razorpay secure checkout
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );

  const renderSuccess = () => (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      </motion.div>
      
      <Typography variant="h5" sx={{ mb: 1 }}>Bid Placed Successfully!</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Your bid has been submitted and payment is secured in escrow
      </Typography>

      <Card sx={{ mb: 3, textAlign: 'left' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Bid Details</Typography>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Bid ID</Typography>
            <Typography variant="body1" fontWeight="medium">{bidData?.id}</Typography>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Amount</Typography>
            <Typography variant="body1" fontWeight="medium">
              ₹{bidAmount}/kg × {quantity}kg = ₹{totalCost.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Farmer</Typography>
            <Typography variant="body1" fontWeight="medium">{listing.farmer.name}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip label="Bid Submitted" color="success" size="small" />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, textAlign: 'left' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>What Happens Next?</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Assignment sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Farmer Reviews Bid"
                secondary="Usually responds within 2-4 hours"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Schedule sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Pickup/Delivery Arranged"
                secondary="Coordinate timing with farmer"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: 'success.main' }} />
              </ListItemIcon>
              <ListItemText
                primary="Payment Released"
                secondary="After quality verification & delivery"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<WhatsApp />}
          onClick={openWhatsApp}
          sx={{ color: '#25D366', borderColor: '#25D366' }}
        >
          Message Farmer
        </Button>
        <Button
          variant="contained"
          onClick={() => {/* Navigate to dashboard */}}
        >
          View My Bids
        </Button>
      </Box>

      <Alert severity="info" sx={{ mt: 3, textAlign: 'left' }}>
        <Typography variant="body2" fontWeight="medium">Important Reminders:</Typography>
        <Typography variant="body2">
          • Your payment is safely held in escrow until delivery<br/>
          • Contact farmer via WhatsApp for pickup coordination<br/>
          • Report any issues immediately for full refund protection
        </Typography>
      </Alert>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {activeStep === 0 && 'Place Your Bid'}
            {activeStep === 1 && 'Secure Payment'}
            {activeStep === 2 && 'Bid Confirmation'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeStep === 0 && renderBidForm()}
            {activeStep === 1 && renderPayment()}
            {activeStep === 2 && renderSuccess()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>

      {activeStep < 2 && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={activeStep === 0 ? onClose : handleBack}
            disabled={loading}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              loading || 
              (activeStep === 0 && (bidAmount === 0 || bidAmount < listing.pricing.msp))
            }
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              activeStep === 0 ? 'Continue to Payment' : 'Confirm Payment'
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default BidDialog;
