export const deliveryPersonnel = [
  // Active Delivery Drivers
  {
    id: 'DRV001',
    employeeId: 'EMP2023001',
    name: 'Mike Johnson',
    email: 'mike.johnson@deliveryco.com',
    phone: '+15551234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    dateOfBirth: '1990-05-15',
    hireDate: '2021-03-10',
    status: 'active', // active, on_delivery, off_duty, suspended, on_break
    employmentType: 'full_time', // full_time, part_time, contractor
    vehicle: {
      type: 'motorcycle',
      make: 'Honda',
      model: 'PCX 150',
      year: 2020,
      color: 'Red',
      licensePlate: 'ABC123',
      insurancePolicy: 'INS7890123',
      insuranceExpiry: '2024-12-31',
      registrationExpiry: '2024-06-30'
    },
    certifications: [
      {
        type: 'drivers_license',
        number: 'DL7890123',
        state: 'NY',
        expiry: '2025-08-15'
      },
      {
        type: 'food_handler',
        number: 'FH456789',
        expiry: '2024-09-30'
      },
      {
        type: 'defensive_driving',
        number: 'DD123456',
        expiry: '2024-11-30'
      }
    ],
    contactPerson: {
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      phone: '+15551234568'
    },
    address: {
      street: '123 Driver Lane',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201'
    },
    availability: {
      monday: ['09:00-13:00', '14:00-18:00'],
      tuesday: ['09:00-13:00', '14:00-18:00'],
      wednesday: ['09:00-13:00', '14:00-18:00'],
      thursday: ['09:00-13:00', '14:00-18:00'],
      friday: ['09:00-13:00', '14:00-18:00'],
      saturday: ['10:00-14:00'],
      sunday: 'off'
    },
    performance: {
      totalDeliveries: 1250,
      completedDeliveries: 1245,
      failedDeliveries: 5,
      averageRating: 4.8,
      onTimeRate: 96.5,
      averageDeliveryTime: 22, // minutes
      totalDistance: 12500, // km
      monthlyQuota: 250,
      currentMonthDeliveries: 48
    },
    earnings: {
      baseRate: 15.50, // per hour
      perDeliveryRate: 3.50,
      perMileRate: 0.50,
      weeklyHours: 40,
      lastWeekEarnings: 825.50,
      ytdEarnings: 32500.75,
      paymentMethod: 'direct_deposit',
      bankAccount: '****1234'
    },
    equipment: {
      phone: 'iPhone 13',
      uniformSize: 'L',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true
    },
    zones: ['Manhattan', 'Brooklyn', 'Queens'],
    specializations: ['standard', 'express', 'catering'],
    notes: 'Excellent with customer service. Good knowledge of NYC streets.',
    lastLocation: {
      lat: 40.7128,
      lng: -74.0060,
      timestamp: '2024-01-11T14:30:00Z',
      accuracy: 15 // meters
    }
  },

  {
    id: 'DRV002',
    employeeId: 'EMP2023002',
    name: 'Sarah Williams',
    email: 'sarah.williams@deliveryco.com',
    phone: '+15552345678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    dateOfBirth: '1988-08-22',
    hireDate: '2022-01-15',
    status: 'on_delivery',
    employmentType: 'full_time',
    vehicle: {
      type: 'car',
      make: 'Toyota',
      model: 'Corolla',
      year: 2019,
      color: 'Blue',
      licensePlate: 'XYZ789',
      insurancePolicy: 'INS4567890',
      insuranceExpiry: '2024-11-30',
      registrationExpiry: '2024-05-31'
    },
    certifications: [
      {
        type: 'drivers_license',
        number: 'DL4567890',
        state: 'NY',
        expiry: '2026-03-15'
      },
      {
        type: 'food_handler',
        number: 'FH789012',
        expiry: '2024-08-31'
      }
    ],
    contactPerson: {
      name: 'Robert Williams',
      relationship: 'Spouse',
      phone: '+15552345679'
    },
    address: {
      street: '456 Delivery Street',
      city: 'Queens',
      state: 'NY',
      zipCode: '11354'
    },
    availability: {
      monday: ['08:00-12:00', '13:00-17:00'],
      tuesday: ['08:00-12:00', '13:00-17:00'],
      wednesday: ['08:00-12:00', '13:00-17:00'],
      thursday: ['08:00-12:00', '13:00-17:00'],
      friday: ['08:00-12:00', '13:00-17:00'],
      saturday: 'off',
      sunday: 'off'
    },
    performance: {
      totalDeliveries: 890,
      completedDeliveries: 885,
      failedDeliveries: 5,
      averageRating: 4.9,
      onTimeRate: 98.2,
      averageDeliveryTime: 18,
      totalDistance: 8900,
      monthlyQuota: 200,
      currentMonthDeliveries: 42
    },
    earnings: {
      baseRate: 16.00,
      perDeliveryRate: 4.00,
      perMileRate: 0.55,
      weeklyHours: 40,
      lastWeekEarnings: 920.75,
      ytdEarnings: 28500.25,
      paymentMethod: 'direct_deposit',
      bankAccount: '****5678'
    },
    equipment: {
      phone: 'Samsung Galaxy S21',
      uniformSize: 'M',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true
    },
    zones: ['Manhattan', 'Bronx'],
    specializations: ['express', 'corporate'],
    notes: 'Quick and efficient. Great with corporate deliveries.',
    lastLocation: {
      lat: 40.7589,
      lng: -73.9851,
      timestamp: '2024-01-11T15:45:00Z',
      accuracy: 20
    },
    currentDelivery: {
      orderId: 128,
      estimatedCompletion: '2024-01-11T16:15:00Z'
    }
  },

  {
    id: 'DRV003',
    employeeId: 'EMP2023003',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@deliveryco.com',
    phone: '+15553456789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    dateOfBirth: '1995-03-30',
    hireDate: '2022-06-20',
    status: 'active',
    employmentType: 'part_time',
    vehicle: {
      type: 'bicycle',
      make: 'Specialized',
      model: 'Sirrus X 3.0',
      year: 2022,
      color: 'Black/Red',
      licensePlate: null,
      insurancePolicy: 'BIKE789012',
      insuranceExpiry: '2024-12-31'
    },
    certifications: [
      {
        type: 'food_handler',
        number: 'FH123789',
        expiry: '2024-10-31'
      },
      {
        type: 'bicycle_safety',
        number: 'BS456123',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'Maria Rodriguez',
      relationship: 'Mother',
      phone: '+15553456780'
    },
    address: {
      street: '789 Bike Lane',
      city: 'Manhattan',
      state: 'NY',
      zipCode: '10001'
    },
    availability: {
      monday: ['11:00-15:00'],
      tuesday: ['11:00-15:00'],
      wednesday: ['11:00-15:00'],
      thursday: ['11:00-15:00'],
      friday: ['11:00-15:00'],
      saturday: ['12:00-16:00'],
      sunday: 'off'
    },
    performance: {
      totalDeliveries: 520,
      completedDeliveries: 518,
      failedDeliveries: 2,
      averageRating: 4.7,
      onTimeRate: 95.8,
      averageDeliveryTime: 15, // Faster in downtown
      totalDistance: 2600, // Less on bicycle
      monthlyQuota: 100,
      currentMonthDeliveries: 25
    },
    earnings: {
      baseRate: 14.50,
      perDeliveryRate: 3.00,
      perMileRate: 0.30,
      weeklyHours: 25,
      lastWeekEarnings: 425.25,
      ytdEarnings: 12500.50,
      paymentMethod: 'cash',
      cashPickupLocation: 'Main Office'
    },
    equipment: {
      phone: 'Google Pixel 6',
      uniformSize: 'S',
      hotBag: true,
      gpsTracker: true,
      helmet: true,
      reflectiveVest: true
    },
    zones: ['Manhattan Downtown', 'Midtown'],
    specializations: ['standard', 'bike_delivery'],
    notes: 'Excellent for downtown deliveries. Environmentally conscious.',
    lastLocation: {
      lat: 40.7489,
      lng: -73.9680,
      timestamp: '2024-01-11T14:15:00Z',
      accuracy: 10
    }
  },

  {
    id: 'DRV004',
    employeeId: 'EMP2023004',
    name: 'Lisa Chen',
    email: 'lisa.chen@deliveryco.com',
    phone: '+15554567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    dateOfBirth: '1992-11-18',
    hireDate: '2021-11-05',
    status: 'on_break',
    employmentType: 'full_time',
    vehicle: {
      type: 'scooter',
      make: 'Vespa',
      model: 'Primavera 150',
      year: 2021,
      color: 'Yellow',
      licensePlate: 'LMN456',
      insurancePolicy: 'INS1234567',
      insuranceExpiry: '2024-10-31',
      registrationExpiry: '2024-04-30'
    },
    certifications: [
      {
        type: 'drivers_license',
        number: 'DL1234567',
        state: 'NY',
        expiry: '2025-12-31'
      },
      {
        type: 'food_handler',
        number: 'FH456123',
        expiry: '2024-07-31'
      },
      {
        type: 'first_aid',
        number: 'FA789012',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'David Chen',
      relationship: 'Spouse',
      phone: '+15554567891'
    },
    address: {
      street: '321 Scooter Street',
      city: 'Long Island City',
      state: 'NY',
      zipCode: '11101'
    },
    availability: {
      monday: ['10:00-14:00', '15:00-19:00'],
      tuesday: ['10:00-14:00', '15:00-19:00'],
      wednesday: ['10:00-14:00', '15:00-19:00'],
      thursday: ['10:00-14:00', '15:00-19:00'],
      friday: ['10:00-14:00', '15:00-19:00'],
      saturday: ['11:00-15:00'],
      sunday: ['12:00-16:00']
    },
    performance: {
      totalDeliveries: 1100,
      completedDeliveries: 1095,
      failedDeliveries: 5,
      averageRating: 4.85,
      onTimeRate: 97.3,
      averageDeliveryTime: 20,
      totalDistance: 11000,
      monthlyQuota: 220,
      currentMonthDeliveries: 55
    },
    earnings: {
      baseRate: 15.75,
      perDeliveryRate: 3.75,
      perMileRate: 0.45,
      weeklyHours: 40,
      lastWeekEarnings: 895.50,
      ytdEarnings: 34500.00,
      paymentMethod: 'direct_deposit',
      bankAccount: '****9012'
    },
    equipment: {
      phone: 'iPhone 14',
      uniformSize: 'M',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true,
      rainGear: true
    },
    zones: ['Brooklyn', 'Queens', 'Manhattan'],
    specializations: ['standard', 'express', 'late_night'],
    notes: 'Works weekends. Reliable in bad weather.',
    lastLocation: {
      lat: 40.7505,
      lng: -73.9934,
      timestamp: '2024-01-11T15:30:00Z',
      accuracy: 12
    },
    breakEndsAt: '2024-01-11T16:00:00Z'
  },

  {
    id: 'DRV005',
    employeeId: 'EMP2023005',
    name: 'James Wilson',
    email: 'james.wilson@deliveryco.com',
    phone: '+15555678901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    dateOfBirth: '1985-02-28',
    hireDate: '2020-08-12',
    status: 'active',
    employmentType: 'full_time',
    vehicle: {
      type: 'van',
      make: 'Ford',
      model: 'Transit',
      year: 2020,
      color: 'White',
      licensePlate: 'VAN123',
      insurancePolicy: 'INS7894561',
      insuranceExpiry: '2024-09-30',
      registrationExpiry: '2024-03-31',
      capacity: 'Large'
    },
    certifications: [
      {
        type: 'commercial_drivers_license',
        number: 'CDL123456',
        state: 'NY',
        expiry: '2025-06-30'
      },
      {
        type: 'food_handler',
        number: 'FH987654',
        expiry: '2024-08-31'
      },
      {
        type: 'catering_specialist',
        number: 'CS456123',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'Emily Wilson',
      relationship: 'Spouse',
      phone: '+15555678902'
    },
    address: {
      street: '555 Van Street',
      city: 'Staten Island',
      state: 'NY',
      zipCode: '10301'
    },
    availability: {
      monday: ['07:00-15:00'],
      tuesday: ['07:00-15:00'],
      wednesday: ['07:00-15:00'],
      thursday: ['07:00-15:00'],
      friday: ['07:00-15:00'],
      saturday: 'off',
      sunday: 'off'
    },
    performance: {
      totalDeliveries: 850,
      completedDeliveries: 845,
      failedDeliveries: 5,
      averageRating: 4.9,
      onTimeRate: 99.1,
      averageDeliveryTime: 35,
      totalDistance: 25500,
      monthlyQuota: 150,
      currentMonthDeliveries: 32
    },
    earnings: {
      baseRate: 18.50,
      perDeliveryRate: 5.00,
      perMileRate: 0.65,
      weeklyHours: 40,
      lastWeekEarnings: 1050.75,
      ytdEarnings: 42500.50,
      paymentMethod: 'direct_deposit',
      bankAccount: '****3456'
    },
    equipment: {
      phone: 'Samsung Galaxy S22',
      uniformSize: 'XL',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true,
      dolly: true,
      movingBlankets: true
    },
    zones: ['All NYC Boroughs', 'Westchester'],
    specializations: ['catering', 'corporate', 'large_items'],
    notes: 'Handles large catering orders. Has CDL license.',
    lastLocation: {
      lat: 40.6892,
      lng: -74.0445,
      timestamp: '2024-01-11T14:45:00Z',
      accuracy: 25
    }
  },

  // West Coast Drivers
  {
    id: 'DRV006',
    employeeId: 'EMP2023006',
    name: 'Miguel Sanchez',
    email: 'miguel.sanchez@deliveryco.com',
    phone: '+15556789012',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    dateOfBirth: '1993-07-12',
    hireDate: '2022-09-18',
    status: 'active',
    employmentType: 'full_time',
    vehicle: {
      type: 'motorcycle',
      make: 'Yamaha',
      model: 'NMAX 155',
      year: 2021,
      color: 'Blue',
      licensePlate: 'LA789',
      insurancePolicy: 'INS3216549',
      insuranceExpiry: '2024-11-30',
      registrationExpiry: '2024-05-31'
    },
    certifications: [
      {
        type: 'drivers_license',
        number: 'DL9876543',
        state: 'CA',
        expiry: '2025-09-30'
      },
      {
        type: 'food_handler',
        number: 'FH321987',
        expiry: '2024-08-31'
      }
    ],
    contactPerson: {
      name: 'Isabella Sanchez',
      relationship: 'Spouse',
      phone: '+15556789013'
    },
    address: {
      street: '234 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90028'
    },
    availability: {
      monday: ['08:00-16:00'],
      tuesday: ['08:00-16:00'],
      wednesday: ['08:00-16:00'],
      thursday: ['08:00-16:00'],
      friday: ['08:00-16:00'],
      saturday: ['09:00-13:00'],
      sunday: 'off'
    },
    performance: {
      totalDeliveries: 680,
      completedDeliveries: 675,
      failedDeliveries: 5,
      averageRating: 4.7,
      onTimeRate: 95.5,
      averageDeliveryTime: 25,
      totalDistance: 8500,
      monthlyQuota: 150,
      currentMonthDeliveries: 38
    },
    earnings: {
      baseRate: 16.50,
      perDeliveryRate: 3.75,
      perMileRate: 0.52,
      weeklyHours: 40,
      lastWeekEarnings: 875.25,
      ytdEarnings: 28500.75,
      paymentMethod: 'direct_deposit',
      bankAccount: '****7890'
    },
    equipment: {
      phone: 'iPhone 13',
      uniformSize: 'M',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true
    },
    zones: ['Hollywood', 'Beverly Hills', 'Downtown LA'],
    specializations: ['standard', 'express'],
    notes: 'Bilingual (Spanish/English). Good with celebrity deliveries.',
    lastLocation: {
      lat: 34.0522,
      lng: -118.2437,
      timestamp: '2024-01-11T16:00:00Z',
      accuracy: 18
    }
  },

  {
    id: 'DRV007',
    employeeId: 'EMP2023007',
    name: 'Tyler Reed',
    email: 'tyler.reed@deliveryco.com',
    phone: '+15557890123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tyler',
    dateOfBirth: '1996-01-25',
    hireDate: '2023-02-14',
    status: 'on_delivery',
    employmentType: 'part_time',
    vehicle: {
      type: 'electric_bike',
      make: 'Rad Power Bikes',
      model: 'RadRunner',
      year: 2022,
      color: 'Green',
      licensePlate: null,
      insurancePolicy: 'EBIKE456',
      insuranceExpiry: '2024-12-31',
      batteryCapacity: '672Wh'
    },
    certifications: [
      {
        type: 'food_handler',
        number: 'FH654987',
        expiry: '2024-10-31'
      },
      {
        type: 'electric_vehicle_safety',
        number: 'EVS789012',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'Jennifer Reed',
      relationship: 'Mother',
      phone: '+15557890124'
    },
    address: {
      street: '567 Eco Street',
      city: 'Santa Monica',
      state: 'CA',
      zipCode: '90401'
    },
    availability: {
      monday: ['12:00-16:00'],
      tuesday: ['12:00-16:00'],
      wednesday: ['12:00-16:00'],
      thursday: ['12:00-16:00'],
      friday: ['12:00-16:00'],
      saturday: ['13:00-17:00'],
      sunday: 'off'
    },
    performance: {
      totalDeliveries: 320,
      completedDeliveries: 318,
      failedDeliveries: 2,
      averageRating: 4.8,
      onTimeRate: 96.8,
      averageDeliveryTime: 18,
      totalDistance: 1600,
      monthlyQuota: 80,
      currentMonthDeliveries: 22
    },
    earnings: {
      baseRate: 15.00,
      perDeliveryRate: 3.25,
      perMileRate: 0.35,
      weeklyHours: 20,
      lastWeekEarnings: 385.50,
      ytdEarnings: 11500.25,
      paymentMethod: 'cash',
      cashPickupLocation: 'LA Office'
    },
    equipment: {
      phone: 'Google Pixel 7',
      uniformSize: 'L',
      hotBag: true,
      gpsTracker: true,
      helmet: true,
      reflectiveVest: true
    },
    zones: ['Santa Monica', 'Venice Beach', 'West LA'],
    specializations: ['eco_delivery', 'bike_delivery', 'standard'],
    notes: 'Environmental science student. Very eco-conscious.',
    lastLocation: {
      lat: 34.0195,
      lng: -118.4912,
      timestamp: '2024-01-11T15:30:00Z',
      accuracy: 15
    },
    currentDelivery: {
      orderId: 113,
      estimatedCompletion: '2024-01-11T16:10:00Z'
    }
  },

  // Specialty Drivers
  {
    id: 'DRV008',
    employeeId: 'EMP2023008',
    name: 'Bob Thompson',
    email: 'bob.thompson@deliveryco.com',
    phone: '+15558901234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    dateOfBirth: '1978-12-05',
    hireDate: '2019-05-22',
    status: 'active',
    employmentType: 'full_time',
    vehicle: {
      type: 'truck',
      make: 'Chevrolet',
      model: 'Silverado 2500',
      year: 2018,
      color: 'Black',
      licensePlate: 'TRK456',
      insurancePolicy: 'INS8529637',
      insuranceExpiry: '2024-08-31',
      registrationExpiry: '2024-02-28',
      capacity: 'Extra Large'
    },
    certifications: [
      {
        type: 'commercial_drivers_license',
        number: 'CDL789123',
        state: 'IL',
        expiry: '2025-04-30'
      },
      {
        type: 'food_handler',
        number: 'FH741852',
        expiry: '2024-07-31'
      },
      {
        type: 'hazardous_materials',
        number: 'HAZ456789',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'Linda Thompson',
      relationship: 'Spouse',
      phone: '+15558901235'
    },
    address: {
      street: '789 Truck Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601'
    },
    availability: {
      monday: ['04:00-12:00'],
      tuesday: ['04:00-12:00'],
      wednesday: ['04:00-12:00'],
      thursday: ['04:00-12:00'],
      friday: ['04:00-12:00'],
      saturday: 'off',
      sunday: 'off'
    },
    performance: {
      totalDeliveries: 1200,
      completedDeliveries: 1195,
      failedDeliveries: 5,
      averageRating: 4.9,
      onTimeRate: 99.5,
      averageDeliveryTime: 40,
      totalDistance: 48000,
      monthlyQuota: 200,
      currentMonthDeliveries: 45
    },
    earnings: {
      baseRate: 20.00,
      perDeliveryRate: 6.00,
      perMileRate: 0.75,
      weeklyHours: 40,
      lastWeekEarnings: 1250.00,
      ytdEarnings: 48500.00,
      paymentMethod: 'direct_deposit',
      bankAccount: '****2345'
    },
    equipment: {
      phone: 'iPhone 12',
      uniformSize: 'XXL',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true,
      forkliftCertified: true
    },
    zones: ['Chicago Metro', 'Suburbs'],
    specializations: ['construction', 'industrial', 'bulk', 'early_morning'],
    notes: 'Early bird specialist. Handles construction site deliveries.',
    lastLocation: {
      lat: 41.8781,
      lng: -87.6298,
      timestamp: '2024-01-11T11:30:00Z',
      accuracy: 30
    }
  },

  {
    id: 'DRV009',
    employeeId: 'EMP2023009',
    name: 'Maria Gonzalez',
    email: 'maria.gonzalez@deliveryco.com',
    phone: '+15559012345',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    dateOfBirth: '1989-06-30',
    hireDate: '2021-08-10',
    status: 'off_duty',
    employmentType: 'full_time',
    vehicle: {
      type: 'car',
      make: 'Honda',
      model: 'CR-V',
      year: 2020,
      color: 'Silver',
      licensePlate: 'HOU123',
      insurancePolicy: 'INS1597532',
      insuranceExpiry: '2024-10-31',
      registrationExpiry: '2024-04-30'
    },
    certifications: [
      {
        type: 'drivers_license',
        number: 'DL4561238',
        state: 'TX',
        expiry: '2025-11-30'
      },
      {
        type: 'food_handler',
        number: 'FH369258',
        expiry: '2024-09-30'
      },
      {
        type: 'healthcare_delivery',
        number: 'HCD789012',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'Juan Gonzalez',
      relationship: 'Spouse',
      phone: '+15559012346'
    },
    address: {
      street: '456 Medical Drive',
      city: 'Houston',
      state: 'TX',
      zipCode: '77002'
    },
    availability: {
      monday: ['06:00-14:00'],
      tuesday: ['06:00-14:00'],
      wednesday: ['06:00-14:00'],
      thursday: ['06:00-14:00'],
      friday: ['06:00-14:00'],
      saturday: ['07:00-11:00'],
      sunday: ['07:00-11:00']
    },
    performance: {
      totalDeliveries: 950,
      completedDeliveries: 945,
      failedDeliveries: 5,
      averageRating: 4.9,
      onTimeRate: 98.8,
      averageDeliveryTime: 22,
      totalDistance: 19000,
      monthlyQuota: 180,
      currentMonthDeliveries: 40
    },
    earnings: {
      baseRate: 16.75,
      perDeliveryRate: 4.25,
      perMileRate: 0.58,
      weeklyHours: 40,
      lastWeekEarnings: 950.50,
      ytdEarnings: 36500.75,
      paymentMethod: 'direct_deposit',
      bankAccount: '****6789'
    },
    equipment: {
      phone: 'Samsung Galaxy S20',
      uniformSize: 'M',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true,
      sanitizerStation: true
    },
    zones: ['Houston Medical District', 'Downtown Houston'],
    specializations: ['hospital', 'healthcare', '24/7'],
    notes: 'Specializes in hospital deliveries. Works odd hours.',
    lastLocation: {
      lat: 29.7604,
      lng: -95.3698,
      timestamp: '2024-01-11T14:00:00Z',
      accuracy: 22
    }
  },

  // Premium Service Driver
  {
    id: 'DRV010',
    employeeId: 'EMP2023010',
    name: 'Chef Pierre Dubois',
    email: 'pierre.dubois@deliveryco.com',
    phone: '+15550123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre',
    dateOfBirth: '1975-04-18',
    hireDate: '2023-01-10',
    status: 'active',
    employmentType: 'contractor',
    vehicle: {
      type: 'luxury_van',
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2022,
      color: 'Black',
      licensePlate: 'LUX789',
      insurancePolicy: 'INS7531598',
      insuranceExpiry: '2024-12-31',
      registrationExpiry: '2024-06-30',
      features: ['Refrigeration', 'Heating', 'Presentation']
    },
    certifications: [
      {
        type: 'commercial_drivers_license',
        number: 'CDL456789',
        state: 'NY',
        expiry: '2025-12-31'
      },
      {
        type: 'culinary_degree',
        number: 'CD123456',
        institution: 'Le Cordon Bleu',
        year: 2000
      },
      {
        type: 'food_safety_manager',
        number: 'FSM789012',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'Sophie Dubois',
      relationship: 'Assistant',
      phone: '+15550123457'
    },
    address: {
      street: '789 Culinary Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10022'
    },
    availability: {
      monday: ['By Appointment'],
      tuesday: ['By Appointment'],
      wednesday: ['By Appointment'],
      thursday: ['By Appointment'],
      friday: ['By Appointment'],
      saturday: ['By Appointment'],
      sunday: ['By Appointment']
    },
    performance: {
      totalDeliveries: 85,
      completedDeliveries: 85,
      failedDeliveries: 0,
      averageRating: 5.0,
      onTimeRate: 100,
      averageDeliveryTime: 45,
      totalDistance: 4250,
      monthlyQuota: 10,
      currentMonthDeliveries: 3
    },
    earnings: {
      baseRate: 50.00,
      perDeliveryRate: 100.00,
      perMileRate: 2.50,
      weeklyHours: 20,
      lastWeekEarnings: 1250.00,
      ytdEarnings: 42500.00,
      paymentMethod: 'wire_transfer',
      bankAccount: '****0001'
    },
    equipment: {
      phone: 'iPhone 14 Pro',
      uniform: 'Chef Whites',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true,
      presentationTools: true,
      temperatureControl: true
    },
    zones: ['Global'],
    specializations: ['luxury', 'celebrity', 'royal', 'catering'],
    notes: 'Former executive chef. Handles only premium deliveries.',
    lastLocation: {
      lat: 40.7614,
      lng: -73.9776,
      timestamp: '2024-01-11T16:30:00Z',
      accuracy: 5
    }
  },

  // New Driver (Trainee)
  {
    id: 'DRV011',
    employeeId: 'EMP2024011',
    name: 'Tom Wilson',
    email: 'tom.wilson@deliveryco.com',
    phone: '+15551122334',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    dateOfBirth: '1999-09-15',
    hireDate: '2024-01-02',
    status: 'active',
    employmentType: 'trainee',
    vehicle: {
      type: 'motorcycle',
      make: 'Kymco',
      model: 'Like 150i',
      year: 2023,
      color: 'White',
      licensePlate: 'TRA001',
      insurancePolicy: 'INS4561237',
      insuranceExpiry: '2024-12-31',
      registrationExpiry: '2024-12-31'
    },
    certifications: [
      {
        type: 'drivers_license',
        number: 'DL7894561',
        state: 'MA',
        expiry: '2026-01-31'
      },
      {
        type: 'food_handler',
        number: 'FH123654',
        expiry: '2024-12-31'
      }
    ],
    contactPerson: {
      name: 'Nancy Wilson',
      relationship: 'Mother',
      phone: '+15551122335'
    },
    address: {
      street: '123 Trainee Street',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115'
    },
    availability: {
      monday: ['16:00-20:00'],
      tuesday: ['16:00-20:00'],
      wednesday: ['16:00-20:00'],
      thursday: ['16:00-20:00'],
      friday: ['16:00-20:00'],
      saturday: ['17:00-21:00'],
      sunday: ['17:00-21:00']
    },
    performance: {
      totalDeliveries: 45,
      completedDeliveries: 43,
      failedDeliveries: 2,
      averageRating: 4.5,
      onTimeRate: 91.5,
      averageDeliveryTime: 28,
      totalDistance: 450,
      monthlyQuota: 50,
      currentMonthDeliveries: 15
    },
    earnings: {
      baseRate: 12.50,
      perDeliveryRate: 2.50,
      perMileRate: 0.40,
      weeklyHours: 25,
      lastWeekEarnings: 325.75,
      ytdEarnings: 650.25,
      paymentMethod: 'direct_deposit',
      bankAccount: '****1111'
    },
    equipment: {
      phone: 'Samsung Galaxy A53',
      uniformSize: 'M',
      hotBag: true,
      gpsTracker: true,
      communicationDevice: true
    },
    zones: ['Boston University Area', 'Back Bay'],
    specializations: ['standard', 'late_night'],
    notes: 'College student. Trainee for 3 months.',
    supervisor: 'DRV001',
    trainingCompletion: '2024-04-02',
    lastLocation: {
      lat: 42.3601,
      lng: -71.0589,
      timestamp: '2024-01-11T19:30:00Z',
      accuracy: 20
    }
  }
];

// Delivery Personnel Statistics
export const deliveryStats = {
  totalDrivers: 11,
  activeDrivers: 8,
  onDelivery: 2,
  offDuty: 1,
  onBreak: 1,
  suspended: 0,
  byEmploymentType: {
    full_time: 6,
    part_time: 2,
    contractor: 1,
    trainee: 1,
    seasonal: 0
  },
  byVehicleType: {
    motorcycle: 3,
    car: 2,
    bicycle: 1,
    scooter: 1,
    van: 1,
    truck: 1,
    electric_bike: 1,
    luxury_van: 1
  },
  averageRating: 4.8,
  totalDeliveries: 7895,
  completedDeliveries: 7845,
  successRate: 99.4,
  totalDistance: 183700, // km
  totalEarningsYTD: 341653.00
};

// Vehicle Types
export const vehicleTypes = [
  'motorcycle',
  'scooter',
  'bicycle',
  'electric_bike',
  'car',
  'van',
  'truck',
  'luxury_van',
  'other'
];

// Driver Statuses
export const driverStatuses = [
  'active',
  'on_delivery',
  'on_break',
  'off_duty',
  'suspended',
  'on_leave',
  'training'
];

// Specializations
export const deliverySpecializations = [
  'standard',
  'express',
  'catering',
  'corporate',
  'hospital',
  'construction',
  'industrial',
  'bulk',
  'large_items',
  'eco_delivery',
  'bike_delivery',
  'late_night',
  'early_morning',
  'luxury',
  'celebrity',
  'royal',
  '24/7'
];

// Certifications
export const driverCertifications = [
  'drivers_license',
  'commercial_drivers_license',
  'food_handler',
  'food_safety_manager',
  'defensive_driving',
  'first_aid',
  'cpr',
  'hazardous_materials',
  'bicycle_safety',
  'electric_vehicle_safety',
  'catering_specialist',
  'healthcare_delivery',
  'culinary_degree'
];

// Performance Metrics
export const performanceMetrics = [
  'totalDeliveries',
  'completedDeliveries',
  'failedDeliveries',
  'averageRating',
  'onTimeRate',
  'averageDeliveryTime',
  'totalDistance',
  'customerComplaints',
  'accidents'
];