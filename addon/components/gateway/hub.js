import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

const DRIVER_COPY = {
    taler: {
        name: 'GNU Taler',
        icon: 'wallet',
        type: 'Wallet payment',
        descriptionKey: 'ledger-ui.s.privacy-preserving-wallet-payments-qr-checkout-w',
    },
    stripe: {
        name: 'Stripe',
        icon: 'credit-card',
        type: 'Cards and wallets',
        descriptionKey: 'ledger-ui.s.card-and-digital-wallet-processing-with-webhook',
    },
    cash: {
        nameKey: 'ledger-ui.s.cash',
        icon: 'money-bill-wave',
        type: 'Manual payment',
        descriptionKey: 'ledger-ui.s.record-offline-or-in-person-payments-without-ext',
    },
    qpay: {
        name: 'QPay',
        icon: 'qrcode',
        type: 'Regional payment',
        descriptionKey: 'ledger-ui.s.regional-gateway-support-for-qr-and-local-paymen',
    },
};

export default class GatewayHubComponent extends Component {
    @service intl;
    @service gatewayActions;
    @tracked table;

    get gateways() {
        return Array.from(this.args.gateways ?? []);
    }

    get summary() {
        return this.args.summary?.summary ?? {};
    }

    get drivers() {
        return Array.from(this.args.drivers ?? []);
    }

    get driverCards() {
        const configuredByDriver = new Map();

        this.gateways.forEach((gateway) => {
            const list = configuredByDriver.get(gateway.driver) ?? [];
            list.push(gateway);
            configuredByDriver.set(gateway.driver, list);
        });

        return ['taler', 'stripe', 'cash', 'qpay'].map((code) => {
            const manifest = this.drivers.find((driver) => driver.code === code) ?? {};
            const copy = DRIVER_COPY[code];
            const configured = configuredByDriver.get(code) ?? [];
            const active = configured.filter((gateway) => gateway.status === 'active');

            return {
                code,
                name: manifest.name ?? (copy.nameKey ? this.intl.t(copy.nameKey) : copy.name),
                icon: copy.icon,
                type: copy.type,
                description: copy.descriptionKey ? this.intl.t(copy.descriptionKey) : copy.description,
                capabilities: manifest.capabilities ?? [],
                configuredCount: configured.length,
                activeCount: active.length,
                primaryGateway: configured[0],
                connected: configured.length > 0,
            };
        });
    }

    get hasGatewayConnections() {
        return this.gateways.length > 0;
    }

    get warningCount() {
        return Number(this.summary.webhook_warnings ?? 0);
    }

    get statusTiles() {
        return [
            {
                label: this.intl.t('ledger-ui.s.active-gateways'),
                value: this.summary.active_gateways ?? 0,
                caption: 'Ready to collect payments',
                icon: 'plug',
                accentClass: Number(this.summary.active_gateways ?? 0) > 0 ? 'ledger-gateway-kpi-accent-green' : 'ledger-gateway-kpi-accent-blue',
            },
            {
                label: this.intl.t('ledger-ui.s.live-ready'),
                value: this.summary.live_gateways ?? 0,
                caption: 'Production connections',
                icon: 'bolt',
                accentClass: Number(this.summary.live_gateways ?? 0) > 0 ? 'ledger-gateway-kpi-accent-blue' : 'ledger-gateway-kpi-accent-slate',
            },
            {
                label: this.intl.t('ledger-ui.s.webhook-issues'),
                value: this.warningCount,
                caption: this.warningCount > 0 ? 'Need provisioning review' : 'No open warnings',
                icon: 'link',
                accentClass: this.warningCount > 0 ? 'ledger-gateway-kpi-accent-amber' : 'ledger-gateway-kpi-accent-green',
            },
            {
                label: this.intl.t('ledger-ui.s.sandbox'),
                value: this.summary.sandbox_gateways ?? 0,
                caption: 'Testing connections',
                icon: 'flask',
                accentClass: Number(this.summary.sandbox_gateways ?? 0) > 0 ? 'ledger-gateway-kpi-accent-amber' : 'ledger-gateway-kpi-accent-slate',
            },
        ];
    }

    @action setupTable(table) {
        this.table = table;
    }

    @action refresh() {
        if (typeof this.args.refresh === 'function') {
            this.args.refresh();
        }

        return this.gatewayActions.refresh();
    }

    @action openDriver(driver) {
        if (driver.primaryGateway) {
            return this.gatewayActions.transition.view(driver.primaryGateway);
        }

        return this.gatewayActions.transition.create(driver.code);
    }
}
