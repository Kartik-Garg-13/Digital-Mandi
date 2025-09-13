'use client'

import { Box, Container, Typography, Grid, Link, Chip } from '@mui/material'
import { GitHub, LinkedIn, Email, WhatsApp } from '@mui/icons-material'

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              🚜 Digital Mandi
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Empowering Indian farmers with direct market access, fair pricing, and secure digital payments.
            </Typography>
            <Chip
              label="Built by Kartik Singh (17, MUJ)"
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/marketplace" color="inherit" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Browse Marketplace
              </Link>
              <Link href="/dashboard" color="inherit" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Analytics Dashboard
              </Link>
              <Link href="/collectives" color="inherit" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                Collective Pools
              </Link>
              <Link href="/about" color="inherit" sx={{ opacity: 0.9, '&:hover': { opacity: 1 } }}>
                About Kartik Singh
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Kartik
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="mailto:kartik@manipal.edu"
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                <Email sx={{ fontSize: 18 }} />
                kartik@manipal.edu
              </Link>
              <Link
                href="https://wa.me/+14155238886"
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                <WhatsApp sx={{ fontSize: 18 }} />
                WhatsApp Demo
              </Link>
              <Link
                href="https://github.com/kartik-singh"
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9, '&:hover': { opacity: 1 } }}
              >
                <GitHub sx={{ fontSize: 18 }} />
                GitHub Portfolio
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            mt: 4,
            pt: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2024 Digital Mandi by Kartik Singh. Built with ❤️ for Indian farmers.
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
            17-year-old BTech CSE student at Manipal University Jaipur • Harvard Economics aspirant 2025
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
