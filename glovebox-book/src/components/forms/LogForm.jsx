import React, { useState } from 'react'
import styles from './LogForm.module.css'

const LOG_TYPES = {
  fillup:      { label: 'Fill-up',     icon: '⛽' },
  oilchange:   { label: 'Oil Change',  icon: '🔧' },
  oiladd:      { label: 'Oil Added',   icon: '🛢️' },
  maintenance: { label: 'Maintenance', icon: '🔩' },
}

export function LogForm({ logType, onLogTypeChange, form, onFormChange, onSave, onCancel, du, vu, cu }) {
  const [inputDu, setInputDu] = useState(du)
  const [inputVu, setInputVu] = useState(vu)
  const [inputCu, setInputCu] = useState(cu)
  return (
    <div className={styles.form}>

      {/* Type selector */}
      <div className={styles.typeSelector}>
        {Object.entries(LOG_TYPES).map(([key, val]) => (
          <button
              key={key}
              className={`${styles.typeBtn} ${logType === key ? styles.typeBtnActive : ''}`}
              onClick={() => onLogTypeChange(key)}
          >            {val.icon} {val.label}
          </button>
        ))}
      </div>

      {/* Date */}
      <div className={styles.field}>
        <label className={styles.label}>Date</label>
        <input
          type="date"
          value={form.date || ''}
          onChange={e => onFormChange('date', e.target.value)}
        />
      </div>

      {/* Mileage */}
      <div className={styles.field}>
        <label className={styles.label}>Mileage</label>
        <div className={styles.inputRow}>
          <input
            type="number"
            placeholder={du === 'mi' ? 'e.g. 28500' : 'e.g. 45800'}
            value={form.distDisp || ''}
            onChange={e => {
              onFormChange('distDisp', e.target.value)
              onFormChange('distInputUnit', inputDu)
            }}
          />
          <button className={styles.unitToggle} onClick={() => setInputDu(inputDu === 'mi' ? 'km' : 'mi')}>{inputDu}</button>
        </div>
      </div>

      {/* Fill-up fields */}
      {logType === 'fillup' && (
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Volume</label>
            <div className={styles.inputRow}>
              <input
                type="number"
                placeholder={vu === 'gal' ? 'e.g. 11.230' : 'e.g. 42.50'}
                value={form.volDisp || ''}
                onChange={e => {
                  onFormChange('volDisp', e.target.value)
                  onFormChange('volInputUnit', inputVu)
                }}
              />
              <button className={styles.unitToggle} onClick={() => setInputVu(inputVu === 'gal' ? 'L' : 'gal')}>{inputVu}</button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}> Cost </label>
            <div className={styles.inputRow}>
              <input
                type="number"
                placeholder="e.g. 68.00"
                value={form.costDisp || ''}
                onChange={e => {
                  onFormChange('costDisp', e.target.value)
                  onFormChange('costInputUnit', inputCu)
                }}
              />
              <button className={styles.unitToggle} onClick={() => setInputCu(inputCu === 'USD' ? 'EUR' : 'USD')}>{inputCu}</button>
            </div>
          </div>
          
          <div className={styles.field}>
            <label className={styles.label}>Station (optional)</label>
            <input
              type="text"
              placeholder="e.g. Shell, BP…"
              value={form.station || ''}
              onChange={e => onFormChange('station', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Oil change fields */}
      {logType === 'oilchange' && (
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Oil brand/spec (optional)</label>
            <input
              type="text"
              placeholder="e.g. Mobil 1 5W-30"
              value={form.oilBrand || ''}
              onChange={e => onFormChange('oilBrand', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Cost ({cu})</label>
            <input
              type="number"
              placeholder="e.g. 85.00"
              value={form.costDisp || ''}
              onChange={e => onFormChange('costDisp', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Oil added fields */}
      {logType === 'oiladd' && (
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Amount added (L)</label>
            <input
              type="number"
              placeholder="e.g. 0.5"
              value={form.oilVolDisp || ''}
              onChange={e => onFormChange('oilVolDisp', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Oil brand (optional)</label>
            <input
              type="text"
              placeholder="e.g. Mobil 1 5W-30"
              value={form.oilBrand || ''}
              onChange={e => onFormChange('oilBrand', e.target.value)}
            />
            </div>
        </div>
      )}

      {/* Maintenance fields */}
      {logType === 'maintenance' && (
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <input
              type="text"
              placeholder="e.g. Brake pads replaced"
              value={form.description || ''}
              onChange={e => onFormChange('description', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Shop/Mechanic (optional)</label>
            <input
              type="text"
              placeholder="e.g. Jiffy Lube"
              value={form.shop || ''}
              onChange={e => onFormChange('shop', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Cost ({cu})</label>
            <input
              type="number"
              placeholder="e.g. 320.00"
              value={form.costDisp || ''}
              onChange={e => onFormChange('costDisp', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Labor hours (optional)</label>
            <input
              type="number"
              placeholder="e.g. 2.5"
              value={form.hours || ''}
              onChange={e => onFormChange('hours', e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      <div className={styles.field}>
        <label>Notes (optional)</label>
        <textarea
          rows={2}
          placeholder="Any notes…"
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