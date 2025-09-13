'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Avatar,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics,
  Psychology,
  Speed,
  Whatshot
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

interface ForecastData {
  crop: string;
  currentPrice: number;
  mspPrice: number;
  prediction7d: number;
  prediction30d: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
  priceHistory: Array<{
    day: string;
    price: number;
    predicted?: boolean;
  }>;
}

const PriceForecastCard: React.FC = () => {
  const theme = useTheme();
  const [selectedCrop, setSelectedCrop] = useState('wheat');

  const forecastData: Record<string, ForecastData> = {
    wheat: {
      crop: 'Wheat',
      currentPrice: 2290,
      mspPrice: 2275,
      prediction7d: 2315,
      prediction30d: 2380,
      confidence: 87,
      trend: 'up',
      factors: ['Monsoon favorable', 'Export demand high', 'Storage adequate'],
      priceHistory: [
        { day: 'Jan 8', price: 2260 },
        { day: 'Jan 9', price: 2270 },
        { day: 'Jan 10', price: 2275 },
        { day: 'Jan 11', price: 2285 },
        { day: 'Jan 12', price: 2290 },
        { day: 'Jan 13', price: 2300, predicted: true },
        { day: 'Jan 14', price: 2310, predicted: true },
        { day: 'Jan 15', price: 2315, predicted: true }
      ]
    },
    tomato: {
      crop: 'Tomato',
      currentPrice: 48,
      mspPrice: 50,
      prediction7d: 45,
      prediction30d: 42,
      confidence: 92,
      trend: 'down',
      factors: ['Seasonal peak', 'High supply', 'Transport costs up'],
      priceHistory: [
        { day: 'Jan 8', price: 52 },
        { day: 'Jan 9', price: 50 },
        { day: 'Jan 10', price: 49 },
        { day: 'Jan 11', price: 48 },
        { day: 'Jan 12', price: 48 },
        { day: 'Jan 13', price: 46, predicted: true },
        { day: 'Jan 14', price: 45, predicted: true },
        { day: 'Jan 15', price: 45, predicted: true }
      ]
    },
    cotton: {
      crop: 'Cotton',
      currentPrice: 6670,
      mspPrice: 6620,
      prediction7d: 6720,
      prediction30d: 6850,
      confidence: 84,
      trend: 'up',
      factors: ['Global demand strong', 'Quality premium', 'Limited supply'],
      priceHistory: [
        { day: 'Jan 8', price: 6620 },
        { day: 'Jan 9', price: 6640 },
        { day: 'Jan 10', price: 6650 },
        { day: 'Jan 11', price: 6660 },
        { day: 'Jan 12', price: 6670 },
        { day: 'Jan 13', price: 6690, predicted: true },
        { day: 'Jan 14', price: 6710, predicted: true },
        { day: 'Jan 15', price: 6720, predicted: true }
      ]
    }
  };

  const currentData = forecastData[selectedCrop];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'down': return <TrendingDown sx={{ color: 'error.main' }} />;
      default: return <Speed sx={{ color: 'warning.main' }} />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return theme.palette.success.main;
      case 'down': return theme.palette.error.main;
      default: return theme.palette.warning.main;
    }
  };

  const getPriceChange = (current: number, predicted: number) => {
    const change = predicted - current;
    const percentage = ((change / current) * 100).toFixed(1);
    return { change, percentage };
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 2
        }}>
          <Typography variant="caption">{label}</Typography>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            ₹{payload[0].value.toLocaleString()}/kg
            {data.predicted && (
              <Chip label="Predicted" size="small" sx={{ ml: 1, height: 16 }} />
            )}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const weekChange = getPriceChange(currentData.currentPrice, currentData.prediction7d);
  const monthChange = getPriceChange(currentData.currentPrice, currentData.prediction30d);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ borderRadius: 3, height: '100%' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Analytics />
            </Avatar>
          }
          title={
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Price Forecast
            </Typography>
          }
          subheader="Powered by machine learning algorithms"
          action={
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Crop</InputLabel>
              <Select
                value={selectedCrop}
                label="Crop"
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <MenuItem value="wheat">Wheat</MenuItem>
                <MenuItem value="tomato">Tomato</MenuItem>
                <MenuItem value="cotton">Cotton</MenuItem>
              </Select>
            </FormControl>
          }
        />

        <CardContent>
          {/* Current Price & Status */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                ₹{currentData.currentPrice.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getTrendIcon(currentData.trend)}
                <Chip 
                  label={currentData.trend.toUpperCase()}
                  size="small"
                  sx={{ 
                    bgcolor: `${getTrendColor(currentData.trend)}15`,
                    color: getTrendColor(currentData.trend),
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>
            
            <Typography variant="caption" color="text.secondary">
              Current market price per kg
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Chip
                label={`MSP: ₹${currentData.mspPrice}/kg`}
                size="small"
                color={currentData.currentPrice >= currentData.mspPrice ? 'success' : 'error'}
              />
            </Box>
          </Box>

          {/* Predictions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Price Predictions
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  ₹{currentData.prediction7d}
                </Typography>
                <Typography variant="caption" color="text.secondary">7 Days</Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    color: weekChange.change >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}
                >
                  {weekChange.change >= 0 ? '+' : ''}₹{Math.abs(weekChange.change)} ({weekChange.percentage}%)
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                  ₹{currentData.prediction30d}
                </Typography>
                <Typography variant="caption" color="text.secondary">30 Days</Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    color: monthChange.change >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 600
                  }}
                >
                  {monthChange.change >= 0 ? '+' : ''}₹{Math.abs(monthChange.change)} ({monthChange.percentage}%)
                </Typography>
              </Box>
            </Box>

            {/* Confidence Score */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  AI Confidence
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {currentData.confidence}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={currentData.confidence}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: currentData.confidence >= 80 ? 'success.main' : 
                             currentData.confidence >= 60 ? 'warning.main' : 'error.main'
                  }
                }}
              />
            </Box>
          </Box>

          {/* Price Chart */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Price Trend (Last 5 days + Forecast)
            </Typography>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData.priceHistory}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.warning.main} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={theme.palette.warning.main} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    fill="url(#colorPrice)"
                    dot={{ r: 4, stroke: theme.palette.primary.main, strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Market Factors */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Key Market Factors
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {currentData.factors.map((factor, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box 
                    sx={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main' 
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary">
                    {factor}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* AI Insights */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'primary.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.200'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Psychology sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                AI Insights
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              {currentData.trend === 'up' 
                ? `Strong buying opportunity for ${currentData.crop}. Market fundamentals indicate ${currentData.confidence}% probability of price appreciation over the next 30 days.`
                : currentData.trend === 'down'
                ? `Caution advised for ${currentData.crop}. Consider selling current inventory or waiting for better market conditions. ${currentData.confidence}% confidence in price decline.`
                : `${currentData.crop} prices expected to remain stable. Good time for steady trading with minimal price volatility risk.`
              }
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<Whatshot />}
              sx={{ flex: 1 }}
            >
              Get Alert
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              sx={{ flex: 1 }}
            >
              Full Report
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PriceForecastCard;