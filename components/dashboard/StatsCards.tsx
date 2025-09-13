'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  LinearProgress,
  Avatar,
  Chip
} from '@mui/material';
import {
  Agriculture,
  TrendingUp,
  People,
  AccountBalance,
  LocalOffer,
  Security,
  Speed,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
  description: string;
  progress?: number;
}

const StatsCards: React.FC = () => {
  const theme = useTheme();

  const stats: StatCard[] = [
    {
      title: 'Active Farmers',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: <People sx={{ fontSize: 30 }} />,
      color: theme.palette.primary.main,
      description: 'Verified farmers using Digital Mandi',
      progress: 75
    },
    {
      title: 'Live Listings',
      value: '245',
      change: '+8.2%',
      changeType: 'positive',
      icon: <Agriculture sx={{ fontSize: 30 }} />,
      color: theme.palette.success.main,
      description: 'Fresh crops available for bidding',
      progress: 62
    },
    {
      title: 'Total Transactions',
      value: '₹18.75L',
      change: '+23.1%',
      changeType: 'positive',
      icon: <AccountBalance sx={{ fontSize: 30 }} />,
      color: theme.palette.warning.main,
      description: 'Secured through escrow system',
      progress: 88
    },
    {
      title: 'Active Bids',
      value: '1,234',
      change: '+15.7%',
      changeType: 'positive',
      icon: <LocalOffer sx={{ fontSize: 30 }} />,
      color: theme.palette.secondary.main,
      description: 'Real-time bidding activity',
      progress: 45
    },
    {
      title: 'Average Price Gain',
      value: '+23%',
      change: '+2.1%',
      changeType: 'positive',
      icon: <TrendingUp sx={{ fontSize: 30 }} />,
      color: theme.palette.success.main,
      description: 'vs traditional middlemen',
      progress: 78
    },
    {
      title: 'Fraud Prevention',
      value: '100%',
      change: '0 incidents',
      changeType: 'neutral',
      icon: <Security sx={{ fontSize: 30 }} />,
      color: theme.palette.error.main,
      description: 'Zero fraud with escrow system',
      progress: 100
    },
    {
      title: 'Avg Response Time',
      value: '2.3 min',
      change: '-18%',
      changeType: 'positive',
      icon: <Speed sx={{ fontSize: 30 }} />,
      color: theme.palette.info.main,
      description: 'WhatsApp farmer support',
      progress: 85
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+3.8%',
      changeType: 'positive',
      icon: <EmojiEvents sx={{ fontSize: 30 }} />,
      color: theme.palette.primary.main,
      description: 'Successful crop deliveries',
      progress: 94
    }
  ];

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive': return theme.palette.success.main;
      case 'negative': return theme.palette.error.main;
      default: return theme.palette.text.secondary;
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      default: return '→';
    }
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${stat.color}08 0%, ${stat.color}15 100%)`,
                border: `1px solid ${stat.color}20`,
                borderRadius: 3,
                overflow: 'visible',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 25px ${stat.color}25`,
                  borderColor: `${stat.color}40`
                }
              }}
            >
              {/* Progress bar at top */}
              {stat.progress && (
                <LinearProgress
                  variant="determinate"
                  value={stat.progress}
                  sx={{
                    height: 4,
                    backgroundColor: `${stat.color}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: stat.color,
                      borderRadius: '0 2px 2px 0'
                    }
                  }}
                />
              )}

              <CardContent sx={{ p: 3 }}>
                {/* Header with icon */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: stat.color,
                        lineHeight: 1.2
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}15`,
                      color: stat.color,
                      width: 50,
                      height: 50
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>

                {/* Change indicator */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={`${getChangeIcon(stat.changeType)} ${stat.change}`}
                    size="small"
                    sx={{
                      bgcolor: `${getChangeColor(stat.changeType)}15`,
                      color: getChangeColor(stat.changeType),
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                  {stat.progress && (
                    <Typography variant="caption" color="text.secondary">
                      {stat.progress}%
                    </Typography>
                  )}
                </Box>

                {/* Description */}
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ lineHeight: 1.4 }}
                >
                  {stat.description}
                </Typography>
              </CardContent>

              {/* Decorative element */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  bgcolor: `${stat.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  opacity: 0.7
                }}
              >
                {index + 1}
              </Box>
            </Card>
          </motion.div>
        </Grid>
      ))}

      {/* Summary Card */}
      <Grid item xs={12}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.success.main}15 100%)`,
              border: `1px solid ${theme.palette.primary.main}20`,
              borderRadius: 3,
              p: 2
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
                  🎉 Digital Mandi Impact Summary
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Transforming Indian agriculture through technology
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                        600M+
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Farmers Targeted
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        Zero
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        App Downloads Needed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                        23%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Average Income Boost
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                        17
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Creator's Age
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 2, 
                    fontStyle: 'italic',
                    color: 'text.secondary'
                  }}
                >
                  "Empowering farmers, one WhatsApp message at a time" - Kartik Singh
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    </Grid>
  );
};

export default StatsCards;
