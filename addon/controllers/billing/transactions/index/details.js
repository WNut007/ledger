import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class BillingTransactionsIndexDetailsController extends Controller {
    @service intl;
    get tabs() {
        return [{ label: this.intl.t('ledger-ui.s.details'), route: 'console.ledger.billing.transactions.index.details.index' }];
    }

    get actionButtons() {
        return [];
    }
}
