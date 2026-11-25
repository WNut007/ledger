import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class AccountingJournalIndexController extends Controller {
    @service journalActions;
    @service tableContext;
    @service intl;

    @tracked queryParams = this.journalActions.queryParamsFor(['page', 'limit', 'sort', 'query', 'type', 'status', 'currency']);
    @tracked page = 1;
    @tracked limit = 30;
    @tracked sort = '-entry_date';
    @tracked query = null;
    @tracked type = null;
    @tracked status = null;
    @tracked currency = null;
    @tracked table = null;

    get actionButtons() {
        return [
            {
                id: 'refresh',
                icon: 'refresh',
                onClick: this.journalActions.refresh,
                helpText: this.intl.t('common.refresh'),
            },
            {
                id: 'create',
                text: this.intl.t('common.new'),
                type: 'primary',
                icon: 'plus',
                onClick: this.journalActions.transition.create,
            },
        ];
    }

    get bulkActions() {
        const selected = this.tableContext.getSelectedRows();
        return [
            {
                id: 'bulk-delete',
                label: this.intl.t('common.delete-selected-count', { count: selected.length }),
                class: 'text-red-500',
                fn: this.journalActions.bulkDelete,
            },
        ];
    }

    get columns() {
        return [
            {
                id: 'number',
                sticky: true,
                label: this.intl.t('column.number'),
                valuePath: 'number',
                cellComponent: 'table/cell/anchor',
                action: this.journalActions.transition.view,
                resizable: true,
                sortable: true,
            },
            {
                id: 'entry-date',
                label: this.intl.t('column.date'),
                valuePath: 'entryDate',
                filterParam: 'entry_date',
                resizable: true,
                sortable: true,
            },
            {
                id: 'type',
                label: this.intl.t('column.type'),
                valuePath: 'type',
                humanize: true,
                resizable: true,
                sortable: true,
                filterable: true,
                filterParam: 'type',
                filterComponent: 'filter/select',
                filterOptionLabel: 'label',
                filterOptionValue: 'value',
                filterOptions: [
                    { label: this.intl.t('ledger-ui.s.general'), value: 'general' },
                    { label: this.intl.t('ledger-ui.s.payment'), value: 'payment' },
                    { label: this.intl.t('ledger-ui.s.refund'), value: 'refund' },
                    { label: this.intl.t('ledger-ui.s.adjustment'), value: 'adjustment' },
                    { label: this.intl.t('ledger-ui.s.deposit'), value: 'deposit' },
                    { label: this.intl.t('ledger-ui.s.withdrawal'), value: 'withdrawal' },
                    { label: this.intl.t('ledger-ui.s.transfer'), value: 'transfer' },
                ],
            },
            {
                id: 'status',
                label: this.intl.t('column.status'),
                valuePath: 'status',
                cellComponent: 'table/cell/status',
                resizable: true,
                sortable: true,
                filterable: true,
                filterParam: 'status',
                filterComponent: 'filter/select',
                filterOptionLabel: 'label',
                filterOptionValue: 'value',
                filterOptions: [
                    { label: this.intl.t('ledger-ui.s.posted'), value: 'posted' },
                    { label: this.intl.t('ledger-ui.s.draft'), value: 'draft' },
                    { label: this.intl.t('ledger-ui.s.voided'), value: 'voided' },
                ],
            },
            {
                id: 'amount',
                label: this.intl.t('column.amount'),
                valuePath: 'amount',
                cellComponent: 'table/cell/currency',
                resizable: true,
                sortable: true,
            },
            {
                id: 'debit-account-code',
                label: this.intl.t('column.debit-account'),
                valuePath: 'debit_account.code',
                resizable: true,
                filterable: true,
                filterParam: 'debitAccount',
                filterComponent: 'filter/string',
            },
            {
                id: 'credit-account-code',
                label: this.intl.t('column.credit-account'),
                valuePath: 'credit_account.code',
                resizable: true,
                filterable: true,
                filterParam: 'creditAccount',
                filterComponent: 'filter/string',
            },
            {
                id: 'reference',
                label: this.intl.t('column.reference'),
                valuePath: 'reference',
                resizable: true,
                hidden: true,
            },
            {
                id: 'memo',
                label: this.intl.t('column.memo'),
                valuePath: 'memo',
                resizable: true,
                hidden: true,
            },
        ];
    }
}
