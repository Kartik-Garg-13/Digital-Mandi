'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  WhatsApp as WhatsAppIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  Agriculture as AgricultureIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Help as HelpIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, href: '#dashboard' },
    { label: 'Marketplace', icon: <AgricultureIcon />, href: '#marketplace' },
    { label: 'Price Trends', icon: <TrendingUpIcon />, href: '#trends' },
    { label: 'Collective Pools', icon: <GroupIcon />, href: '#pools' },
    { label: 'Help & Support', icon: <HelpIcon />, href: '#support' }
  ];

  const notifications = [
    { id: 1, message: 'New bid ₹48/kg for your tomatoes!', time: '2 min ago', unread: true },
    { id: 2, message: 'Payment ₹12,500 released successfully', time: '1 hour ago', unread: true },
    { id: 3, message: 'Wheat pool reached 80% target', time: '3 hours ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/14155238886?text=HELP', '_blank');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenuContent = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Avatar sx={{ 
          bgcolor: 'white', 
          color: 'primary.main', 
          width: 60, 
          height: 60, 
          mx: 'auto', 
          mb: 1,
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          K
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Kartik Singh
        </Typography>
        <Typography variant="caption">
          Creator & Developer
        </Typography>
      </Box>

      <List>
        {menuItems.map((item, index) => (
          <ListItem 
            button 
            key={index}
            onClick={() => {
              setMobileMenuOpen(false);
              // Handle navigation
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        <ListItem button onClick={handleWhatsAppClick}>
          <ListItemIcon sx={{ color: '#25d366' }}>
            <WhatsAppIcon />
          </ListItemIcon>
          <ListItemText 
            primary="WhatsApp Support" 
            secondary="+1 415 523 8886"
          />
        </ListItem>
        
        <ListItem button onClick={() => window.open('tel:1800FARMER')}>
          <ListItemIcon sx={{ color: 'secondary.main' }}>
            <PhoneIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Call Support" 
            secondary="1800-FARMER (Free)"
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mr: 1
                }}
              >
                🚜 Digital Mandi
              </Typography>
              <Chip 
                label="by Kartik" 
                size="small" 
                color="primary"
                sx={{ 
                  fontSize: '0.7rem',
                  height: 20,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              />
            </Box>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', ml: 4, gap: 1 }}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  startIcon={item.icon}
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'primary.50',
                      color: 'primary.main'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Live Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Box 
              sx={{ 
                width: 8, 
                height: 8, 
                bgcolor: 'success.main', 
                borderRadius: '50%', 
                mr: 1,
                animation: 'pulse 2s infinite'
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'success.main', 
                fontWeight: 600,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              MARKET LIVE
            </Typography>
          </Box>

          {/* WhatsApp Quick Access */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              color="inherit"
              onClick={handleWhatsAppClick}
              sx={{
                bgcolor: '#25d366',
                color: 'white',
                mr: 1,
                '&:hover': {
                  bgcolor: '#128c7e'
                }
              }}
            >
              <WhatsAppIcon />
            </IconButton>
          </motion.div>

          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Menu */}
          <IconButton
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar sx={{ 
              bgcolor: 'primary.main', 
              width: 36, 
              height: 36,
              fontSize: '1rem',
              fontWeight: 600
            }}>
              K
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {mobileMenuContent}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Kartik Singh
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Creator & Developer
          </Typography>
          <Typography variant="caption" color="text.secondary">
            kartik@digitalmandi.com
          </Typography>
        </Box>
        
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountCircleIcon sx={{ mr: 2, color: 'primary.main' }} />
          Profile Settings
        </MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>
          <DashboardIcon sx={{ mr: 2, color: 'primary.main' }} />
          My Dashboard
        </MenuItem>
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          handleWhatsAppClick();
        }}>
          <WhatsAppIcon sx={{ mr: 2, color: '#25d366' }} />
          WhatsApp Support
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            maxWidth: 350,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="primary.main">
              {unreadCount} unread
            </Typography>
          )}
        </Box>

        {notifications.map((notification) => (
          <MenuItem 
            key={notification.id}
            onClick={handleNotificationsClose}
            sx={{
              whiteSpace: 'normal',
              py: 1.5,
              bgcolor: notification.unread ? 'primary.50' : 'transparent',
              borderLeft: notification.unread ? '3px solid' : 'none',
              borderColor: 'primary.main'
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: notification.unread ? 600 : 400 }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}

        <Box sx={{ p: 1, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
          <Button size="small" color="primary">
            View All Notifications
          </Button>
        </Box>
      </Menu>

      {/* Global styles for pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Navbar;