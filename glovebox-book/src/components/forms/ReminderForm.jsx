import React from 'react'
import styles from './ReminderForm.module.css'

export function ReminderForm({ form, onFormChange, onSave, onCancel, du }) {
    return (
        <div className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                    type="text"
                    placeholder="e.g. Oil Change, Tire Rotation..."
                    value={form.name || ''}
                    onChange={e => onFormChange('name', e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Interval Distance ({du})</label>
                <input
                    type="number"
                    placeholder='e.g. 5000 mi'
                    value={form.intervalMi || ''}
                    onChange={e => onFormChange('intervalMi', e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Interval Time</label>
                <input
                    type="number"
                    placeholder='e.g. 6 months'
                    value={form.intervalMonths || ''}
                    onChange={e => onFormChange('intervalMonths', e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Last Completion Mileage ({du})</label>
                <input
                    type="number"
                    placeholder={du === 'mi' ? 'e.g. 16000' : 'e.g. 25000'}
                    value={form.lastMi || ''}
                    onChange={e => onFormChange('lastMi', e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Last Completion Date</label>
                <input
                    type="date"
                    placeholder='e.g. 06/12/2026'
                    value={form.lastDate || ''}
                    onChange={e => onFormChange('lastDate', e.target.value)}
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Notes</label>
                <input
                    type="text"
                    placeholder='e.g. 4.5 qt 5w-30 Valvoline'
                    value={form.notes || ''}
                    onChange={e => onFormChange('notes', e.target.value)}
                />
            </div>
            {/* Save/Cancel */}
            <div className={styles.actions}>
                <button className={styles.saveBtn} onClick={onSave}>Save</button>
                <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
            </div>
        </div>
    )
}