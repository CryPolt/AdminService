import { createRouter, createWebHistory } from 'vue-router';
import UserDashboard from '../components/Dashboard/UserDashboard.vue';
import AdminCore from '../components/AdminCore/AdminCore.vue';
import AdminPAO from '../components/AdminPAO/AdminPAO.vue';
import AdminPay from '../components/AdminPay/AdminPay.vue';
import AdminQA from '../components/AdminQA/AdminQA.vue';
import SuperAdminDasboard from "@/components/Admin/SuperAdminDasboard.vue";
import Login from '../components/Auth/UserLogin.vue';
import Fpm from '@/components/System/FPM/Fpm.vue';
import Daemon from "@/components/System/Daemons/Daemon.vue";
import SystemStats from "@/components/System/SystemSats/SystemStats.vue";
import AdminEpaymentComponent from "@/components/System/Epayment/AdminEpayment.vue";
import AutoFill from "@/components/System/AutoFill/AutoFill.vue";
import bankCards from "@/components/System/BankCards/BankCards.vue";
import AdminSupport from "@/components/AdminSupport/AdminSupport.vue";
import QR from "@/components/System/Rededuct/QR.vue";
import SMS from "@/components/System/Rededuct/SMS.vue";
import TransactionTable from "@/components/System/Rededuct/TrasnsactionTable.vue";
import AuthHistory from "@/components/User/authHistory.vue";
import ExternalUser from "@/components/System/ExternalUser/ExternalUser.vue";

const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/', name: 'Dashboard', component: UserDashboard, meta: { requiresAuth: true } },


    { path: '/admin-core', name: 'AdminCore', component: AdminCore, meta: { requiresAuth: true, roles: ['Admin-Core', 'Super-Admin'] }},
    { path: '/fpm', name: 'FPM', component: Fpm, meta: { requiresAuth: true, roles: ['Admin-Core', 'Super-Admin'] }},
    { path: '/daemon', name: 'Daemon', component: Daemon, meta: { requiresAuth: true, roles: ['Admin-QA', 'Super-Admin'] }},
    { path: '/system-stats', name: 'SystemStats', component: SystemStats, meta: { requiresAuth: true, roles: ['Admin-Core', 'Super-Admin'] }},
    { path: '/epayment', name: 'Epayment', component: AdminEpaymentComponent, meta: { requiresAuth: true, roles: ['Admin-Pay', 'Super-Admin'] }},


    { path: '/admin-pao', name: 'AdminPAO', component: AdminPAO, meta: { requiresAuth: true, roles: ['Admin-PAO', 'Super-Admin'] }},
    { path: '/autofill', name: 'Autofill', component: AutoFill, meta: { requiresAuth: true, roles: ['Admin-PAO', 'Super-Admin'] }},
    { path: '/bankCards', name: 'BankCards', component: bankCards, meta: { requiresAuth: true, roles: ['Admin-PAO', 'Super-Admin'] }},

    { path: '/admin-pay', name: 'AdminPay', component: AdminPay, meta: { requiresAuth: true, roles: ['Admin-Pay', 'Super-Admin'] }},

    { path: '/admin-qa', name: 'AdminQA', component: AdminQA, meta: { requiresAuth: true, roles: ['Admin-QA', 'Super-Admin'] }},

    { path: '/admin-support', name: 'AdminSupport', component: AdminSupport, meta: { requiresAuth: true, roles: ['Admin-Support', 'Super-Admin'] }},


    { path: '/super-admin', name: 'SuperAdminDashoard', component: SuperAdminDasboard, meta: { requiresAuth: true, roles: ['Super-Admin'] }},

    { path: '/admin-support/sms', name: 'SMS', component: SMS, meta: { requiresAuth: true } },
    { path: '/admin-support/qr', name: 'QR', component: QR, meta: { requiresAuth: true } },
    { path: '/admin-support/transaction-table', name: 'TransactionTable', component: TransactionTable, meta: { requiresAuth: true }, props: {smsApiUrl: '/api/problem-transactions-sms', qrApiUrl: '/api/problem-transactions-qr',title: 'Таблица транзакций'}  },

    { path: '/auth-history/:userId', name: 'AuthHistory', component: AuthHistory, meta: { requiresAuth: true } },

    { path: "/admin-qa/external-user", name: "ExternalUser", component: ExternalUser, meta: { requiresAuth: true, roles: ["Admin-QA", "Super-Admin"] } },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next({ name: 'Login' });
        } else {
            if (to.meta.roles && !to.meta.roles.includes(role)) {
                next({ name: 'Dashboard' });
            } else {
                next();
            }
        }
    } else {
        next();
    }
});

export default router;
