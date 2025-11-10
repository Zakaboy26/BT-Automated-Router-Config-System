import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Router as RouterIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
    Support as SupportIcon,
    ExitToApp as LogoutIcon,
    LocalShipping as LocalShippingIcon
} from "@mui/icons-material";

const navItems = [
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
        id: 'support',
        icon: SupportIcon,
        label: 'Support',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/support'
    },
    {
        id: 'track-order',
        icon: LocalShippingIcon,
        label: 'Track Order',
        allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
        path: '/track-order'
    }
]; 