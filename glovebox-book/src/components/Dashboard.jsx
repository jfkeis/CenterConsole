import React from 'react'
import { StatCard } from './StatCard'
import { LogRow } from './LogRow'
import { ReminderRow } from './ReminderRow'
import { displayCost, displayVolume } from '../utils/units'
import { remStatus } from '../utils/reminders'
import styles from './Dashboard.module.css'

export function Dashboard({ car, logs, reminders, du, vu, cu, onAddLog, onEditLog, onDeleteLog, onAddReminder, onEditReminder, onDeleteReminder }) {

    const latestMi = logs
        .filter(l => l.miStored != null)
        .sort((a, b) => b.miStored - a.miStored)[0]?.miStored

    const fillups = logs.filter(l => l.type === 'fillup')

    const withMpg = fillups.filter(l => l.mpg != null)
    const avgEfficiency = withMpg.length > 0
        ? withMpg.reduce((sum, l) => sum + l.mpg, 0) / withMpg.length
        : null

    const totalFuelCost = fillups
        .reduce((sum, l) => sum + (l.usdStored || 0), 0)

    const maintenanceItems = logs.filter(l => l.type === 'maintenance')
    const totalMaintenanceCost = maintenanceItems
        .reduce((sum, l) => sum+ (l.usdStored || 0), 0)

    const recentLogs = logs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    
    const upcomingReminders = reminders.slice(0, 3)

    return (
        <div className={styles.dashboard}>
            {/* Stat cards */}
            <div className={styles.statsGrid}>
                <StatCard label="Current mileage" value={latestMi ? latestMi.toLocaleString() + ' ' + du : '—'} color="linear-gradient(135deg, #1a58c8 0%, #0e3a9a 100%)" />
                <StatCard label="Avg efficiency" value={avgEfficiency ? avgEfficiency.toFixed(1) + ' MPG' : '—'} color="linear-gradient(135deg, #157a34 0%, #0a5522 100%)" />
                <StatCard label="Total fuel cost" value={displayCost(totalFuelCost, cu)} color="linear-gradient(135deg, #7733bb 0%, #552299 100%)" />
                <StatCard label="Maintenance cost" value={displayCost(totalMaintenanceCost, cu)} color="linear-gradient(135deg, #d46000 0%, #c54f00 100%)" />
            </div>

            {/* Quick add */}
            <div className={styles.section}>
                <p className={styles.sectionTitle}>Quick add</p>
                <div className={styles.quickAdd}>
                    <button className={styles.quickAddBtn} onClick={() => onAddLog('fillup')}>⛽ Fill-up</button>
                    <button className={styles.quickAddBtn} onClick={() => onAddLog('oilchange')}>🔧 Oil Change</button>
                    <button className={styles.quickAddBtn} onClick={() => onAddLog('oiladd')}>🛢️ Oil Added</button>
                    <button className={styles.quickAddBtn} onClick={() => onAddLog('maintenance')}>🔩 Maintenance</button>
                </div>
                
            </div>

            {/* Recent logs */}
            <div className={styles.section}>
                <p className={styles.sectionTitle}>Recent activity</p>
                {recentLogs.length === 0 && <p>No entries yet.</p>}
                {recentLogs.map(log => (
                    <LogRow
                        key={log.id}
                        log={log}
                        du={du}
                        vu={vu}
                        onEdit={() => onEditLog(log)}
                        onDelete={() => onDeleteLog(log.id)}
                    />
                ))}
            </div>

            {/* Upcoming reminders */}
            <div className={styles.section}>
                <p className={styles.sectionTitle}>Upcoming reminders</p>
                {upcomingReminders.length === 0 && <p>No reminders yet.</p>}
                {upcomingReminders.map(r => (
                    <ReminderRow
                        key={r.id}
                        reminder={r}
                        status={remStatus(r, latestMi)}
                        du={du}
                        onEdit={() => onEditReminder(r)}
                        onDelete={() => onDeleteReminder(r.id)}
                    />
                ))}
            </div>
        </div>
    )
}

