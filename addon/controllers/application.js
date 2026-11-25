import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
    @service intl;
    @service fetch;

    get navigationItems() {
        return [
            {
                label: this.intl.t('ledger-ui.s.dashboard'),
                description: this.intl.t('ledger-ui.s.ledger-dashboard-and-financial-overview'),
                icon: 'chart-simple',
                route: 'console.ledger.home',
                keywords: ['overview', 'metrics', 'finance dashboard'],
            },
            {
                label: this.intl.t('ledger-ui.s.billing'),
                description: this.intl.t('ledger-ui.s.invoices-and-reusable-invoice-templates'),
                icon: 'file-invoice-dollar',
                children: [
                    {
                        label: this.intl.t('ledger-ui.s.invoices-2'),
                        description: this.intl.t('ledger-ui.s.create-send-and-manage-customer-invoices'),
                        icon: 'file-invoice-dollar',
                        route: 'console.ledger.billing.invoices.index',
                        keywords: ['receivables', 'customers', 'payments due'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.invoice-templates'),
                        description: this.intl.t('ledger-ui.s.design-reusable-invoice-templates'),
                        icon: 'file-code',
                        route: 'console.ledger.billing.invoice-templates.index',
                        keywords: ['templates', 'invoice design', 'documents'],
                    },
                ],
            },
            {
                label: this.intl.t('ledger-ui.s.payments'),
                description: this.intl.t('ledger-ui.s.transactions-wallets-and-payment-gateways'),
                icon: 'money-bill-transfer',
                children: [
                    {
                        label: this.intl.t('ledger-ui.s.transactions'),
                        description: this.intl.t('ledger-ui.s.review-payment-and-wallet-transaction-history'),
                        icon: 'money-bill-transfer',
                        route: 'console.ledger.payments.transactions.index',
                        keywords: ['payments', 'charges', 'refunds', 'settlements'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.wallets'),
                        description: this.intl.t('ledger-ui.s.manage-company-customer-and-driver-wallets'),
                        icon: 'wallet',
                        route: 'console.ledger.payments.wallets.index',
                        keywords: ['balances', 'top ups', 'payouts'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.gateways'),
                        description: this.intl.t('ledger-ui.s.configure-payment-gateway-integrations'),
                        icon: 'credit-card',
                        route: 'console.ledger.payments.gateways.index',
                        keywords: ['stripe', 'payment providers', 'checkout'],
                    },
                ],
            },
            {
                label: this.intl.t('ledger-ui.s.accounting'),
                description: this.intl.t('ledger-ui.s.chart-of-accounts-journals-and-general-ledger'),
                icon: 'calculator',
                children: [
                    {
                        label: this.intl.t('ledger-ui.s.chart-of-accounts'),
                        description: this.intl.t('ledger-ui.s.manage-the-ledger-account-structure'),
                        icon: 'sitemap',
                        route: 'console.ledger.accounting.accounts.index',
                        keywords: ['accounts', 'coa', 'accounting'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.journal-entries'),
                        description: this.intl.t('ledger-ui.s.browse-and-create-double-entry-journal-entries'),
                        icon: 'book',
                        route: 'console.ledger.accounting.journal.index',
                        keywords: ['journals', 'debits', 'credits'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.general-ledger'),
                        description: this.intl.t('ledger-ui.s.review-posted-activity-across-accounts'),
                        icon: 'scroll',
                        route: 'console.ledger.accounting.general-ledger',
                        keywords: ['ledger', 'posted transactions', 'account activity'],
                    },
                ],
            },
            {
                label: this.intl.t('ledger-ui.s.reports'),
                description: this.intl.t('ledger-ui.s.financial-statements-and-operational-reports'),
                icon: 'chart-line',
                children: [
                    {
                        label: this.intl.t('ledger-ui.s.income-statement'),
                        description: this.intl.t('ledger-ui.s.revenue-expenses-and-net-income'),
                        icon: 'chart-line',
                        route: 'console.ledger.reports.income-statement',
                        keywords: ['profit and loss', 'pnl', 'revenue', 'expenses'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.balance-sheet'),
                        description: this.intl.t('ledger-ui.s.assets-liabilities-and-equity'),
                        icon: 'scale-balanced',
                        route: 'console.ledger.reports.balance-sheet',
                        keywords: ['assets', 'liabilities', 'equity'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.trial-balance'),
                        description: this.intl.t('ledger-ui.s.debit-and-credit-balances-by-account'),
                        icon: 'list-check',
                        route: 'console.ledger.reports.trial-balance',
                        keywords: ['debits', 'credits', 'balances'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.cash-flow'),
                        description: this.intl.t('ledger-ui.s.cash-movement-over-the-selected-period'),
                        icon: 'water',
                        route: 'console.ledger.reports.cash-flow',
                        keywords: ['cash', 'inflow', 'outflow'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.ar-aging'),
                        description: this.intl.t('ledger-ui.s.outstanding-receivables-by-age-bucket'),
                        icon: 'clock',
                        route: 'console.ledger.reports.ar-aging',
                        keywords: ['receivables', 'overdue invoices', 'aging'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.wallet-summary'),
                        description: this.intl.t('ledger-ui.s.wallet-balances-and-activity-summary'),
                        icon: 'wallet',
                        route: 'console.ledger.reports.wallet-summary',
                        keywords: ['wallet report', 'balances'],
                    },
                ],
            },
            {
                label: this.intl.t('ledger-ui.s.settings'),
                description: this.intl.t('ledger-ui.s.ledger-billing-payment-and-accounting-settings'),
                icon: 'gear',
                children: [
                    {
                        label: this.intl.t('ledger-ui.s.invoice-settings'),
                        description: this.intl.t('ledger-ui.s.configure-invoice-numbering-defaults-and-templat'),
                        icon: 'file-invoice',
                        route: 'console.ledger.settings.invoice',
                        keywords: ['invoice defaults', 'numbering', 'template'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.payment-settings'),
                        description: this.intl.t('ledger-ui.s.configure-payment-defaults-and-gateway-behavior'),
                        icon: 'gear',
                        route: 'console.ledger.settings.payment',
                        keywords: ['payments', 'gateway defaults'],
                    },
                    {
                        label: this.intl.t('ledger-ui.s.accounting-settings'),
                        description: this.intl.t('ledger-ui.s.configure-accounting-automation-and-posting-beha'),
                        icon: 'calculator',
                        route: 'console.ledger.settings.accounting',
                        keywords: ['journal automation', 'posting', 'accounts'],
                    },
                ],
            },
        ];
    }

    @action
    async searchNavigation({ query, limit = 12 }) {
        const trimmedQuery = query?.trim();

        if (!trimmedQuery) {
            return [];
        }

        try {
            const response = await this.fetch.get(
                'search',
                {
                    query: trimmedQuery,
                    limit,
                },
                {
                    namespace: 'ledger/int/v1',
                }
            );

            return response.results ?? [];
        } catch (_) {
            return [];
        }
    }
}
