import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class PaymentsGatewaysDetailsController extends Controller {
    @service intl;
    @service notifications;
    @service modalsManager;
    @service hostRouter;

    @tracked overlay = null;

    get tabs() {
        const currentRouteName = this.hostRouter.currentRouteName;

        return [
            { label: this.intl.t('ledger-ui.s.overview'), route: 'payments.gateways.details.index' },
            { label: this.intl.t('ledger-ui.s.setup'), route: 'payments.gateways.details.setup' },
            { label: this.intl.t('ledger-ui.s.diagnostics'), route: 'payments.gateways.details.diagnostics' },
            { label: this.intl.t('ledger-ui.s.transactions'), route: 'payments.gateways.details.webhooks' },
        ].map((tab) => ({
            ...tab,
            active: currentRouteName === tab.route || currentRouteName?.endsWith(`.${tab.route}`),
        }));
    }

    get isTransactionsTab() {
        const currentRouteName = this.hostRouter.currentRouteName;

        return currentRouteName === 'payments.gateways.details.webhooks' || currentRouteName?.endsWith('.payments.gateways.details.webhooks');
    }

    get actionButtons() {
        return [
            { id: 'edit-gateway', label: this.intl.t('ledger-ui.s.edit'), icon: 'pencil', helpText: this.intl.t('ledger-ui.s.edit-this-payment-gateway-configuration'), onClick: this.editGateway },
            {
                id: 'delete-gateway',
                label: this.intl.t('ledger-ui.s.delete'),
                icon: 'trash',
                type: 'danger',
                helpText: this.intl.t('ledger-ui.s.permanently-remove-this-payment-gateway-this-can'),
                onClick: this.deleteGateway,
            },
        ];
    }

    get driverIcon() {
        return (
            {
                taler: 'wallet',
                stripe: 'credit-card',
                cash: 'money-bill-wave',
                qpay: 'qrcode',
            }[this.model?.driver] ?? 'plug'
        );
    }

    get statusLabel() {
        return this.model?.status === 'active' ? 'Active' : 'Inactive';
    }

    @action editGateway() {
        const gateway = this.model;
        this.hostRouter.transitionTo('console.ledger.payments.gateways.edit', gateway);
    }

    @action async deleteGateway() {
        const gateway = this.model;
        this.modalsManager.confirm({
            title: this.intl.t('ledger-ui.s.delete-gateway-title', { name: gateway.name }),
            body: this.intl.t('ledger-ui.s.cannot-be-undone'),
            confirm: async (modal) => {
                modal.startLoading();
                try {
                    await gateway.destroyRecord();
                    this.notifications.success(this.intl.t('ledger-ui.s.gateway-deleted'));
                    this.hostRouter.transitionTo('console.ledger.payments.gateways.index');
                    modal.done();
                } catch (error) {
                    this.notifications.serverError(error);
                    modal.stopLoading();
                }
            },
        });
    }
}
