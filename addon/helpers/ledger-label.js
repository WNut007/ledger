import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import ledgerLabel from '../utils/ledger-label';

export default class LedgerLabelHelper extends Helper {
    @service intl;

    compute([value]) {
        return ledgerLabel(this.intl, value);
    }
}
