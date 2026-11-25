import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';
import { task } from 'ember-concurrency';

const ACCOUNT_TYPES = [
    { labelKey: 'ledger-ui.s.all-types', value: null },
    { labelKey: 'ledger-ui.s.asset', value: 'asset' },
    { labelKey: 'ledger-ui.s.liability', value: 'liability' },
    { labelKey: 'ledger-ui.s.equity', value: 'equity' },
    { labelKey: 'ledger-ui.s.revenue', value: 'revenue' },
    { labelKey: 'ledger-ui.s.expense', value: 'expense' },
];

export default class AccountingGeneralLedgerController extends Controller {
    @service intl;
    @service fetch;

    @tracked accounts = [];
    @tracked dateRange = null;
    @tracked date_from = null;
    @tracked date_to = null;
    @tracked type = null;

    /**
     * Plain object map of accountId → boolean for expanded state.
     * Tracked so HBS re-renders when it changes.
     */
    @tracked expandedMap = {};

    get accountTypes() {
        return ACCOUNT_TYPES.map((t) => ({ label: this.intl.t(t.labelKey), value: t.value }));
    }

    get selectedType() {
        return this.accountTypes.find((t) => t.value === this.type) ?? this.accountTypes[0];
    }

    get allExpanded() {
        return this.accounts.length > 0 && this.accounts.every((a) => this.expandedMap[a.account.id]);
    }

    @task *loadGeneralLedger() {
        try {
            const params = {};
            if (this.date_from) params.date_from = this.date_from;
            if (this.date_to) params.date_to = this.date_to;
            if (this.type) params.type = this.type;

            const result = yield this.fetch.get('reports/general-ledger', params, { namespace: 'ledger/int/v1' });
            this.accounts = result?.data?.accounts ?? [];
        } catch {
            this.accounts = [];
        }
    }

    @action reload() {
        this.loadGeneralLedger.perform();
    }

    @action setType(option) {
        this.type = option?.value ?? null;
        this.loadGeneralLedger.perform();
    }

    @action onDateRangeChanged({ formattedDate }) {
        if (isArray(formattedDate) && formattedDate.length === 2) {
            this.date_from = formattedDate[0];
            this.date_to = formattedDate[1];
            this.loadGeneralLedger.perform();
        } else if (!formattedDate || formattedDate.length === 0) {
            this.date_from = null;
            this.date_to = null;
            this.loadGeneralLedger.perform();
        }
    }

    @action toggleAccount(accountId) {
        this.expandedMap = {
            ...this.expandedMap,
            [accountId]: !this.expandedMap[accountId],
        };
    }

    @action toggleExpandAll() {
        if (this.allExpanded) {
            this.expandedMap = {};
        } else {
            const map = {};
            this.accounts.forEach((a) => {
                map[a.account.id] = true;
            });
            this.expandedMap = map;
        }
    }
}
