import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class PaymentsTransactionsIndexDetailsController extends Controller {
    @service intl;
    @tracked overlay = null;

    get tabs() {
        return [{ label: this.intl.t('ledger-ui.s.overview'), route: 'payments.transactions.index.details.index' }];
    }

    get actionButtons() {
        return [];
    }
}
