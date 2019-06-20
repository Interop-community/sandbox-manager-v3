export default {
    services: [],
    cards: [],
    hookContexts: {
        'patient-view2': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        },
        'medication-prescribe': {
            userId: {
                required: true,
                title: 'User id'
            },
            patientId: {
                required: true,
                title: 'Patient id',
                resourceType: 'Patient'
            },
            medications: {
                required: true,
                title: 'Medications',
                resourceType: {
                    5: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    8: {
                        type: 'MedicationOrder',
                        crit: 'status=draft',
                        query: 'MedicationOrder?status=draft'
                    },
                    6: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    9: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    7: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    },
                    10: {
                        type: 'MedicationRequest',
                        crit: 'status=draft',
                        query: 'MedicationRequest?status=draft'
                    }
                }
            },
            encounterId: {
                required: false,
                title: 'Encounter id',
                resourceType: 'Encounter'
            }
        }
    }
}
