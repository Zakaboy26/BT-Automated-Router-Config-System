import {
    Dashboard as DashboardIcon,
    Router as RouterIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
    Analytics as AnalyticsIcon,
    Support as SupportIcon,
    ExitToApp as LogoutIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

export const navItems = [
    {
        id: 'dashboard',
        icon: DashboardIcon,
        label: 'Dashboard',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/home'
    },
    {
        id: 'routers',
        icon: RouterIcon,
        label: 'Routers',
        allowedRoles: ['ADMIN'],
        path: '/routers'
    },
    {
        id: 'customers',
        icon: PeopleIcon,
        label: 'Customers',
        allowedRoles: ['ADMIN'],
        path: '/customers'
    },
    {
        id: 'users',
        icon: PeopleIcon,
        label: 'Users',
        allowedRoles: ['ADMIN'],
        path: '/users'
    },
    {
        id: 'requests',
        icon: AssignmentIcon,
        label: 'Router Requests',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/router-requests'
    },
    {
        id: 'history',
        icon: HistoryIcon,
        label: 'Order History',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/order-history'
    },
    {
        id: 'analytics',
        icon: AnalyticsIcon,
        label: 'Analytics',
        allowedRoles: ['ADMIN'],
        path: '/analytics'
    },
    {
        id: 'contact',
        icon: SupportIcon,
        label: 'Contact Us',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/support'
    },
    {
        id: 'settings',
        icon: SettingsIcon,
        label: 'Settings',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/settings'
    },
];

export const logoutItem = {
    id: 'logout',
    icon: LogoutIcon,
    label: 'Logout',
};
