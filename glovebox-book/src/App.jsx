import React, { useState } from 'react'
import { useStorage } from './hooks/useStorage'
import { Dashboard } from './components/Dashboard'
import { LogList } from './components/LogList'
import { Reminders } from './components/Reminders'
import { CarInfo } from './components/CarInfo'
import { Modal } from './components/Modal'
import { LogForm } from './components/forms/LogForm'
import { ReminderForm } from './components/forms/ReminderForm'
import { CarForm } from './components/forms/CarForm'
import logo from './assets/centerConsoleLogo.png'
import styles from './App.module.css'
import { toMi, toGal, toUSD, getContrastText, miToKm, galToL, usdToEur } from './utils/units'

const DEFAULT_CARS = [
    { id: 'car1', name: "Red Rocket", make: '', model: '', year: '', plate: '', distUnit: 'mi', volUnit: 'gal', curUnit: 'USD', color: '#99241c' },
    { id: 'car2', name: "Wagon", make: '', model: '', year: '', plate: '', distUnit: 'mi', volUnit: 'gal', curUnit: 'USD', color: '#a6a6a6' },
]

export default function App() {
    const [cars, setCars] = useStorage('cars', DEFAULT_CARS)
    const [logs, setLogs] = useStorage('logs', [])
    const [reminders, setReminders] = useStorage('reminders', [])

    const [activeCar, setActiveCar] = useState(DEFAULT_CARS[0].id)
    const [activeView, setActiveView] = useState('dashboard')
    const [modal, setModal] = useState(null)

    const [logType, setLogType] = useState('fillup')
    const [logForm, setLogForm] = useState({})
    const [reminderForm, setReminderForm] = useState({})
    const [carForm, setCarForm] = useState({})

    const [editingLog, setEditingLog] = useState(null)
    const [editingReminder, setEditingReminder] = useState(null)

    // the currently selected car object
    const car = cars.find(c => c.id === activeCar)

    // all logs for the current car
    const carLogs = logs.filter(l => l.carId === activeCar)

    // all reminders for the current car
    const carReminders = reminders.filter(r => r.carId === activeCar)

    // shorthand for current car's unit preferences
    const du = car?.distUnit || 'mi'
    const vu = car?.volUnit || 'gal'
    const cu = car?.curUnit || 'USD'

    function buildLogForm(log) {
    return {
        ...log,
        distDisp: log.miStored != null
            ? String(Math.round(du === 'km' ? miToKm(log.miStored) : log.miStored))
            : '',
        volDisp: log.galStored != null
            ? (vu === 'L' ? galToL(log.galStored) : log.galStored).toFixed(3)
            : '',
        costDisp: log.usdStored != null
            ? (cu === 'EUR' ? usdToEur(log.usdStored) : log.usdStored).toFixed(2)
            : '',
        oilVolDisp: log.oilGalStored != null
            ? galToL(log.oilGalStored).toFixed(2)
            : '',
    }
}

    function saveLog() {
        const miStored = logForm.distDisp ? toMi(logForm.distDisp, logForm.distInputUnit || du) : undefined
        const galStored = logForm.volDisp ? toGal(logForm.volDisp, logForm.volInputUnit || vu) : undefined
        const usdStored = logForm.costDisp ? toUSD(logForm.costDisp, logForm.costInputUnit || cu) : undefined
        const oilGalStored = logForm.oilVolDisp ? toGal(logForm.oilVolDisp, 'L') : undefined
        
        let mpg = null
        if (logType === 'fillup' && miStored && galStored) {
            const prevFillup = logs
                .filter(l => l.carId === activeCar && l.type === 'fillup' && l.miStored < miStored)
                .sort((a, b) => b.miStored - a.miStored)[0]
            if (prevFillup) {
                const distMi = miStored - prevFillup.miStored
                mpg = distMi / galStored
            }
        }

        const entry = {
            id: editingLog?.id || `log-${Date.now()}`,
            carId: activeCar,
            type: logType,
            date: logForm.date,
            miStored,
            galStored,
            oilGalStored,
            usdStored,
            mpg,
            oilBrand: logForm.oilBrand,
            description: logForm.description,
            shop: logForm.shop,
            hours: logForm.hours,
            station: logForm.station,
            notes: logForm.notes,
        }

        if (editingLog) {
            setLogs(prev => prev.map(l => l.id === editingLog.id ? entry : l))
        } else {
            setLogs(prev => [...prev, entry])
        }

        setModal(null)
        setEditingLog(null)
        setLogForm({})
    }

    function deleteLog(id) {
        if (!confirm('Delete this entry?')) return
        setLogs(prev => prev.filter(l => l.id !== id))
    }

    function saveReminder() {
        const entry = {
            id: editingReminder?.id || `rem-${Date.now()}`,
            carId: activeCar,
            name: reminderForm.name,
            intervalMi: reminderForm.intervalMi ? toMi(reminderForm.intervalMi, du) : undefined,
            intervalMonths: reminderForm.intervalMonths ? Number(reminderForm.intervalMonths) : undefined,
            lastMi: reminderForm.lastMi ? toMi(reminderForm.lastMi, du) : undefined,
            lastDate: reminderForm.lastDate,
            notes: reminderForm.notes,
        }

        if (editingReminder) {
            setReminders(prev => prev.map(r => r.id === editingReminder.id ? entry : r))
        } else {
            setReminders(prev => [...prev, entry])
        }

        setModal(null)
        setEditingReminder(null)
        setReminderForm({})
    }

    function deleteReminder(id) {
        if (!confirm('Delete this reminder?')) return
        setReminders(prev => prev.filter(r => r.id !== id))
    }

    function saveCar() {
        setCars(prev => prev.map(c => c.id === activeCar ? { ...c, ...carForm } : c))
        setModal(null)
        setCarForm({})
    }

    function addCar() {
        const id = `car-${Date.now()}`
        const newCar = {
            id,
            name: 'New Car',
            make: '', model: '', year: '', plate: '',
            distUnit: 'mi', volUnit: 'gal', curUnit: 'USD',
            color: '#16a34a'
        }
        setCars(prev => [...prev, newCar])
        setActiveCar(id)
        setCarForm(newCar)
        setModal('car')
    }

    function deleteCar(id) {
        if (!confirm('Delete this car and all its logs and reminders? This cannot be undone.')) return
        setCars(prev => prev.filter(c => c.id !== id))
        setLogs(prev => prev.filter(l => l.carId !== id))
        setReminders(prev => prev.filter(r => r.carId !== id))
        setActiveCar(cars.find(c => c.id !== id)?.id || null)
        setModal(null)
    }

    return (
        <div className={styles.app}>
            {/* Header + Car tabs */}
            <div className={styles.headerRow}>
                <div className={styles.headerLeft}>
                    <img 
                        src={logo} 
                        alt="CenterConsole" 
                        style={{ 
                            height: 48, 
                            width: 'auto', 
                            borderRadius: 10,
                            background: 'var(--bg)',
                            padding: 4
                        }} 
                    />
                    <div>
                        <p className={styles.appTitle}>CenterConsole</p>
                        <p className={styles.appSubtitle}>Car maintenance tracker</p>
                    </div>
                </div>
                <div className={styles.carTabs}>
                    {cars.map(c => (
                        <button
                            key={c.id}
                            className={`${styles.carTab} ${activeCar === c.id ? styles.carTabActive : ''}`}
                            style={activeCar === c.id ? {
                                background: c.color,
                                border: `1.5px solid ${getContrastText(c.color) === '#1a2433' ? '#b0bec9' : c.color}`,
                                color: getContrastText(c.color),
                                boxShadow: `0 2px 8px rgba(0,0,0,0.2)`
                            } : {}}
                            onClick={() => {
                                setActiveCar(c.id)
                                setActiveView('dashboard')
                            }}
                        >
                            {c.name}
                        </button>
                    ))}
                    <button onClick={addCar}>+ Add car</button>
                </div>
            </div>

            {/* Nav tabs */}
            <div className={styles.navTabs}>
                {[
                    { key: 'dashboard', label: 'Dashboard' },
                    { key: 'logs',      label: 'Logs' },
                    { key: 'reminders', label: 'Reminders' },
                    { key: 'carinfo',   label: 'Car Info' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.navTab} ${activeView === tab.key ? styles.navTabActive : ''}`}
                        onClick={() => setActiveView(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Views */}
            {activeView === 'dashboard' && (
                <Dashboard
                    car={car}
                    logs={carLogs}
                    reminders={carReminders}
                    du={du}
                    vu={vu}
                    cu={cu}
                    onAddLog={(type) => {
                        setLogType(type)
                        setLogForm({ date: new Date().toISOString().slice(0, 10) })
                        setEditingLog(null)
                        setModal('log')
                    }}
                    onEditLog={(log) => {
                        setLogType(log.type)
                        setLogForm(buildLogForm(log))
                        setEditingLog(log)
                        setModal('log')
                    }}
                    onDeleteLog={deleteLog}
                    onAddReminder={() => {
                        setReminderForm({})
                        setEditingReminder(null)
                        setModal('reminder')
                    }}
                    onEditReminder={(r) => {
                        setReminderForm({ ...r })
                        setEditingReminder(r)
                        setModal('reminder')
                    }}
                    onDeleteReminder={deleteReminder}
                />
            )}

            {activeView === 'logs' && (
                <LogList
                    logs={carLogs}
                    du={du}
                    vu={vu}
                    cu={cu}
                    onAdd={() => {
                        setLogType('fillup')
                        setLogForm({ date: new Date().toISOString().slice(0, 10) })
                        setEditingLog(null)
                        setModal('log')
                    }}
                    onEdit={(log) => {
                        setLogType(log.type)
                        setLogForm(buildLogForm(log))
                        setEditingLog(log)
                        setModal('log')
                    }}
                    onDelete={deleteLog}
                />
            )}

            {activeView === 'reminders' && (
                <Reminders
                    reminders={carReminders}
                    latestMi={carLogs
                        .filter(l => l.miStored != null)
                        .sort((a, b) => b.miStored - a.miStored)[0]?.miStored}
                    du={du}
                    onAdd={() => {
                        setReminderForm({})
                        setEditingReminder(null)
                        setModal('reminder')
                    }}
                    onEdit={(r) => {
                        setReminderForm({ ...r })
                        setEditingReminder(r)
                        setModal('reminder')
                    }}
                    onDelete={deleteReminder}
                />
            )}

            {activeView === 'carinfo' && (
                <CarInfo
                    car={car}
                    logs={carLogs}
                    onEditCar={() => {
                        setCarForm({ ...car })
                        setModal('car')
                    }}
                />
            )}

            {/* Modals */}
            {modal === 'log' && (
                <Modal
                    title={editingLog ? 'Edit Entry' : 'Add Entry'}
                    onClose={() => setModal(null)}
                >
                    <LogForm
                        logType={logType}
                        onLogTypeChange={setLogType}
                        form={logForm}
                        onFormChange={(field, value) => setLogForm(prev => ({ ...prev, [field]: value }))}
                        onSave={saveLog}
                        onCancel={() => setModal(null)}
                        du={du}
                        vu={vu}
                        cu={cu}
                    />
                </Modal>
            )}

            {modal === 'reminder' && (
                <Modal
                    title={editingReminder ? 'Edit Reminder' : 'Add Reminder'}
                    onClose={() => setModal(null)}
                >
                    <ReminderForm
                        form={reminderForm}
                        onFormChange={(field, value) => setReminderForm(prev => ({ ...prev, [field]: value }))}
                        onSave={saveReminder}
                        onCancel={() => setModal(null)}
                        du={du}
                    />
                </Modal>
            )}

            {modal === 'car' && (
                <Modal
                    title='Car Details'
                    onClose={() => setModal(null)}
                >
                    <CarForm
                        form={carForm}
                        onFormChange={(field, value) => setCarForm(prev => ({ ...prev, [field]: value }))}
                        onSave={saveCar}
                        onCancel={() => setModal(null)}
                        onDelete={() => deleteCar(activeCar)}
                    />
                </Modal>
            )}

        </div>
    )
}