import { miToKm, galToL, round } from '../utils/units'
import styles from './LogRow.module.css'

const LOG_TYPES = {
  fillup:      { label: 'Fill-up',     icon: '⛽' },
  oilchange:   { label: 'Oil Change',  icon: '🔧' },
  oiladd:      { label: 'Oil Added',   icon: '🛢️' },
  maintenance: { label: 'Maintenance', icon: '🔩' },
}

export function LogRow({ log, onEdit, onDelete, du, vu }) { //du = distance unit vu = volume unit
    const type = LOG_TYPES[log.type]

    const displayMileage = log.miStored
        ? Math.round(du === 'km' ? miToKm(log.miStored) : log.miStored).toLocaleString() + ' ' + du
        : null

    const displayEfficiency = log.type === 'fillup' && log.mpg
        ? round(log.mpg, 1) + ' MPG'
        : null

    const displayDate = log.date
        ? new Date(log.date).toLocaleDateString(undefined, {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
        :''
    
    const title = log.type === 'fillup' && log.galStored
        ? `${type.label} · ${round(vu === 'L' ? galToL(log.galStored) : log.galStored, 2)} ${vu}`
        : log.type === 'oilchange' && log.oilBrand
        ? `${type.label} · ${log.oilBrand}`
        : log.type === 'oiladd' && log.oilGalStored
        ? `${type.label} · ${round(galToL(log.oilGalStored), 2)} L`
        : log.type === 'maintenance' && log.description
        ? log.description
        : type.label

    return (
        <div className={styles.row}>
            <span className={styles.icon}>{type.icon}</span>
            <div className={styles.content}>
                <div className={styles.titleRow}>
                    <span className={styles.title}>{title}</span>
                    {log.usdStored && <span className={styles.cost}>${log.usdStored.toFixed(2)}</span>}
                </div>
                <div className={styles.detailsRow}>
                    {displayDate && <span className={styles.detail}>{displayDate}</span>}
                    {displayMileage && <span className={styles.detail}> | {displayMileage}</span>}
                    {displayEfficiency && <span className={styles.detail}> | {displayEfficiency}</span>}
                </div>
            </div>
        
            <div className={styles.actions}>
                <button className={styles.actionBtn} onClick={onEdit}>Edit</button>
                <button className={`${styles.actionBtn} ${styles.actionBtnDelete}`} onClick={onDelete}>Delete</button>
            </div>
        </div>
    )
}