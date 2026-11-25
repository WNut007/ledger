import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class PaymentsWalletsIndexDetailsController extends Controller {
    @service notifications;
    @service modalsManager;
    @service fetch;
    @service intl;

    get tabs() {
        return [
            { label: this.intl.t('ledger-ui.s.overview'), route: 'payments.wallets.index.details.index' },
            { label: this.intl.t('ledger-ui.s.transactions'), route: 'payments.wallets.index.details.transactions' },
        ];
    }

    get actionButtons() {
        const wallet = this.model;
        const frozen = wallet?.is_frozen;

        return [
            { id: 'top-up-wallet', label: this.intl.t('ledger-ui.s.add-funds'), icon: 'plus-circle', type: 'primary', helpText: this.intl.t('ledger-ui.s.add-funds-to-this-wallet-balance'), onClick: this.topUpWallet },
            { id: 'transfer-funds', label: this.intl.t('ledger-ui.s.transfer'), icon: 'exchange-alt', helpText: this.intl.t('ledger-ui.s.transfer-funds-from-this-wallet-to-another-walle'), onClick: this.transferFunds },
            {
                id: 'toggle-freeze',
                label: frozen ? 'Unfreeze' : 'Freeze',
                icon: frozen ? 'unlock' : 'lock',
                type: frozen ? 'default' : 'danger',
                helpText: frozen ? 'Unfreeze this wallet to allow debits.' : 'Freeze this wallet to block all debits.',
                onClick: frozen ? this.unfreezeWallet : this.freezeWallet,
            },
        ];
    }

    @action async freezeWallet() {
        const wallet = this.model;

        this.modalsManager.confirm({
            title: this.intl.t('ledger-ui.s.freeze-wallet-title', { name: wallet.name }),
            body: this.intl.t('ledger-ui.s.freeze-wallet-body'),
            acceptButtonText: this.intl.t('ledger-ui.s.freeze-wallet'),
            acceptButtonIcon: 'lock',
            acceptButtonScheme: 'danger',
            confirm: async (modal) => {
                modal.startLoading();
                try {
                    await this.fetch.post(`wallets/${wallet.id}/freeze`, {}, { namespace: 'ledger/int/v1' });
                    this.notifications.success(this.intl.t('ledger-ui.s.wallet-frozen-name', { name: wallet.name }));
                    await wallet.reload();
                    modal.done();
                } catch (error) {
                    this.notifications.serverError(error);
                    modal.stopLoading();
                }
            },
        });
    }

    @action async unfreezeWallet() {
        const wallet = this.model;

        this.modalsManager.confirm({
            title: this.intl.t('ledger-ui.s.unfreeze-wallet-title', { name: wallet.name }),
            body: this.intl.t('ledger-ui.s.unfreeze-wallet-body'),
            acceptButtonText: this.intl.t('ledger-ui.s.unfreeze-wallet'),
            acceptButtonIcon: 'unlock',
            confirm: async (modal) => {
                modal.startLoading();
                try {
                    await this.fetch.post(`wallets/${wallet.id}/unfreeze`, {}, { namespace: 'ledger/int/v1' });
                    this.notifications.success(this.intl.t('ledger-ui.s.wallet-unfrozen-name', { name: wallet.name }));
                    await wallet.reload();
                    modal.done();
                } catch (error) {
                    this.notifications.serverError(error);
                    modal.stopLoading();
                }
            },
        });
    }

    @action async topUpWallet() {
        const wallet = this.model;

        const options = {
            title: this.intl.t('ledger-ui.s.add-funds-title', { name: wallet.name }),
            acceptButtonText: this.intl.t('ledger-ui.s.add-funds'),
            acceptButtonIcon: 'plus-circle',
            wallet,
            amount: 0,
            description: '',
            setAmount: (centsValue) => {
                options.amount = centsValue;
            },
            setDescription: (event) => {
                options.description = event.target.value;
            },
            confirm: async (modal) => {
                if (!options.amount || options.amount <= 0) {
                    this.notifications.warning(this.intl.t('ledger-ui.s.please-enter-a-valid-amount-greater-than-zero'));
                    return;
                }
                modal.startLoading();
                try {
                    await this.fetch.post(`wallets/${wallet.id}/credit`, { amount: options.amount, description: options.description || 'Manual top-up' }, { namespace: 'ledger/int/v1' });
                    this.notifications.success(this.intl.t('ledger-ui.s.funds-added-to', { name: wallet.name }));
                    await wallet.reload();
                    modal.done();
                } catch (error) {
                    this.notifications.serverError(error);
                    modal.stopLoading();
                }
            },
        };

        this.modalsManager.show('modals/wallet-top-up', options);
    }

    @action async transferFunds() {
        const wallet = this.model;

        const options = {
            title: this.intl.t('ledger-ui.s.transfer-funds-title', { name: wallet.name }),
            acceptButtonText: 'Transfer',
            acceptButtonIcon: 'exchange-alt',
            wallet,
            toWallet: null,
            amount: 0,
            description: '',
            setToWallet: (selectedWallet) => {
                options.toWallet = selectedWallet;
            },
            setAmount: (centsValue) => {
                options.amount = centsValue;
            },
            setDescription: (event) => {
                options.description = event.target.value;
            },
            confirm: async (modal) => {
                if (!options.toWallet) {
                    this.notifications.warning(this.intl.t('ledger-ui.s.please-select-a-destination-wallet'));
                    return;
                }
                if (!options.amount || options.amount <= 0) {
                    this.notifications.warning(this.intl.t('ledger-ui.s.please-enter-a-valid-amount-greater-than-zero'));
                    return;
                }
                if (options.toWallet.id === wallet.id) {
                    this.notifications.warning(this.intl.t('ledger-ui.s.cannot-transfer-funds-to-the-same-wallet'));
                    return;
                }
                modal.startLoading();
                try {
                    await this.fetch.post(
                        `wallets/${wallet.id}/transfer`,
                        {
                            to_wallet_uuid: options.toWallet.id,
                            amount: options.amount,
                            description: options.description || 'Internal transfer',
                        },
                        { namespace: 'ledger/int/v1' }
                    );
                    this.notifications.success(this.intl.t('ledger-ui.s.funds-transferred-to', { name: options.toWallet.name }));
                    await wallet.reload();
                    modal.done();
                } catch (error) {
                    this.notifications.serverError(error);
                    modal.stopLoading();
                }
            },
        };

        this.modalsManager.show('modals/wallet-transfer', options);
    }
}
