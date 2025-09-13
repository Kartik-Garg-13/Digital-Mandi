'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Avatar,
  Rating,
  Divider,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Card,
  CardMedia,
  CardContent,
  Slider,
  FormControl,
  FormControlLabel,
  Checkbox,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp,
  Security,
  LocalOffer,
  Payment,
  WhatsApp,
  Phone,
  LocationOn,
  Schedule,
  Eco,
  Verified,
  Info,
  CheckCircle,
  Warning,
  LocalShipping,
  AccountBalance,
  Timer,
  Star,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface BidDialogProps {
  open: boolean;
  onClose: () => void;
  listing: any; // Using any for now, should be properly typed
}

const BidDialog: React.FC<BidDialogProps> = ({ open, onClose, listing }) => {
  const theme = useTheme();
  const [bidAmount, setBidAmount] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [totalAmount, setTotalAmount] = useState(0);
  const [includeTransport, setIncludeTransport] = useState(false);
  const [transportCost, setTransportCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0: Bid Details, 1: Payment, 2: Confirmation
  const [expanded, setExpanded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (listing && bidAmount) {
      const bid = parseFloat(bidAmount) || 0;
      const baseTotal = bid * quantity;
      const transport = includeTransport ? transportCost : 0;
      setTotalAmount(baseTotal + transport);
    }
  }, [bidAmount, quantity, includeTransport, transportCost, listing]);

  useEffect(() => {
    if (listing) {
      const minBid = listing.currentBid ? listing.currentBid + 5 : listing.pricePerUnit + 5;
      setBidAmount(minBid.toString());
      setQuantity(Math.min(100, listing.quantity));
      // Mock transport cost calculation based on distance and quantity
      setTransportCost(Math.round(quantity * 0.8 + 50));
      setErrors({});
    }
  }, [listing, quantity]);

  const validateBidForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      newErrors.bidAmount = 'Please enter a valid bid amount';
    }
    
    if (listing) {
      const minBid = listing.currentBid ? listing.currentBid + 1 : listing.pricePerUnit;
      if (parseFloat(bidAmount) < minBid) {
        newErrors.bidAmount = `Minimum bid is ₹${minBid}/kg`;
      }
    }
    
    if (quantity <= 0 || quantity > listing?.quantity) {
      newErrors.quantity = `Quantity must be between 1 and ${listing?.quantity} kg`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBidSubmit = async () => {
    if (!validateBidForm()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStep(1);
    setIsProcessing(false);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate Razorpay integration
    const options = {
      key: 'rzp_test_1234567890',
      amount: totalAmount * 100, // Amount in paise
      currency: 'INR',
      name: 'Digital Mandi',
      description: `Bid for ${listing?.cropName} - ${listing?.id}`,
      image: '/logo.png',
      handler: function (response: any) {
        console.log('Payment successful:', response);
        setStep(2);
        setIsProcessing(false);
      },
      prefill: {
        name: 'Buyer Name',
        email: 'buyer@digitalmandi.com',
        contact: '9999999999'
      },
      theme: {
        color: theme.palette.primary.main
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    // Mock Razorpay success for demo
    setTimeout(() => {
      setStep(2);
      setIsProcessing(false);
    }, 2500);
  };

  const resetDialog = () => {
    setStep(0);
    setBidAmount('');
    setQuantity(100);
    setTotalAmount(0);
    setIncludeTransport(false);
    setIsProcessing(false);
    setExpanded(false);
    setErrors({});
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  if (!listing) return null;

  const minBid = listing.currentBid ? listing.currentBid + 1 : listing.pricePerUnit;
  const maxQuantity = listing.quantity;
  const mspStatus = listing.pricePerUnit >= listing.mspPrice;
  
  const steps = ['Place Bid', 'Secure Payment', 'Confirmation'];

  const bidAdvantages = [
    'Payment held in secure escrow until delivery',
    'Direct communication with verified farmer',
    'Quality assurance and grade certification',
    '100% fraud protection guarantee',
    'Fast dispute resolution support'
  ];

  const marketComparison = {
    traditionalPrice: listing.pricePerUnit * 0.85,
    digitalMandiPrice: parseFloat(bidAmount) || listing.pricePerUnit,
    savings: ((parseFloat(bidAmount) || listing.pricePerUnit) - (listing.pricePerUnit * 0.85)) / (listing.pricePerUnit * 0.85) * 100
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.50', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        position: 'relative'
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Place Bid - {listing.cropName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Listing ID: {listing.id} • {listing.timeRemaining} remaining • {listing.views} views
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Stepper activeStep={step} alternativeLabel sx={{ minWidth: 300 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <AnimatePresence mode="wait">
          {/* Step 0: Bid Details */}
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ p: 3 }}>
                {/* Crop and Farmer Info */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={listing.images[0] || '/api/placeholder/400/250'}
                        alt={listing.cropName}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', justify: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {listing.cropName}
                              {listing.variety && (
                                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                                  ({listing.variety})
                                </Typography>
                              )}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
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
                                  icon={<Eco />}
                                />
                              )}
                              {listing.collective && (
                                <Chip 
                                  label={`Pool (${listing.collective.farmerCount} farmers)`}
                                  size="small" 
                                  color="warning"
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {listing.description || 'High-quality produce from verified farmer with excellent track record.'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Harvested</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{listing.harvestDate}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Listed</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{listing.listedDate}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Views</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{listing.views}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    {/* Farmer Information */}
                    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                          src={listing.farmer.avatar} 
                          sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}
                        >
                          {listing.farmer.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {listing.farmer.name}
                            </Typography>
                            {listing.farmer.verified && <Verified sx={{ color: 'success.main', fontSize: 20 }} />}
                          </Box>
                          <Rating value={listing.farmer.trustScore} size="small" readOnly precision={0.1} />
                          <Typography variant="caption" color="text.secondary">
                            {listing.farmer.totalSales} successful sales • Member since {new Date(listing.farmer.joinedDate).getFullYear()}
                          </Typography>
                        </Box>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn sx={{ color: 'text.secondary', fontSize: 18 }} />
                            <Typography variant="body2">{listing.location}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Schedule sx={{ color: 'text.secondary', fontSize: 18 }} />
                            <Typography variant="body2">Updated: {listing.lastUpdated || 'Recently'}</Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<WhatsApp />}
                          variant="outlined"
                          onClick={() => window.open(`https://wa.me/${listing.farmer.phone.replace('+', '')}?text=Hi! I'm interested in your ${listing.cropName} listing ${listing.id} on Digital Mandi.`)}
                          sx={{ 
                            color: '#25d366', 
                            borderColor: '#25d366',
                            '&:hover': { bgcolor: 'rgba(37, 211, 102, 0.04)', borderColor: '#25d366' }
                          }}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Phone />}
                          variant="outlined"
                          onClick={() => window.open(`tel:${listing.farmer.phone}`)}
                        >
                          Call
                        </Button>
                      </Box>
                    </Paper>

                    {/* Current Market Status */}
                    <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                        Market Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">ASKING PRICE</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            ₹{listing.pricePerUnit.toLocaleString()}/kg
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">CURRENT BID</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: listing.currentBid ? 'success.main' : 'text.secondary' }}>
                            {listing.currentBid ? `₹${listing.currentBid.toLocaleString()}/kg` : 'No bids yet'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">MSP STATUS</Typography>
                          <Chip
                            label={mspStatus ? 'Above MSP' : 'Below MSP'}
                            size="small"
                            color={mspStatus ? 'success' : 'error'}
                            icon={mspStatus ? <CheckCircle /> : <Warning />}
                          />
                          <Typography variant="caption" display="block" color="text.secondary">
                            MSP: ₹{listing.mspPrice}/kg
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="caption" color="text.secondary">AVAILABLE</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {listing.quantity.toLocaleString()} kg
                          </Typography>
                          {listing.bidCount > 0 && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {listing.bidCount} active bids
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Bid Form */}
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Place Your Bid
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Bid Amount (₹/kg)"
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      error={!!errors.bidAmount}
                      helperText={errors.bidAmount || `Minimum bid: ₹${minBid}/kg`}
                      inputProps={{ 
                        min: minBid, 
                        step: 1,
                        style: { fontSize: '1.1rem', fontWeight: 600 }
                      }}
                      InputProps={{
                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>
                      }}
                    />
                    {parseFloat(bidAmount) > 0 && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'success.50', borderRadius: 1 }}>
                        <Typography variant="caption" color="success.main">
                          {((parseFloat(bidAmount) - listing.pricePerUnit) / listing.pricePerUnit * 100).toFixed(1)}% above asking price
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography gutterBottom>
                      Quantity: {quantity.toLocaleString()} kg
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        (Max: {maxQuantity.toLocaleString()} kg)
                      </Typography>
                    </Typography>
                    <Slider
                      value={quantity}
                      onChange={(e, value) => setQuantity(value as number)}
                      min={1}
                      max={maxQuantity}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value.toLocaleString()} kg`}
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', justify: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">1 kg</Typography>
                      <Typography variant="caption" color="text.secondary">{maxQuantity.toLocaleString()} kg</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Transport Option */}
                <Box sx={{ mt: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeTransport}
                        onChange={(e) => setIncludeTransport(e.target.checked)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2">
                          Include transport arrangement (+₹{transportCost.toLocaleString()})
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          We'll coordinate pickup and delivery to your location
                        </Typography>
                      </Box>
                    }
                  />
                </Box>

                {/* Total Calculation */}
                <Paper sx={{ p: 3, mt: 3, bgcolor: 'success.50', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'success.main' }}>
                    Bid Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Typography variant="body2">
                        {listing.cropName} ({quantity.toLocaleString()} kg @ ₹{bidAmount || '0'}/kg)
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" align="right" sx={{ fontWeight: 600 }}>
                        ₹{((parseFloat(bidAmount) || 0) * quantity).toLocaleString()}
                      </Typography>
                    </Grid>
                    {includeTransport && (
                      <>
                        <Grid item xs={8}>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalShipping sx={{ fontSize: 16, mr: 1 }} />
                            Transport & Logistics
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" align="right" sx={{ fontWeight: 600 }}>
                            ₹{transportCost.toLocaleString()}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Amount:</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }} align="right">
                        ₹{totalAmount.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Market Comparison */}
                <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'info.main' }}>
                      Market Price Comparison
                    </Typography>
                    <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                      {expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                  <Collapse in={expanded}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Traditional Mandi</Typography>
                        <Typography variant="h6" color="error.main">
                          ₹{marketComparison.traditionalPrice.toFixed(0)}/kg
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Your Bid</Typography>
                        <Typography variant="h6" color="success.main">
                          ₹{marketComparison.digitalMandiPrice}/kg
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="text.secondary">Better Deal</Typography>
                        <Typography variant="h6" color="primary.main">
                          +{marketComparison.savings.toFixed(1)}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Collapse>
                </Paper>

                {/* Security & Benefits Info */}
                <Alert 
                  icon={<Security />} 
                  severity="info" 
                  sx={{ mt: 3 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Your payment is 100% secure with Digital Mandi
                  </Typography>
                  <List dense>
                    {bidAdvantages.map((advantage, index) => (
                      <ListItem key={index} sx={{ py: 0, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={advantage}
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              </Box>
            </motion.div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotateY: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Payment sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
                </motion.div>
                
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  Secure Payment Processing
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Complete your payment to place the bid. Your money will be held securely in escrow until delivery confirmation.
                </Typography>

                <Paper sx={{ p: 3, mb: 4, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                    Payment Summary
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar 
                      src={listing.farmer.avatar} 
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {listing.farmer.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {listing.farmer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {listing.cropName} • {listing.location}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Quantity:</Typography>
                    <Typography>{quantity.toLocaleString()} kg</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Bid Price:</Typography>
                    <Typography>₹{bidAmount}/kg</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal:</Typography>
                    <Typography>₹{((parseFloat(bidAmount) || 0) * quantity).toLocaleString()}</Typography>
                  </Box>
                  {includeTransport && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Transport:</Typography>
                      <Typography>₹{transportCost.toLocaleString()}</Typography>
                    </Box>
                  )}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Amount:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      ₹{totalAmount.toLocaleString()}
                    </Typography>
                  </Box>

                  <Alert severity="success" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Escrow Protection Active:</strong> Your payment will be held securely and only released 
                      to the farmer after you confirm delivery. Full refund guaranteed if delivery issues occur.
                    </Typography>
                  </Alert>
                </Paper>

                {isProcessing && (
                  <Box sx={{ mb: 3 }}>
                    <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Processing secure payment...
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <img 
                      src="/api/placeholder/60/40" 
                      alt="Razorpay" 
                      style={{ height: '30px', marginBottom: '8px' }}
                    />
                    <Typography variant="caption" display="block">
                      Secured by Razorpay
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Security sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="caption" display="block">
                      256-bit SSL
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <AccountBalance sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="caption" display="block">
                      Bank Grade Security
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring", 
                    stiffness: 200,
                    damping: 10
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      color: 'white',
                      fontSize: 50,
                      boxShadow: '0 0 30px rgba(76, 175, 80, 0.3)'
                    }}
                  >
                    ✓
                  </Box>
                </motion.div>

                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                  Bid Placed Successfully!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                  Your bid has been submitted and payment secured in escrow. The farmer has been notified immediately via WhatsApp and will review your offer.
                </Typography>

                {/* Bid Confirmation Details */}
                <Paper sx={{ p: 3, mb: 4, bgcolor: 'success.50', maxWidth: 600, mx: 'auto' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                        Bid Confirmation Details
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">BID ID</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        BD{Date.now().toString().slice(-6)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">LISTING</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {listing.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">CROP</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {listing.cropName} ({quantity.toLocaleString()} kg)
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">FARMER</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {listing.farmer.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">BID AMOUNT</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{bidAmount}/kg
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">TOTAL SECURED</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        ₹{totalAmount.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">STATUS</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box 
                          sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: 'success.main',
                            animation: 'pulse 2s infinite'
                          }} 
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Payment Secured in Escrow - Awaiting Farmer Response
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Next Steps Timeline */}
                <Paper sx={{ p: 3, mb: 4, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center', color: 'primary.main' }}>
                    What Happens Next?
                  </Typography>
                  
                  <Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'warning.main', width: 32, height: 32 }}>1</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Farmer Notification (Immediate)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {listing.farmer.name} has been notified via WhatsApp about your bid
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'info.main', width: 32, height: 32 }}>2</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Bid Review (Within 2 hours)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Farmer will review and either accept your bid or wait for higher offers
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>3</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Winner Notification
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          You'll be notified immediately if you're the winning bidder
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>4</Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Delivery & Payment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Coordinate delivery with farmer, confirm receipt, payment released
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Farmer Contact Information */}
                <Paper sx={{ p: 3, mb: 4, bgcolor: 'info.50', maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'info.main' }}>
                    Stay in Touch with {listing.farmer.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<WhatsApp />}
                      onClick={() => window.open(`https://wa.me/${listing.farmer.phone.replace('+', '')}?text=Hi ${listing.farmer.name}! I just placed a bid of ₹${bidAmount}/kg for your ${listing.cropName} (${quantity}kg) on Digital Mandi. Looking forward to your response!`)}
                      sx={{ 
                        bgcolor: '#25d366', 
                        '&:hover': { bgcolor: '#128c7e' }
                      }}
                    >
                      Message Farmer
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Phone />}
                      onClick={() => window.open(`tel:${listing.farmer.phone}`)}
                    >
                      Call Farmer
                    </Button>
                  </Box>
                  <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center' }} color="text.secondary">
                    Direct communication helps build trust and ensures smooth transactions
                  </Typography>
                </Paper>

                {/* Important Reminders */}
                <Alert severity="info" sx={{ mb: 4, textAlign: 'left', maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Important Reminders:
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Security sx={{ fontSize: 14, color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Your payment is secured in escrow until delivery confirmation"
                        primaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <Timer sx={{ fontSize: 14, color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Bidding window closes in 2 hours - farmer may accept early"
                        primaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 20 }}>
                        <WhatsApp sx={{ fontSize: 14, color: 'info.main' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="You'll receive WhatsApp updates on your bid status"
                        primaryTypographyProps={{ variant: 'caption' }}
                      />
                    </ListItem>
                  </List>
                </Alert>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    onClick={handleClose}
                    size="large"
                    sx={{ minWidth: 150 }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      // Navigate to bids dashboard
                      handleClose();
                    }}
                    size="large"
                  >
                    View My Bids
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      // Share functionality
                      if (navigator.share) {
                        navigator.share({
                          title: 'Digital Mandi - Bid Placed',
                          text: `Just placed a bid on ${listing.cropName} from ${listing.farmer.name}!`,
                          url: window.location.href
                        });
                      }
                    }}
                    size="large"
                  >
                    Share Success
                  </Button>
                </Box>

                {/* Success Animation */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "Empowering farmers, one bid at a time" - Digital Mandi by Kartik Singh
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>

      {/* Dialog Actions */}
      {step === 0 && (
        <DialogActions sx={{ p: 3, bgcolor: 'grey.50', justifyContent: 'space-between' }}>
          <Button onClick={handleClose} color="inherit" size="large">
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => window.open(`https://wa.me/${listing.farmer.phone.replace('+', '')}`)}
              startIcon={<WhatsApp />}
              sx={{ color: '#25d366', borderColor: '#25d366' }}
            >
              Ask Farmer
            </Button>
            <Button
              variant="contained"
              startIcon={<LocalOffer />}
              onClick={handleBidSubmit}
              disabled={!bidAmount || parseFloat(bidAmount) < minBid || isProcessing || Object.keys(errors).length > 0}
              sx={{ 
                minWidth: 140,
                background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #43a047 30%, #4caf50 90%)'
                }
              }}
            >
              {isProcessing ? 'Processing...' : `Place Bid ₹${totalAmount.toLocaleString()}`}
            </Button>
          </Box>
        </DialogActions>
      )}

      {step === 1 && (
        <DialogActions sx={{ p: 3, bgcolor: 'grey.50', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setStep(0)} 
            color="inherit" 
            size="large"
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button
            variant="contained"
            startIcon={<Payment />}
            onClick={handlePayment}
            disabled={isProcessing}
            sx={{ 
              minWidth: 180,
              background: 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)'
              }
            }}
          >
            {isProcessing ? 'Processing Payment...' : `Pay ₹${totalAmount.toLocaleString()}`}
          </Button>
        </DialogActions>
      )}

      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Dialog>
  );
};

export default BidDialog;