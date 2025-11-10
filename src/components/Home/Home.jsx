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
  Support as SupportIcon
} from '@mui/icons-material';

const featureCards = [
    { id: 'routers', title: 'Routers', icon: RouterIcon, allowedRoles: ['ADMIN'], description: 'Manage router configurations and inventory', path: '/routers' },
    { id: 'customers', title: 'Customers', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'View and manage customer information', path: '/customers' },
    { id: 'users', title: 'Users', icon: PeopleIcon, allowedRoles: ['ADMIN'], description: 'Manage system users and permissions', path: '/users' },
    { id: 'requests', title: 'Router Request Form', icon: AssignmentIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Submit new router configuration requests', path: '/router-requests' },
    { id: 'manageRequests', title: 'Router Management', icon: RouterManagementIcon, allowedRoles: ['ADMIN'], description: 'Review and update router request statuses', path: '/manage-router-requests' },
    { id: 'history', title: 'Order History', icon: HistoryIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'View past router requests and their status', path: '/order-history' },
    { id: 'news', title: 'News & Updates', icon: AdminNewsIcon, allowedRoles: ['ADMIN'], description: 'Post updates or announcements', path: '/news-management' },
    { id: 'user-news', title: 'Announcements', icon: UserNewsIcon, allowedRoles: ['USER', 'SUPPORT_AGENT', 'ADMIN'], description: 'View latest news and admin updates', path: '/news' },
    { id: 'user-report', title: 'Submit a Report', icon: ReportIcon, allowedRoles: ['USER', 'SUPPORT_AGENT', 'ADMIN'], description: 'Report an issue or give feedback', path: '/user-report' },
    { id: 'admin-reports', title: 'View User Reports', icon: AdminReportIcon, allowedRoles: ['ADMIN'], description: 'View all user-submitted router issue reports', path: '/admin/reports' },
    { id: 'contact', title: 'Contact Us', icon: SupportIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Get in touch with our support team', path: '/contact' },
    { id: 'track-order', title: 'Track Order', icon: LocalShippingIcon, allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'], description: 'Track the status of your router orders', path: '/track-order' }
  ]; 