import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PaymentsTransactionsIndexRoute extends Route {
    @service store;

    queryParams = {
        page: { refreshModel: true },
        limit: { refreshModel: true },
        sort: { refreshModel: true },
        query: { refreshModel: true },
        status: { refreshModel: true },
        settlement_status: { refreshModel: true },
        show_zero: { refreshModel: true },
    };

    model(params) {
        // Zero-amount transactions (one per dispatched order) are hidden unless asked for.
        const { show_zero, ...query } = params;
        if (!show_zero) {
            query.hide_zero = 1;
        }

        return this.store.query('ledger-transaction', query);
    }
}
