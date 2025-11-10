import React, {useEffect, useState} from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Toolbar,
  Container,
  Fade
} from '@mui/material';
import { styled } from "@mui/system";
import {
  MainContainer,
  FeatureCard,
  AnimatedComponent,
  CardIcon,
  ResponsiveGrid,
  ScrollableContainer,
  HeaderBar
} from '../../styles/HomeStyles';
import {
  Router as RouterIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Hub as RouterManagementIcon,
  Campaign as AdminNewsIcon,
  NotificationsActive as UserNewsIcon,
  ReportProblem as ReportIcon,
  GppMaybe as AdminReportIcon,
  LocalShipping as LocalShippingIcon,
  Support as SupportIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import Sidebar from '../Navigation/Sidebar';
import useAuth from "../Auth/useAuth";
import {SectionDivider} from "../../styles/PageStyles";

const BackgroundDecoration = styled("div")({
  position: "absolute",
  borderRadius: "50%",
  zIndex: 0,
  opacity: 0.2
});

const TopDecoration = styled(BackgroundDecoration)({
  top: "-100px",
  left: "-100px",
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, #6200aa, transparent)"
});

const BottomDecoration = styled(BackgroundDecoration)({
  bottom: "-100px",
  right: "-100px",
  width: "300px",
  height: "300px",
  background: "radial-gradient(circle, #8e24aa, transparent)"
});

const Footer = styled(Box)({
  textAlign: "center",
  color: "#888",
  padding: "24px",
  position: "relative",
  zIndex: 1
});

const Home = () => {
    const { user, userRole, loading, navigate, activeTab, setActiveTab, isAllowed } = useAuth();
    const [firstName, setFirstName] = useState('');

  //grab their first name
  useEffect(() => {
    fetch('/api/user/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then(data => setFirstName(data.firstName))
        .catch(err => console.error('Failed to load user name', err));
  }, []);


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const featureCards = [
    // User-accessible and prioritized cards (in order)
    { id: 'requests', title: 'Router Request Form', icon: AssignmentIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Submit new router configuration requests', path: '/router-requests' },
    { id: 'history', title: 'Order History', icon: HistoryIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'View past router requests and their status', path: '/order-history' },
    { id: 'track-order', title: 'Track Order', icon: LocalShippingIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Track the status of your router orders', path: '/track-order' },
    { id: 'help', title: 'Help Guide', icon: HelpIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Access a helpful video tutorial', path: '/help' },
    { id: 'user-news', title: 'Announcements', icon: UserNewsIcon, allowedRoles: ['USER', 'SUPPORT_AGENT', 'ADMIN'], description: 'View latest news and admin updates', path: '/news' },
    { id: 'contact', title: 'Contact Us', icon: SupportIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Get in touch with our support team', path: '/contact' },
    { id: 'user-report', title: 'Submit a Report', icon: ReportIcon, allowedRoles: ['USER', 'SUPPORT_AGENT', 'ADMIN'], description: 'Report an issue or give feedback', path: '/user-report' },

    // Admin-only cards (grayed out if not allowed)
    { id: 'routers', title: 'Routers', icon: RouterIcon, allowedRoles: ['ADMIN'], description: 'Manage router configurations and inventory', path: '/routers' },
    { id: 'customers', title: 'Customers', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'View and manage customer information', path: '/customers' },
    { id: 'users', title: 'Users', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'Manage system users and permissions', path: '/users' },
    { id: 'manageRequests', title: 'Router Management', icon: RouterManagementIcon, allowedRoles: ['ADMIN'], description: 'Review and update router request statuses', path: '/manage-router-requests' },
    { id: 'news', title: 'News & Updates', icon: AdminNewsIcon, allowedRoles: ['ADMIN'], description: 'Post updates or announcements', path: '/news-management' },
    { id: 'admin-reports', title: 'View User Reports', icon: AdminReportIcon, allowedRoles: ['ADMIN'], description: 'View all user-submitted router issue reports', path: '/admin/reports' },
  ];

  // Splits feature cards.
  const userCards = featureCards.filter(card => card.allowedRoles.includes('USER') || card.allowedRoles.includes('SUPPORT_AGENT'));
  const adminCards = featureCards.filter(card => card.allowedRoles.length === 1 && card.allowedRoles.includes('ADMIN'));


  const handleNavigation = (path, allowedRoles) => {
    if (isAllowed(allowedRoles)) {
      navigate(path);
    }
  };

  if (loading) {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: '#f8f9fa'
        }}>
          <CircularProgress sx={{ color: '#6200aa' }} />
        </Box>
    );
  }

  const WelcomeBanner = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(90deg, rgba(98,0,170,0.05), rgba(98,0,170,0))',
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    marginBottom: theme.spacing(2),
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'inline-block',
  }));

  return (
      <MainContainer>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
        <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <HeaderBar>
            <Toolbar>
              <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    letterSpacing: "0.5px",
                    flexGrow: 1,
                  }}
              >
                BT IoT Router Services
              </Typography>
            </Toolbar>
          </HeaderBar>

          <ScrollableContainer component="main" sx={{ p: 3, flexGrow: 1 }}>
            <Container maxWidth="xl" sx={{ position: 'relative' }}>
              <TopDecoration />
              <BottomDecoration />
              <Fade in={true} timeout={600}>
                <Box>
                  {/*welcome header*/}
                  <WelcomeBanner>
                    <Fade in={!!firstName} timeout={800}>
                      <Typography variant="h5" sx={{
                        fontWeight: 500,
                        color: '#333',
                        textDecoration: 'underline',
                        textUnderlineOffset: '6px',
                        textDecorationThickness: '2px',
                        textDecorationColor: '#6200aa'
                      }}>
                        {firstName ? `${getGreeting()}, ${firstName}` : 'Welcome back!'}
                      </Typography>
                    </Fade>
                  </WelcomeBanner>
                  <ResponsiveGrid>
                    {userCards.map((card, index) => (
                        <AnimatedComponent key={card.id} delay={index * 0.1}>
                          <FeatureCard
                              active={isAllowed(card.allowedRoles)}
                              onClick={() => handleNavigation(card.path, card.allowedRoles)}
                          >
                            <CardIcon active={isAllowed(card.allowedRoles)}>
                              <card.icon />
                            </CardIcon>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {card.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {isAllowed(card.allowedRoles) ? card.description : 'Access restricted'}
                            </Typography>
                          </FeatureCard>
                        </AnimatedComponent>
                    ))}
                  </ResponsiveGrid>

                  {/* Divider between user and admin cards */}
                  <SectionDivider />

                  <ResponsiveGrid>
                    {adminCards.map((card, index) => (
                        <AnimatedComponent key={card.id} delay={index * 0.1}>
                          <FeatureCard
                              active={isAllowed(card.allowedRoles)}
                              onClick={() => handleNavigation(card.path, card.allowedRoles)}
                          >
                            <CardIcon active={isAllowed(card.allowedRoles)}>
                              <card.icon />
                            </CardIcon>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {card.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {isAllowed(card.allowedRoles) ? card.description : 'Access restricted'}
                            </Typography>
                          </FeatureCard>
                        </AnimatedComponent>
                    ))}
                  </ResponsiveGrid>
                  <Footer>
                    <Typography variant="caption">
                      © 2025 BT IoT Router Services. All rights reserved.
                    </Typography>
                  </Footer>
                </Box>
              </Fade>
            </Container>
          </ScrollableContainer>
        </Box>
      </MainContainer>
  );
};

export default Home;