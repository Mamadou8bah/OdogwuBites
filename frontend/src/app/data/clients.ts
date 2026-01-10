export const clients = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    registrationDate: '2023-01-15T10:30:00Z',
    lastActive: '2024-01-10T14:45:00Z',
    status: 'active', // active, inactive, suspended
    customerTier: 'premium', // basic, premium, enterprise
    lifetimeValue: 2500.50,
    notes: 'Prefers email communication. VIP customer.',
    tags: ['foodie', 'early-adopter', 'tech-savvy'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: true,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_1',
        type: 'credit_card',
        lastFour: '4242',
        expiryDate: '12/25',
        isDefault: true
      },
      {
        id: 'pm_2',
        type: 'paypal',
        email: 'john.paypal@example.com',
        isDefault: false
      }
    ],
    orders: [
      {
        orderId: 101,
        item: 'Burger',
        itemId: 'burger_001',
        quantity: 2,
        price: 10,
        tax: 0.80,
        discount: 1.00,
        total: 19.80,
        orderDate: '2024-01-05T12:30:00Z',
        status: 'delivered', // pending, processing, shipped, delivered, cancelled
        deliveryAddress: '123 Main Street, New York, NY 10001',
        specialInstructions: 'Extra pickles, no onions'
      },
      {
        orderId: 102,
        item: 'Pizza',
        itemId: 'pizza_003',
        quantity: 1,
        price: 15,
        tax: 1.20,
        discount: 0,
        total: 16.20,
        orderDate: '2024-01-08T18:45:00Z',
        status: 'delivered',
        deliveryAddress: 'Office: 456 Business Ave, New York, NY 10002'
      }
    ],
    totalPayments: 35.00,
    outstandingBalance: 0.00,
    averageOrderValue: 17.50,
    orderFrequency: 'weekly',
    nextDeliverySchedule: '2024-01-17T19:00:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    address: {
      street: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    registrationDate: '2023-03-22T09:15:00Z',
    lastActive: '2024-01-09T20:15:00Z',
    status: 'active',
    customerTier: 'basic',
    lifetimeValue: 450.75,
    notes: 'Vegetarian customer. Always requests eco-friendly packaging.',
    tags: ['vegetarian', 'eco-conscious', 'frequent-buyer'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: true,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_3',
        type: 'credit_card',
        lastFour: '1881',
        expiryDate: '08/26',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 103,
        item: 'Vegan Fries',
        itemId: 'fries_002',
        quantity: 3,
        price: 9,
        tax: 2.16,
        discount: 2.00,
        total: 27.16,
        orderDate: '2024-01-07T19:30:00Z',
        status: 'delivered',
        deliveryAddress: '456 Oak Avenue, Los Angeles, CA 90001',
        specialInstructions: 'Use paper packaging only'
      },
      {
        orderId: 104,
        item: 'Caesar Salad',
        itemId: 'salad_005',
        quantity: 1,
        price: 7,
        tax: 0.56,
        discount: 0,
        total: 7.56,
        orderDate: '2024-01-09T13:15:00Z',
        status: 'delivered',
        specialInstructions: 'No croutons, extra dressing'
      },
      {
        orderId: 105,
        item: 'Vegan Burger',
        itemId: 'burger_007',
        quantity: 2,
        price: 12,
        tax: 1.92,
        discount: 1.50,
        total: 24.42,
        orderDate: '2024-01-10T20:00:00Z',
        status: 'processing'
      }
    ],
    totalPayments: 16.00,
    outstandingBalance: 24.42,
    averageOrderValue: 19.38,
    orderFrequency: 'bi-weekly'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.j@techcorp.com',
    phone: '+1122334455',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    company: 'TechCorp Inc.',
    jobTitle: 'Purchasing Manager',
    address: {
      street: '789 Corporate Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'USA'
    },
    registrationDate: '2022-11-10T14:20:00Z',
    lastActive: '2024-01-11T11:30:00Z',
    status: 'active',
    customerTier: 'enterprise',
    lifetimeValue: 12500.00,
    notes: 'Corporate account. Bulk orders for office events.',
    tags: ['corporate', 'bulk-order', 'recurring'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: false,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_4',
        type: 'invoice',
        terms: 'Net 30',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 106,
        item: 'Pizza Party Pack',
        itemId: 'pizza_015',
        quantity: 10,
        price: 120,
        tax: 9.60,
        discount: 100.00,
        total: 1129.60,
        orderDate: '2024-01-02T10:00:00Z',
        status: 'delivered',
        deliveryAddress: 'TechCorp Inc., 789 Corporate Blvd, San Francisco, CA 94107',
        specialInstructions: 'Deliver to reception. Contact Jane at ext. 345'
      },
      {
        orderId: 107,
        item: 'Sandwich Platter',
        itemId: 'sandwich_008',
        quantity: 5,
        price: 45,
        tax: 3.60,
        discount: 50.00,
        total: 178.60,
        orderDate: '2024-01-09T09:30:00Z',
        status: 'shipped',
        deliveryAddress: 'TechCorp Inc. - 3rd Floor Breakroom'
      }
    ],
    totalPayments: 1129.60,
    outstandingBalance: 178.60,
    averageOrderValue: 654.10,
    orderFrequency: 'monthly',
    creditLimit: 5000.00,
    accountManager: 'Sarah Wilson'
  },
  {
    id: 4,
    name: 'Maria Garcia',
    email: 'm.garcia@email.com',
    phone: '+5566778899',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    address: {
      street: '321 Maple Street',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    registrationDate: '2023-05-30T16:45:00Z',
    lastActive: '2024-01-08T21:20:00Z',
    status: 'inactive',
    customerTier: 'basic',
    lifetimeValue: 85.25,
    notes: 'Last order 3 months ago. Follow up required.',
    tags: ['seasonal', 'new-customer'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: false,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_5',
        type: 'credit_card',
        lastFour: '5678',
        expiryDate: '05/24',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 108,
        item: 'Tacos',
        itemId: 'tacos_012',
        quantity: 2,
        price: 8,
        tax: 0.64,
        discount: 0,
        total: 16.64,
        orderDate: '2023-10-15T19:45:00Z',
        status: 'delivered'
      },
      {
        orderId: 109,
        item: 'Quesadilla',
        itemId: 'quesadilla_006',
        quantity: 1,
        price: 6,
        tax: 0.48,
        discount: 0,
        total: 6.48,
        orderDate: '2023-10-10T12:30:00Z',
        status: 'delivered'
      }
    ],
    totalPayments: 23.12,
    outstandingBalance: 0.00,
    averageOrderValue: 11.56,
    orderFrequency: 'one-time',
    inactivityPeriod: '90 days'
  },
  {
    id: 5,
    name: 'David Chen',
    email: 'david.chen@startup.io',
    phone: '+9988776655',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    company: 'Startup Innovations',
    jobTitle: 'CEO',
    address: {
      street: '654 Startup Alley',
      city: 'Lamin Kerewan',
      state: 'TX',
      zipCode: '73301',
      country: 'USA'
    },
    registrationDate: '2024-01-02T08:00:00Z',
    lastActive: '2024-01-11T22:10:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 320.40,
    notes: 'New premium customer. Very tech-oriented.',
    tags: ['startup', 'high-potential', 'tech-enthusiast'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: true,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_6',
        type: 'crypto',
        currency: 'BTC',
        isDefault: true
      },
      {
        id: 'pm_7',
        type: 'apple_pay',
        isDefault: false
      }
    ],
    orders: [
      {
        orderId: 110,
        item: 'Avocado Toast',
        itemId: 'toast_009',
        quantity: 1,
        price: 9,
        tax: 0.72,
        discount: 0,
        total: 9.72,
        orderDate: '2024-01-05T08:15:00Z',
        status: 'delivered',
        specialInstructions: 'Extra avocado, gluten-free bread'
      },
      {
        orderId: 111,
        item: 'Cold Brew',
        itemId: 'coffee_004',
        quantity: 1,
        price: 5,
        tax: 0.40,
        discount: 0,
        total: 5.40,
        orderDate: '2024-01-06T09:30:00Z',
        status: 'delivered'
      },
      {
        orderId: 112,
        item: 'Breakfast Bundle',
        itemId: 'bundle_001',
        quantity: 2,
        price: 25,
        tax: 2.00,
        discount: 5.00,
        total: 47.00,
        orderDate: '2024-01-11T08:00:00Z',
        status: 'pending'
      }
    ],
    totalPayments: 15.12,
    outstandingBalance: 47.00,
    averageOrderValue: 20.71,
    orderFrequency: 'daily',
    referralCode: 'DAVID25',
    referredBy: null
  },
  {
    id: 6,
    name: 'Alexandra "Alex" Rodriguez',
    email: 'alex.rodriguez@email.com',
    phone: '+1345678901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra',
    address: {
      street: '987 Sunset Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    registrationDate: '2023-02-14T11:20:00Z',
    lastActive: '2024-01-11T19:30:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 1800.75,
    notes: 'Social media influencer with 500K followers. Often shares orders.',
    tags: ['influencer', 'premium', 'social-media', 'photogenic-orders'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: true,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_8',
        type: 'credit_card',
        lastFour: '8888',
        expiryDate: '11/27',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 113,
        item: 'Rainbow Smoothie Bowl',
        itemId: 'bowl_010',
        quantity: 1,
        price: 14,
        tax: 1.12,
        discount: 0,
        total: 15.12,
        orderDate: '2024-01-11T10:15:00Z',
        status: 'delivered',
        specialInstructions: 'EXTRA colorful for photos!',
        instagramHandle: '@HealthyAlex'
      }
    ],
    totalPayments: 1800.75,
    outstandingBalance: 0,
    averageOrderValue: 45.02,
    orderFrequency: 'weekly',
    socialMedia: {
      instagram: '@HealthyAlex',
      tiktok: '@AlexEats'
    }
  },
  {
    id: 7,
    name: 'James Wilson',
    email: 'james.wilson@construction.com',
    phone: '+1555123456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    company: 'Wilson Construction Co.',
    jobTitle: 'Site Manager',
    address: {
      street: '555 Industrial Way',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    registrationDate: '2022-08-30T07:45:00Z',
    lastActive: '2024-01-11T11:00:00Z',
    status: 'active',
    customerTier: 'enterprise',
    lifetimeValue: 8500.25,
    notes: 'Daily orders for construction crew. Always needs quick delivery.',
    tags: ['construction', 'bulk', 'early-morning', 'loyal'],
    communicationPreferences: {
      email: false,
      sms: true,
      pushNotifications: false,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_9',
        type: 'invoice',
        terms: 'Net 15',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 114,
        item: 'Coffee (20 cups)',
        itemId: 'coffee_bulk',
        quantity: 1,
        price: 40,
        tax: 3.20,
        discount: 5.00,
        total: 38.20,
        orderDate: '2024-01-11T05:30:00Z',
        status: 'delivered',
        deliveryAddress: 'Construction Site: 123 Build St, Chicago, IL',
        specialInstructions: 'Deliver to trailer by 6:30 AM sharp'
      }
    ],
    totalPayments: 8500.25,
    outstandingBalance: 0,
    averageOrderValue: 65.38,
    orderFrequency: 'daily',
    deliveryInstructions: 'Gate code: 4455. Ask for Jim.'
  },
  {
    id: 8,
    name: 'Sophie Nguyen',
    email: 'sophie.n@university.edu',
    phone: '+1666777888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    address: {
      street: 'University Dorm 4B',
      city: 'Boston',
      state: 'MA',
      zipCode: '02115',
      country: 'USA'
    },
    registrationDate: '2023-09-05T16:30:00Z',
    lastActive: '2024-01-10T22:45:00Z',
    status: 'active',
    customerTier: 'basic',
    lifetimeValue: 320.50,
    notes: 'College student. Orders mostly during exam periods.',
    tags: ['student', 'college', 'late-night', 'budget'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: true,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_10',
        type: 'paypal',
        email: 'sophie.student@paypal.com',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 115,
        item: 'Study Snack Pack',
        itemId: 'snack_pack',
        quantity: 1,
        price: 12,
        tax: 0.96,
        discount: 2.00,
        total: 10.96,
        orderDate: '2024-01-10T23:30:00Z',
        status: 'delivered',
        deliveryAddress: 'Dorm 4B, Room 312',
        specialInstructions: 'Leave at dorm entrance, text when arrived'
      }
    ],
    totalPayments: 320.50,
    outstandingBalance: 0,
    averageOrderValue: 16.02,
    orderFrequency: 'weekly',
    studentId: 'STU789012',
    mealPlanBalance: 45.50
  },
  {
    id: 9,
    name: 'Michael Thompson',
    email: 'm.thompson@retired.com',
    phone: '+1777888999',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    address: {
      street: '222 Peaceful Lane',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    registrationDate: '2022-12-01T09:00:00Z',
    lastActive: '2024-01-09T12:15:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 2100.00,
    notes: 'Retired. Prefers traditional meals. Always polite.',
    tags: ['senior', 'retired', 'loyal', 'traditional'],
    communicationPreferences: {
      email: false,
      sms: false,
      pushNotifications: false,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_11',
        type: 'credit_card',
        lastFour: '3322',
        expiryDate: '03/25',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 116,
        item: 'Meatloaf Dinner',
        itemId: 'meatloaf_001',
        quantity: 1,
        price: 16,
        tax: 1.28,
        discount: 0,
        total: 17.28,
        orderDate: '2024-01-09T17:30:00Z',
        status: 'delivered',
        specialInstructions: 'Extra gravy. Call when 5 minutes away.'
      }
    ],
    totalPayments: 2100.00,
    outstandingBalance: 0,
    averageOrderValue: 25.00,
    orderFrequency: 'twice-weekly',
    dietaryRestrictions: ['low-sodium'],
    preferredDeliveryTime: '5:00 PM - 6:00 PM'
  },
  {
    id: 10,
    name: 'Priya Patel',
    email: 'priya.patel@healthcare.org',
    phone: '+1888999000',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    company: 'City General Hospital',
    jobTitle: 'Head Nurse',
    address: {
      street: '789 Medical Center Dr',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    registrationDate: '2023-04-18T06:00:00Z',
    lastActive: '2024-01-11T14:30:00Z',
    status: 'active',
    customerTier: 'enterprise',
    lifetimeValue: 5200.80,
    notes: 'Orders for hospital staff. 24/7 schedule.',
    tags: ['healthcare', 'hospital', 'shift-work', 'professional'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: true,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_12',
        type: 'corporate_card',
        lastFour: '1122',
        expiryDate: '09/26',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 117,
        item: 'Nursing Station Pack',
        itemId: 'hospital_pack',
        quantity: 1,
        price: 75,
        tax: 6.00,
        discount: 10.00,
        total: 71.00,
        orderDate: '2024-01-11T02:30:00Z',
        status: 'delivered',
        deliveryAddress: 'City General - ER Staff Room',
        specialInstructions: 'Night shift delivery. Ring bell twice.'
      }
    ],
    totalPayments: 5200.80,
    outstandingBalance: 0,
    averageOrderValue: 86.68,
    orderFrequency: 'daily',
    department: 'Emergency Room',
    hospitalBadgeNumber: 'HN-4456'
  },
  {
    id: 11,
    name: 'Carlos Martinez',
    email: 'carlos@familycatering.com',
    phone: '+1222333444',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    address: {
      street: '444 Familia Avenue',
      city: 'San Antonio',
      state: 'TX',
      zipCode: '78201',
      country: 'USA'
    },
    registrationDate: '2023-06-20T13:45:00Z',
    lastActive: '2024-01-10T18:20:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 3100.25,
    notes: 'Large family orders. Always celebrating something.',
    tags: ['family', 'celebrations', 'group-order', 'regular'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: false,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_13',
        type: 'credit_card',
        lastFour: '6677',
        expiryDate: '01/28',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 118,
        item: 'Family Fiesta Bundle',
        itemId: 'fiesta_bundle',
        quantity: 1,
        price: 89,
        tax: 7.12,
        discount: 15.00,
        total: 81.12,
        orderDate: '2024-01-10T17:00:00Z',
        status: 'delivered',
        specialInstructions: 'Birthday party! Include 6 extra plates.'
      }
    ],
    totalPayments: 3100.25,
    outstandingBalance: 0,
    averageOrderValue: 62.01,
    orderFrequency: 'weekly',
    familySize: 6,
    upcomingEvent: 'Anniversary - Jan 25'
  },
  {
    id: 12,
    name: 'Aisha Johnson',
    email: 'aisha.j@fitnesscoach.com',
    phone: '+1999111222',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    company: 'FitLife Gym',
    jobTitle: 'Head Coach',
    address: {
      street: '321 Fitness Way',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    registrationDate: '2023-03-10T08:30:00Z',
    lastActive: '2024-01-11T07:45:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 1950.50,
    notes: 'Health-conscious. Orders protein-focused meals for clients.',
    tags: ['fitness', 'healthy', 'coach', 'protein'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: true,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_14',
        type: 'credit_card',
        lastFour: '8899',
        expiryDate: '04/27',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 119,
        item: 'Protein Power Bowl',
        itemId: 'protein_bowl',
        quantity: 3,
        price: 45,
        tax: 3.60,
        discount: 5.00,
        total: 43.60,
        orderDate: '2024-01-11T06:30:00Z',
        status: 'processing',
        specialInstructions: 'NO sauces, extra chicken, no carbs'
      }
    ],
    totalPayments: 1950.50,
    outstandingBalance: 43.60,
    averageOrderValue: 32.51,
    orderFrequency: 'daily',
    dietaryPreferences: ['high-protein', 'low-carb', 'gluten-free'],
    gymMembershipId: 'FIT-7890'
  },
  {
    id: 13,
    name: 'Benjamin "Ben" Cohen',
    email: 'ben.cohen@startup.io',
    phone: '+1444555666',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin',
    company: 'TechNomad LLC',
    jobTitle: 'Remote Developer',
    address: {
      street: 'Digital Nomad (Currently: Bali)',
      city: 'International',
      state: 'N/A',
      zipCode: '00000',
      country: 'Various'
    },
    registrationDate: '2023-07-15T22:00:00Z',
    lastActive: '2024-01-11T03:30:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 2800.75,
    notes: 'Digital nomad. Orders from different time zones.',
    tags: ['digital-nomad', 'remote', 'international', 'flexible'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: true,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_15',
        type: 'crypto',
        currency: 'ETH',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 120,
        item: 'Digital Nomad Package',
        itemId: 'nomad_pack',
        quantity: 1,
        price: 25,
        tax: 2.00,
        discount: 3.00,
        total: 24.00,
        orderDate: '2024-01-11T03:00:00Z',
        status: 'pending',
        deliveryAddress: 'Airbnb: Jl. Raya Seminyak No. 100, Bali',
        specialInstructions: 'Leave at gate. Currently in UTC+8'
      }
    ],
    totalPayments: 2800.75,
    outstandingBalance: 24.00,
    averageOrderValue: 40.01,
    orderFrequency: 'irregular',
    currentTimezone: 'UTC+8',
    preferredLanguages: ['English', 'Spanish']
  },
  {
    id: 14,
    name: 'Olivia Williams',
    email: 'olivia@eventplanner.com',
    phone: '+1666888999',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    company: 'Grand Events Planning',
    jobTitle: 'Owner',
    address: {
      street: '888 Celebration Ave',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: '89101',
      country: 'USA'
    },
    registrationDate: '2022-10-05T10:15:00Z',
    lastActive: '2024-01-10T16:45:00Z',
    status: 'active',
    customerTier: 'enterprise',
    lifetimeValue: 15200.50,
    notes: 'Event planner. Large, last-minute orders common.',
    tags: ['event-planner', 'large-orders', 'last-minute', 'corporate'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: false,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_16',
        type: 'credit_card',
        lastFour: '3344',
        expiryDate: '12/26',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 121,
        item: 'Wedding Reception Package',
        itemId: 'wedding_package',
        quantity: 1,
        price: 1200,
        tax: 96.00,
        discount: 100.00,
        total: 1196.00,
        orderDate: '2024-01-10T15:30:00Z',
        status: 'processing',
        specialInstructions: 'VEGAN WEDDING - All items must be plant-based'
      }
    ],
    totalPayments: 15200.50,
    outstandingBalance: 1196.00,
    averageOrderValue: 380.01,
    orderFrequency: 'weekly',
    eventTypes: ['weddings', 'corporate', 'galas'],
    nextMajorEvent: 'Tech Conference - Jan 25 (500 people)'
  },
  {
    id: 15,
    name: 'Kenji Tanaka',
    email: 'kenji.t@globalcorp.jp',
    phone: '+81123456789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji',
    company: 'Global Corp Japan',
    jobTitle: 'Executive Director',
    address: {
      street: 'Tokyo Tower Office',
      city: 'Tokyo',
      state: 'N/A',
      zipCode: '105-0011',
      country: 'Japan'
    },
    registrationDate: '2023-11-20T01:30:00Z',
    lastActive: '2024-01-11T09:00:00Z',
    status: 'active',
    customerTier: 'enterprise',
    lifetimeValue: 4200.00,
    notes: 'International executive. Orders during US visits.',
    tags: ['international', 'executive', 'business-travel', 'japanese'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: false,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_17',
        type: 'corporate_card',
        lastFour: '5566',
        expiryDate: '08/27',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 122,
        item: 'Executive Lunch Set',
        itemId: 'executive_lunch',
        quantity: 1,
        price: 35,
        tax: 2.80,
        discount: 0,
        total: 37.80,
        orderDate: '2024-01-11T12:00:00Z',
        status: 'delivered',
        deliveryAddress: 'Grand Hotel Suite 1204',
        specialInstructions: 'Use chopsticks. Light soy sauce only.'
      }
    ],
    totalPayments: 4200.00,
    outstandingBalance: 0,
    averageOrderValue: 84.00,
    orderFrequency: 'monthly',
    preferredCuisine: 'Japanese',
    translatorRequired: false
  },
  {
    id: 16,
    name: 'Fatima Al-Mansoor',
    email: 'fatima@royalfamily.ae',
    phone: '+971501234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    company: 'Royal Family Office',
    jobTitle: 'Personal Assistant',
    address: {
      street: 'Royal Palace Complex',
      city: 'Dubai',
      state: 'N/A',
      zipCode: '00000',
      country: 'UAE'
    },
    registrationDate: '2023-12-01T04:00:00Z',
    lastActive: '2024-01-10T19:30:00Z',
    status: 'active',
    customerTier: 'enterprise',
    lifetimeValue: 9800.25,
    notes: 'Royal family staff. Extremely high standards.',
    tags: ['royal', 'luxury', 'high-standard', 'international'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: false,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_18',
        type: 'wire_transfer',
        bank: 'Dubai Royal Bank',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 123,
        item: 'Royal Feast Package',
        itemId: 'royal_feast',
        quantity: 1,
        price: 850,
        tax: 68.00,
        discount: 0,
        total: 918.00,
        orderDate: '2024-01-10T18:00:00Z',
        status: 'delivered',
        specialInstructions: 'Gold leaf decoration on desserts. Private chef delivery required.'
      }
    ],
    totalPayments: 9800.25,
    outstandingBalance: 0,
    averageOrderValue: 980.03,
    orderFrequency: 'monthly',
    securityClearance: 'Royal Level 3',
    preferredDelivery: 'Private Chef Delivery'
  },
  {
    id: 17,
    name: 'Marcus "Mark" O\'Connell',
    email: 'marko@firestation34.gov',
    phone: '+1333444555',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    company: 'Fire Station 34',
    jobTitle: 'Fire Captain',
    address: {
      street: '123 Emergency Lane',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    registrationDate: '2023-05-12T07:00:00Z',
    lastActive: '2024-01-11T13:15:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 3200.50,
    notes: 'Fire station orders. Need to be ready for emergency calls.',
    tags: ['first-responder', 'firefighter', 'emergency', 'hero'],
    communicationPreferences: {
      email: false,
      sms: true,
      pushNotifications: true,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_19',
        type: 'government_card',
        lastFour: '7788',
        expiryDate: '06/25',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 124,
        item: 'Firehouse Chili (Large)',
        itemId: 'chili_large',
        quantity: 2,
        price: 28,
        tax: 2.24,
        discount: 5.00,
        total: 25.24,
        orderDate: '2024-01-11T12:30:00Z',
        status: 'delivered',
        specialInstructions: 'If alarm sounds, leave at bay door and GO.'
      }
    ],
    totalPayments: 3200.50,
    outstandingBalance: 0,
    averageOrderValue: 45.72,
    orderFrequency: 'daily',
    stationNumber: 'FS-34',
    shiftSchedule: '24 hours on, 48 off'
  },
  {
    id: 18,
    name: 'Elena Rodriguez',
    email: 'elena.r@teachers.org',
    phone: '+1777999888',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    company: 'Lincoln High School',
    jobTitle: 'Math Teacher',
    address: {
      street: '456 Education Street',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19101',
      country: 'USA'
    },
    registrationDate: '2023-09-01T08:15:00Z',
    lastActive: '2024-01-10T11:45:00Z',
    status: 'active',
    customerTier: 'basic',
    lifetimeValue: 850.25,
    notes: 'Teacher. Orders during lunch breaks.',
    tags: ['teacher', 'education', 'school-hours', 'budget'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: false,
      phoneCalls: false
    },
    paymentMethods: [
      {
        id: 'pm_20',
        type: 'credit_card',
        lastFour: '9900',
        expiryDate: '02/26',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 125,
        item: 'Teacher\'s Lunch Special',
        itemId: 'teacher_lunch',
        quantity: 1,
        price: 10,
        tax: 0.80,
        discount: 1.00,
        total: 9.80,
        orderDate: '2024-01-10T11:00:00Z',
        status: 'delivered',
        deliveryAddress: 'Lincoln High - Math Department',
        specialInstructions: 'Deliver during lunch period (11:30-12:15)'
      }
    ],
    totalPayments: 850.25,
    outstandingBalance: 0,
    averageOrderValue: 12.15,
    orderFrequency: 'weekly',
    schoolId: 'LHS-789',
    lunchPeriod: '11:30 AM - 12:15 PM'
  },
  {
    id: 19,
    name: 'Samuel "Sam" Carter',
    email: 'sam.carter@disabledvets.org',
    phone: '+1222555666',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel',
    address: {
      street: '789 Veterans Lane',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      country: 'USA'
    },
    registrationDate: '2023-04-22T14:30:00Z',
    lastActive: '2024-01-09T18:00:00Z',
    status: 'active',
    customerTier: 'premium',
    lifetimeValue: 1800.00,
    notes: 'Disabled veteran. Needs accessible delivery.',
    tags: ['veteran', 'disabled', 'accessible', 'hero'],
    communicationPreferences: {
      email: true,
      sms: true,
      pushNotifications: true,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_21',
        type: 'va_benefits',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 126,
        item: 'Comfort Food Plate',
        itemId: 'comfort_food',
        quantity: 1,
        price: 14,
        tax: 1.12,
        discount: 3.00,
        total: 12.12,
        orderDate: '2024-01-09T17:30:00Z',
        status: 'delivered',
        specialInstructions: 'Wheelchair accessible delivery. Ring doorbell and wait.'
      }
    ],
    totalPayments: 1800.00,
    outstandingBalance: 0,
    averageOrderValue: 18.00,
    orderFrequency: 'twice-weekly',
    accessibilityNeeds: ['wheelchair ramp', 'extra time at door'],
    veteranId: 'VET-456789'
  },
  {
    id: 20,
    name: 'Lily Chen-Washington',
    email: 'lily@fusionrestaurant.com',
    phone: '+1888222333',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    company: 'Fusion Bistro',
    jobTitle: 'Head Chef',
    address: {
      street: '555 Culinary Avenue',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    },
    registrationDate: '2022-11-15T16:45:00Z',
    lastActive: '2024-01-11T10:30:00Z',
    status: 'active',
    customerTier: 'enterprise',
    lifetimeValue: 12500.75,
    notes: 'Restaurant owner. Orders specialty ingredients.',
    tags: ['chef', 'restaurant', 'ingredients', 'professional'],
    communicationPreferences: {
      email: true,
      sms: false,
      pushNotifications: false,
      phoneCalls: true
    },
    paymentMethods: [
      {
        id: 'pm_22',
        type: 'business_account',
        terms: 'Net 7',
        isDefault: true
      }
    ],
    orders: [
      {
        orderId: 127,
        item: 'Truffle Oil (Premium)',
        itemId: 'truffle_oil',
        quantity: 2,
        price: 85,
        tax: 6.80,
        discount: 10.00,
        total: 166.80,
        orderDate: '2024-01-11T09:00:00Z',
        status: 'processing',
        specialInstructions: 'CHEF QUALITY ONLY. Deliver to back kitchen.'
      }
    ],
    totalPayments: 12500.75,
    outstandingBalance: 166.80,
    averageOrderValue: 178.58,
    orderFrequency: 'weekly',
    restaurantLicense: 'RST-789012',
    deliveryWindow: '2:00 PM - 4:00 PM (Before dinner service)'
  }
];



// Additional utility data that might be useful
export const clientSummary = {
  totalClients: 5,
  activeClients: 3,
  inactiveClients: 1,
  suspendedClients: 0,
  totalLifetimeValue: 15956.90,
  averageClientValue: 3191.38,
  totalOutstanding: 250.02
};

// Possible status options for type safety
export const clientStatuses = ['active', 'inactive', 'suspended'];
export const customerTiers = ['basic', 'premium', 'enterprise'];
export const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
export const paymentTypes = ['credit_card', 'paypal', 'invoice', 'crypto', 'apple_pay'];