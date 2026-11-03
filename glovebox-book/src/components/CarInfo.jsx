import React from "react"
import { StatCard } from "./StatCard"
import { displayCost, displayVolume } from '../utils/units'
import styles from './CarInfo.module.css'

export function CarInfo({ car, logs, onEditCar }) {
    const totalFuelCost = logs
        .filter(l => l.type === 'fillup')
        .reduce((sum, log) => sum + (log.usdStored || 0), 0)
    const totalMaintenanceCost = logs
        .filter(l => l.type === 'maintenance')
        .reduce((sum, log) => sum + (log.usdStored || 0), 0)
    const totalFuelVolume = logs
        .filter(l => l.type === 'fillup')
        .reduce((sum, log) => sum + (log.galStored || 0), 0)
    const totalOilChanges = logs
        .filter(l => l.type === 'oilchange')
        .length

    return(
        <div className={styles.container}>
            <div className={styles.carCard}>
                <div
                    className={styles.carIcon}
                    style={{ background: car.color }}
                >
                </div>
                <div className={styles.carDetails}>
                    <p className={styles.carName}>{car.name}</p>
                    <p className={styles.carSubtitle}>
                        {[car.year, car.make, car.model].filter(Boolean).join(' ') || 'No details yet'}
                    </p>
                    {car.plate && <p className={styles.carSubtitle}>{car.plate}</p>}
                </div>
                <button className={styles.editBtn} onClick={onEditCar}>Edit car info</button>
            </div>

            <div className={styles.statsGrid}>
                <StatCard label="Total fuel cost"   value={displayCost(totalFuelCost, car.curUnit)}   color="linear-gradient(135deg, #2468c8 0%, #1244aa 100%)" />
                <StatCard label="Maintenance cost"  value={displayCost(totalMaintenanceCost, car.curUnit)} color="linear-gradient(135deg, #cc6600 0%, #aa4400 100%)" />
                <StatCard label="Total fuel volume" value={displayVolume(totalFuelVolume, car.volUnit)} color="linear-gradient(135deg, #1a9a44 0%, #127733 100%)" />
                <StatCard label="Oil changes"       value={totalOilChanges} color="linear-gradient(135deg, #8844cc 0%, #6633aa 100%)" />
            </div>
        </div>
    )
}

