import React from 'react'
import styles from './CarForm.module.css'

export function CarForm({ form, onFormChange, onSave, onCancel, onDelete }) {
    console.log('form:', form)
    return (
        <div className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                    type="text"
                    placeholder="e.g. Patrick, Red Rocket, Sasha..."
                    value={form.name || ''}
                    onChange={e => onFormChange('name', e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Make</label>
                <input
                    type="text"
                    placeholder='e.g. Honda'
                    value={form.make || ''}
                    onChange={e => onFormChange('make', e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label>Model</label>
                <input
                    type="text"
                    placeholder='e.g. Civic'
                    value={form.model || ''}
                    onChange={e => onFormChange('model', e.target.value)}
                />
            </div>
            
            <div className={styles.field}>
                <label>Year</label>
                <input
                    type="number"
                    placeholder='e.g. 1990'
                    value={form.year || ''}
                    onChange={e => onFormChange('year', e.target.value)}
                />
            </div>

            <div className={styles.field}>
                <label>License Plate</label>
                <input
                    type="text"
                    placeholder='e.g. KLUQ123'
                    value={form.plate || ''}
                    onChange={e => onFormChange('plate', e.target.value)}
                />
            </div>

            {/* Unit Preferences */}
                <div className={styles.unitSection}>
                    <div className={styles.unitRow}>
                        <span className={styles.unitLabel}>Distance</span>
                        <div className={styles.unitBtns}>
                            {['mi', 'km'].map(u => (
                                <button key={u}
                                    className={`${styles.unitBtn} ${form.distUnit === u ? styles.unitBtnActive : ''}`}
                                    onClick={() => onFormChange('distUnit', u)}>
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.unitRow}>
                        <span className={styles.unitLabel}>Volume</span>
                        <div className={styles.unitBtns}>
                            {['gal', 'L'].map(u => (
                                <button key={u}
                                    className={`${styles.unitBtn} ${form.volUnit === u ? styles.unitBtnActive : ''}`}
                                    onClick={() => onFormChange('volUnit', u)}>
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.unitRow}>
                        <span className={styles.unitLabel}>Currency</span>
                        <div className={styles.unitBtns}>
                            {['USD', 'EUR'].map(u => (
                                <button key={u}
                                    className={`${styles.unitBtn} ${form.curUnit === u ? styles.unitBtnActive : ''}`}
                                    onClick={() => onFormChange('curUnit', u)}>
                                    {u}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className={styles.colorRow}>
                        <span className={styles.unitLabel}>Tab Color</span>
                        <input type="color" className={styles.colorInput}
                            value={form.color || '#2563eb'}
                            onChange={e => onFormChange('color', e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Save/Cancel Buttons */}
                <div className={styles.actions}>
                    <button className={styles.saveBtn} onClick={onSave}>Save</button>
                    <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={onDelete}>Delete Car</button>
                </div>
        </div>
    )
}

               