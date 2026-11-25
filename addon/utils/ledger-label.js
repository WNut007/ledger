/**
 * Labels the Ledger API sends as English text or codes (invoice statuses, AR aging buckets,
 * chart series names), translated for display. Unknown values are returned unchanged.
 */
const KEYS = {
    draft: 'draft',
    sent: 'sent',
    viewed: 'viewed',
    paid: 'paid',
    partial: 'partial',
    overdue: 'overdue',
    cancelled: 'cancelled',
    canceled: 'cancelled',
    void: 'voided',
    voided: 'voided',
    pending: 'pending',
    refunded: 'refunded',
    current: 'current',
    '1–30 days': 'aging-1-30',
    '1-30 days': 'aging-1-30',
    '31–60 days': 'aging-31-60',
    '31-60 days': 'aging-31-60',
    '61–90 days': 'aging-61-90',
    '61-90 days': 'aging-61-90',
    '90+ days': 'aging-over-90',
    revenue: 'revenue',
    expenses: 'expenses',
    operating: 'operating',
    financing: 'financing',
    investing: 'investing',
};

export default function ledgerLabel(intl, value) {
    if (typeof value !== 'string' || !value) {
        return value;
    }

    const key = KEYS[value.trim().toLowerCase()];

    return key ? intl.t(`ledger-ui.s.${key}`) : value;
}
