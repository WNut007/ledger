import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';

export default class WalletsIndexController extends Controller {
    @service intl;
    @service hostRouter;
    @service notifications;
    @service modalsManager;
    @service fetch;

    queryParams = ['page', 'limit', 'sort', 'query', 'type'];

    @tracked page = 1;
    @tracked limit = 30;
    @tracked sort = '-created_at';
    @tracked query = null;
    @tracked type = null;
    @tracked table = null;

    get columns() {
        return [
            { label: this.intl.t('ledger-ui.s.name'), valuePath: 'name', width: '200px', sortable: true },
            { label: this.intl.t('ledger-ui.s.type'), valuePath: 'type_label', width: '100px' },
            { label: this.intl.t('ledger-ui.s.currency'), valuePath: 'currency', width: '80px' },
            { label: this.intl.t('ledger-ui.s.balance-2'), valuePath: 'formatted_balance', width: '140px', sortable: true },
            { label: this.intl.t('ledger-ui.s.status'), valuePath: 'status_label', width: '100px', component: 'table/cell/status' },
        ];
    }

    get actionButtons() {
        return [];
    }

    get bulkActions() {
        return [];
    }

    @task({ restartable: true }) *search(query) {
        yield Promise.resolve();
        this.query = query;
    }

    @action viewWallet(wallet) {
        this.hostRouter.transitionTo('console.ledger.wallets.index.details', wallet.id);
    }

    @action async freezeWallet(wallet) {
        try {
            await this.fetch.post(`wallets/${wallet.id}/freeze`, {}, { namespace: 'ledger/int/v1' });
            this.notifications.success(this.intl.t('ledger-ui.s.wallet-frozen'));
            this.hostRouter.refresh();
        } catch (error) {
            this.notifications.serverError(error);
        }
    }

    @action async unfreezeWallet(wallet) {
        try {
            await this.fetch.post(`wallets/${wallet.id}/unfreeze`, {}, { namespace: 'ledger/int/v1' });
            this.notifications.success(this.intl.t('ledger-ui.s.wallet-unfrozen'));
            this.hostRouter.refresh();
        } catch (error) {
            this.notifications.serverError(error);
        }
    }

    @action reload() {
        return this.hostRouter.refresh();
    }
}
