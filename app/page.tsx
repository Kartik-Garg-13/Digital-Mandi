'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  Fade,
  useTheme,
  Alert,
  Skeleton
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ListingsTable from '../components/listings/ListingsTable';
import StatsCards from '../components/dashboard/StatsCards';
import PriceForecastCard from '../components/dashboard/PriceForecastCard';
import CollectivePoolCard from '../components/dashboard/CollectivePoolCard';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const floatVariants = {
  initial: { y: 0 },
  animate: { 
    y: [-5, 5, -5], 
    transition: { 
      repeat: Infinity, 
      duration: 3,
      ease: "easeInOut"
    }
  }
};

export default function HomePage() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'New bid of ₹48/kg received for Tomatoes!', show: true },
    { id: 2, type: 'info', message: 'MSP updated: Wheat now at ₹2275/kg', show: true }
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearTimeout(loadTimer);
    };
  }, []);

  // Auto-hide notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => prev.map(n => ({ ...n, show: false })));
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <WhatsAppIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'WhatsApp Integration',
      description: 'List crops via WhatsApp - no app download needed! Just send a message.',
      color: theme.palette.primary.main
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      title: 'Secure Payments',
      description: 'Escrow system holds payments until delivery confirmed. 100% fraud protection.',
      color: theme.palette.success.main
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      title: 'MSP Protection',
      description: 'Alerts when prices fall below government MSP. Never sell at a loss!',
      color: theme.palette.warning.main
    },
    {
      icon: <GroupWorkIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'Collective Power',
      description: 'Pool with other farmers for bulk sales and 15-25% higher prices.',
      color: theme.palette.secondary.main
    }
  ];

  const quickActions = [
    { label: 'List New Crop', action: () => window.open('https://wa.me/14155238886?text=LIST%20tomato%20100kg%2045%2Fkg%20Jaipur'), color: 'primary' },
    { label: 'Check Prices', action: () => window.open('https://wa.me/14155238886?text=PRICE%20wheat'), color: 'success' },
    { label: 'Join Pool', action: () => window.open('https://wa.me/14155238886?text=COLLECTIVE'), color: 'warning' },
    { label: 'Get Help', action: () => window.open('https://wa.me/14155238886?text=HELP'), color: 'info' }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 50%, #fff3e0 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating background elements */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 0,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [0, -30, 0], 
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
            style={{
              position: 'absolute',
              fontSize: '24px',
              color: theme.palette.primary.main
            }}
          >
            🌾
          </motion.div>
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Notifications */}
        <AnimatePresence>
          {notifications.filter(n => n.show).map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              style={{ marginBottom: 16 }}
          >
            <Alert 
              severity={notification.type as any} 
              sx={{ borderRadius: 2 }}
              onClose={() => setNotifications(prev => 
                prev.map(n => n.id === notification.id ? { ...n, show: false } : n)
              )}
            >
              {notification.message}
            </Alert>
          </motion.div>
          ))}
        </AnimatePresence>

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  fontSize: { xs: '2rem', md: '3.5rem' },
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 2
                }}
              >
                🚜 Digital Mandi
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 3,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                WhatsApp-First Farmer Marketplace by Kartik Singh
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.1rem',
                  maxWidth: 600,
                  mx: 'auto',
                  mb: 4,
                  color: theme.palette.text.secondary
                }}
              >
                Empowering 600M+ Indian farmers with direct market access, MSP protection, 
                and secure payments. No app download needed - just WhatsApp!
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="contained"
                    color={action.color as any}
                    onClick={action.action}
                    sx={{ 
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 3,
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: 6 
                      }
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </motion.div>
          </Box>

          {/* Current Time & Status */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ 
              p: 2, 
              mb: 4, 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.2)'
            }}>
              <Typography variant="body2" color="text.secondary">
                Market Status: <strong style={{ color: theme.palette.success.main }}>LIVE</strong> • 
                Current Time: <strong>{currentTime.toLocaleTimeString()}</strong> • 
                Active Farmers: <strong>2,847</strong> • 
                Live Listings: <strong>245</strong>
              </Typography>
            </Paper>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants}>
            <StatsCards />
          </motion.div>

          {/* Features Grid */}
          <Box sx={{ my: 6 }}>
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  textAlign: 'center', 
                  mb: 4,
                  fontWeight: 600,
                  color: theme.palette.primary.main
                }}
              >
                Why Choose Digital Mandi?
              </Typography>
            </motion.div>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${feature.color}20`,
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 10px 30px ${feature.color}30`,
                          borderColor: `${feature.color}40`
                        }
                      }}
                    >
                      <motion.div
                        variants={floatVariants}
                        initial="initial"
                        animate="animate"
                      >
                        <Box sx={{ mb: 2 }}>
                          {feature.icon}
                        </Box>
                      </motion.div>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Dashboard Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} lg={8}>
              <motion.div variants={itemVariants}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                    🌾 Live Marketplace
                  </Typography>
                  {loading ? (
                    <Box>
                      {[...Array(5)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          height={60}
                          sx={{ mb: 1, borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <ListingsTable />
                  )}
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <motion.div variants={itemVariants}>
                  <PriceForecastCard />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <CollectivePoolCard />
                </motion.div>
              </Box>
            </Grid>
          </Grid>

          {/* WhatsApp CTA Section */}
          <motion.div variants={itemVariants}>
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                color: 'white',
                borderRadius: 3
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                Start Selling Today!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Join 2,800+ farmers already earning 23% more through Digital Mandi
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: 'white',
                  color: '#25d366',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    transform: 'translateY(-2px)'
                  }
                }}
                onClick={() => window.open('https://wa.me/14155238886?text=HELP')}
              >
                Send WhatsApp Message
              </Button>
              <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.8 }}>
                Send "LIST tomato 100kg 45/kg YourCity" to get started
              </Typography>
            </Paper>
          </motion.div>

          {/* Creator Section */}
          <motion.div variants={itemVariants}>
            <Paper sx={{ 
              p: 3, 
              mt: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(129, 199, 132, 0.05) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.1)'
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Built with ❤️ by
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Kartik Singh
              </Typography>
              <Typography variant="caption" color="text.secondary">
                17-year-old BTech CSE student at Manipal University Jaipur | Harvard Economics Aspirant 2025
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                "Revolutionizing Indian agriculture through technology"
              </Typography>
            </Paper>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
