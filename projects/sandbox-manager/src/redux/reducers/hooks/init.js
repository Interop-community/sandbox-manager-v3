export default {
    services: [],
    cards: {cards: [], time: 0},
    hookContexts: {
        'patient-view': {
            userId: {
                required: true,
                prefetch: true,
                type: 'string',
                title: 'User id'
            },
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: false,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            }
        },
        'appointment-book': {
            userId: {
                required: true,
                prefetch: true,
                type: 'string',
                title: 'User id'
            },
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: false,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            },
            appointments: {
                required: true,
                prefetch: false,
                type: 'object',
                title: 'Orders',
                resourceType: {
                    5: [
                        {
                            type: 'Appointment',
                            crit: {
                                status: 'proposed'
                            }
                        }
                    ],
                    8: [
                        {
                            type: 'Appointment',
                            crit: {
                                status: 'proposed'
                            }
                        }
                    ],
                    6: [
                        {
                            type: 'Appointment',
                            crit: {
                                status: 'proposed'
                            }
                        }
                    ],
                    9: [
                        {
                            type: 'Appointment',
                            crit: {
                                status: 'proposed'
                            }
                        }
                    ],
                    7: [
                        {
                            type: 'Appointment',
                            crit: {
                                status: 'proposed'
                            }
                        }
                    ],
                    10: [
                        {
                            type: 'Appointment',
                            crit: {
                                status: 'proposed'
                            }
                        }
                    ]
                }
            }
        },
        'encounter-discharge': {
            userId: {
                required: true,
                prefetch: true,
                type: 'string',
                title: 'User id'
            },
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            }
        },
        'encounter-start': {
            userId: {
                required: true,
                prefetch: true,
                type: 'string',
                title: 'User id'
            },
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            }
        },
        'order-select': {
            userId: {
                required: true,
                prefetch: true,
                type: 'string',
                title: 'User id'
            },
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: false,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            },
            selection: {
                required: true,
                prefetch: false,
                type: 'array',
                title: 'Selection'
            },
            draftOrders: {
                required: true,
                prefetch: false,
                type: 'object',
                title: 'Orders',
                resourceType: {
                    5: [
                        {
                            type: 'MedicationOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DiagnosticOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DeviceUseRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    8: [
                        {
                            type: 'MedicationOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DiagnosticOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DeviceUseRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    6: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    9: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    7: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ServiceRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    10: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ServiceRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ]
                }
            }
        },
        'order-sign': {
            userId: {
                required: true,
                prefetch: true,
                type: 'string',
                title: 'User id'
            },
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: false,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            },
            draftOrders: {
                required: true,
                prefetch: false,
                type: 'object',
                title: 'Orders',
                resourceType: {
                    5: [
                        {
                            type: 'MedicationOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DiagnosticOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DeviceUseRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    8: [
                        {
                            type: 'MedicationOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DiagnosticOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'DeviceUseRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    6: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    9: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ReferralRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ProcedureRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    7: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ServiceRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ],
                    10: [
                        {
                            type: 'MedicationRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'NutritionOrder',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'ServiceRequest',
                            crit: {
                                status: 'draft'
                            }
                        },
                        {
                            type: 'VisionPrescription',
                            crit: {
                                status: 'draft'
                            }
                        }
                    ]
                }
            }
        },
        'medication-prescribe': {
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: false,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            },
            medications: {
                required: true,
                prefetch: false,
                type: 'object',
                title: 'Medications',
                resourceType: {
                    5: [
                        {
                            type: 'MedicationOrder'
                        }
                    ],
                    8: [
                        {
                            type: 'MedicationOrder'
                        }
                    ],
                    6: [
                        {
                            type: 'MedicationOrder'
                        }
                    ],
                    9: [
                        {
                            type: 'MedicationOrder'
                        }
                    ]
                }
            }
        },
        'order-review': {
            patientId: {
                required: true,
                prefetch: true,
                type: 'string',
                resourceType: 'Patient',
                title: 'Patient id'
            },
            encounterId: {
                required: false,
                prefetch: true,
                type: 'string',
                resourceType: 'Encounter',
                title: 'Encounter id'
            },
            orders: {
                required: true,
                prefetch: false,
                type: 'object',
                title: 'Orders',
                resourceType: {
                    5: [
                        {
                            type: 'MedicationOrder'
                        },
                        {
                            type: 'DiagnosticOrder'
                        },
                        {
                            type: 'DeviceUseRequest'
                        },
                        {
                            type: 'ReferralRequest'
                        },
                        {
                            type: 'ProcedureRequest'
                        },
                        {
                            type: 'NutritionOrder'
                        },
                        {
                            type: 'VisionPrescription'
                        }
                    ],
                    8: [
                        {
                            type: 'MedicationOrder'
                        },
                        {
                            type: 'DiagnosticOrder'
                        },
                        {
                            type: 'DeviceUseRequest'
                        },
                        {
                            type: 'ReferralRequest'
                        },
                        {
                            type: 'ProcedureRequest'
                        },
                        {
                            type: 'NutritionOrder'
                        },
                        {
                            type: 'VisionPrescription'
                        }
                    ],
                    6: [
                        {
                            type: 'MedicationRequest'
                        },
                        {
                            type: 'ReferralRequest'
                        },
                        {
                            type: 'ProcedureRequest'
                        },
                        {
                            type: 'NutritionOrder'
                        },
                        {
                            type: 'VisionPrescription'
                        }
                    ],
                    9: [
                        {
                            type: 'MedicationRequest'
                        },
                        {
                            type: 'ReferralRequest'
                        },
                        {
                            type: 'ProcedureRequest'
                        },
                        {
                            type: 'NutritionOrder'
                        },
                        {
                            type: 'VisionPrescription'
                        }
                    ]
                }
            }
        }
    },
    changed: []
}

