import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class AccountingAccountsIndexDetailsController extends Controller {
    @service intl;
    @tracked overlay = null;

    get tabs() {
        return [
            { label: this.intl.t('ledger-ui.s.overview'), route: 'accounting.accounts.index.details.index' },
            { label: this.intl.t('ledger-ui.s.general-ledger'), route: 'accounting.accounts.index.details.ledger' },
        ];
    }

    get actionButtons() {
        return [];
    }
}
