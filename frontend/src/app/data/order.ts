export const orders = [
  // Client 1: John Doe
  {
    orderId: 101,
    clientId: 1,
    clientName: 'John Doe',
    clientEmail: 'john.doe@example.com',
    orderDate: '2024-01-05T12:30:00Z',
    deliveryDate: '2024-01-05T13:15:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-05T12:30:00Z' },
      { status: 'confirmed', timestamp: '2024-01-05T12:35:00Z' },
      { status: 'preparing', timestamp: '2024-01-05T12:40:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-05T13:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-05T13:15:00Z' }
    ],
    items: [
      {
        itemId: 'burger_001',
        name: 'Classic Burger',
        quantity: 2,
        unitPrice: 10.00,
        totalPrice: 20.00,
        category: 'Burgers',
        customizations: ['Extra pickles', 'No onions', 'Add cheese'],
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: false }
      },
      {
        itemId: 'fries_001',
        name: 'Seasoned Fries',
        quantity: 1,
        unitPrice: 4.00,
        totalPrice: 4.00,
        category: 'Sides',
        dietaryInfo: { vegetarian: true, vegan: true, glutenFree: true }
      }
    ],
    subtotal: 24.00,
    tax: 1.92,
    deliveryFee: 3.99,
    serviceFee: 1.50,
    discount: {
      type: 'promo_code',
      code: 'WELCOME10',
      amount: 2.40
    },
    total: 29.01,
    payment: {
      method: 'credit_card',
      transactionId: 'txn_001',
      status: 'completed',
      amountPaid: 29.01,
      paymentDate: '2024-01-05T12:32:00Z'
    },
    delivery: {
      address: '123 Main Street, New York, NY 10001',
      type: 'standard',
      driver: { id: 'DRV001', name: 'Mike Johnson' },
      estimatedDelivery: '2024-01-05T13:15:00Z',
      actualDelivery: '2024-01-05T13:12:00Z',
      deliveryNotes: 'Left at front door',
      trackingUrl: 'https://track.example.com/101'
    },
    specialInstructions: 'Extra pickles, no onions. Please leave at door.',
    orderSource: 'mobile_app',
    rating: 5,
    review: 'Excellent service! Food was hot and delicious.',
    preparationTime: 20, // minutes
    cookingInstructions: 'Medium rare for burgers'
  },
  {
    orderId: 102,
    clientId: 1,
    clientName: 'John Doe',
    clientEmail: 'john.doe@example.com',
    orderDate: '2024-01-08T18:45:00Z',
    deliveryDate: '2024-01-08T19:30:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-08T18:45:00Z' },
      { status: 'confirmed', timestamp: '2024-01-08T18:48:00Z' },
      { status: 'preparing', timestamp: '2024-01-08T18:52:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-08T19:15:00Z' },
      { status: 'delivered', timestamp: '2024-01-08T19:28:00Z' }
    ],
    items: [
      {
        itemId: 'pizza_003',
        name: 'Pepperoni Pizza',
        quantity: 1,
        unitPrice: 15.00,
        totalPrice: 15.00,
        category: 'Pizza',
        size: 'Large',
        customizations: ['Extra cheese', 'Light sauce'],
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: false }
      }
    ],
    subtotal: 15.00,
    tax: 1.20,
    deliveryFee: 3.99,
    serviceFee: 1.00,
    discount: null,
    total: 21.19,
    payment: {
      method: 'paypal',
      transactionId: 'txn_002',
      status: 'completed',
      amountPaid: 21.19,
      paymentDate: '2024-01-08T18:47:00Z'
    },
    delivery: {
      address: 'Office: 456 Business Ave, New York, NY 10002',
      type: 'express',
      driver: { id: 'DRV002', name: 'Sarah Williams' },
      estimatedDelivery: '2024-01-08T19:30:00Z',
      actualDelivery: '2024-01-08T19:28:00Z',
      deliveryNotes: 'Received by reception',
      trackingUrl: 'https://track.example.com/102'
    },
    specialInstructions: 'Deliver to reception desk',
    orderSource: 'web',
    rating: 4,
    review: 'Good pizza but delivery was a bit late',
    preparationTime: 25
  },

  // Client 2: Jane Smith
  {
    orderId: 103,
    clientId: 2,
    clientName: 'Jane Smith',
    clientEmail: 'jane.smith@example.com',
    orderDate: '2024-01-07T19:30:00Z',
    deliveryDate: '2024-01-07T20:15:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-07T19:30:00Z' },
      { status: 'confirmed', timestamp: '2024-01-07T19:33:00Z' },
      { status: 'preparing', timestamp: '2024-01-07T19:38:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-07T20:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-07T20:12:00Z' }
    ],
    items: [
      {
        itemId: 'fries_002',
        name: 'Vegan Fries',
        quantity: 3,
        unitPrice: 3.00,
        totalPrice: 9.00,
        category: 'Sides',
        dietaryInfo: { vegetarian: true, vegan: true, glutenFree: true }
      }
    ],
    subtotal: 9.00,
    tax: 0.72,
    deliveryFee: 2.99,
    serviceFee: 0.50,
    discount: {
      type: 'loyalty_points',
      pointsUsed: 100,
      amount: 2.00
    },
    total: 11.21,
    payment: {
      method: 'credit_card',
      transactionId: 'txn_003',
      status: 'completed',
      amountPaid: 11.21,
      paymentDate: '2024-01-07T19:32:00Z'
    },
    delivery: {
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      type: 'standard',
      driver: { id: 'DRV003', name: 'Carlos Rodriguez' },
      estimatedDelivery: '2024-01-07T20:15:00Z',
      actualDelivery: '2024-01-07T20:12:00Z',
      deliveryNotes: 'Eco-friendly packaging as requested',
      trackingUrl: 'https://track.example.com/103'
    },
    specialInstructions: 'Use paper packaging only, no plastic',
    orderSource: 'mobile_app',
    rating: 5,
    review: 'Perfect! Love the eco-friendly packaging',
    packagingType: 'eco_friendly'
  },
  {
    orderId: 104,
    clientId: 2,
    clientName: 'Jane Smith',
    clientEmail: 'jane.smith@example.com',
    orderDate: '2024-01-09T13:15:00Z',
    deliveryDate: '2024-01-09T13:45:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-09T13:15:00Z' },
      { status: 'confirmed', timestamp: '2024-01-09T13:17:00Z' },
      { status: 'preparing', timestamp: '2024-01-09T13:20:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-09T13:30:00Z' },
      { status: 'delivered', timestamp: '2024-01-09T13:42:00Z' }
    ],
    items: [
      {
        itemId: 'salad_005',
        name: 'Caesar Salad',
        quantity: 1,
        unitPrice: 7.00,
        totalPrice: 7.00,
        category: 'Salads',
        customizations: ['No croutons', 'Extra dressing', 'Add grilled chicken'],
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: true }
      }
    ],
    subtotal: 7.00,
    tax: 0.56,
    deliveryFee: 2.99,
    serviceFee: 0.50,
    discount: null,
    total: 11.05,
    payment: {
      method: 'credit_card',
      transactionId: 'txn_004',
      status: 'completed',
      amountPaid: 11.05,
      paymentDate: '2024-01-09T13:16:00Z'
    },
    delivery: {
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      type: 'standard',
      driver: { id: 'DRV004', name: 'Lisa Chen' },
      estimatedDelivery: '2024-01-09T13:45:00Z',
      actualDelivery: '2024-01-09T13:42:00Z',
      deliveryNotes: 'Left at door',
      trackingUrl: 'https://track.example.com/104'
    },
    specialInstructions: 'No croutons, extra dressing',
    orderSource: 'mobile_app',
    rating: 4,
    preparationTime: 15
  },
  {
    orderId: 105,
    clientId: 2,
    clientName: 'Jane Smith',
    clientEmail: 'jane.smith@example.com',
    orderDate: '2024-01-10T20:00:00Z',
    deliveryDate: null,
    status: 'processing',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-10T20:00:00Z' },
      { status: 'confirmed', timestamp: '2024-01-10T20:02:00Z' },
      { status: 'preparing', timestamp: '2024-01-10T20:05:00Z' }
    ],
    items: [
      {
        itemId: 'burger_007',
        name: 'Vegan Burger',
        quantity: 2,
        unitPrice: 12.00,
        totalPrice: 24.00,
        category: 'Burgers',
        customizations: ['Avocado spread', 'Whole wheat bun'],
        dietaryInfo: { vegetarian: true, vegan: true, glutenFree: false }
      }
    ],
    subtotal: 24.00,
    tax: 1.92,
    deliveryFee: 3.99,
    serviceFee: 1.00,
    discount: {
      type: 'promo_code',
      code: 'VEGAN15',
      amount: 1.50
    },
    total: 29.41,
    payment: {
      method: 'credit_card',
      transactionId: 'txn_005',
      status: 'pending',
      amountPaid: 0,
      paymentDate: null
    },
    delivery: {
      address: '456 Oak Avenue, Los Angeles, CA 90001',
      type: 'standard',
      driver: null,
      estimatedDelivery: '2024-01-10T20:45:00Z',
      actualDelivery: null,
      trackingUrl: 'https://track.example.com/105'
    },
    specialInstructions: null,
    orderSource: 'web',
    estimatedPreparationTime: 20
  },

  // Client 3: Robert Johnson (Corporate - TechCorp)
  {
    orderId: 106,
    clientId: 3,
    clientName: 'Robert Johnson',
    clientEmail: 'robert.j@techcorp.com',
    orderDate: '2024-01-02T10:00:00Z',
    deliveryDate: '2024-01-02T11:30:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-02T10:00:00Z' },
      { status: 'confirmed', timestamp: '2024-01-02T10:05:00Z' },
      { status: 'preparing', timestamp: '2024-01-02T10:15:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-02T11:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-02T11:25:00Z' }
    ],
    items: [
      {
        itemId: 'pizza_015',
        name: 'Pizza Party Pack',
        quantity: 10,
        unitPrice: 120.00,
        totalPrice: 1200.00,
        category: 'Catering',
        description: 'Includes 10 large pizzas (4 pepperoni, 3 cheese, 3 veggie)',
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: false }
      },
      {
        itemId: 'drinks_001',
        name: 'Soft Drinks Pack',
        quantity: 2,
        unitPrice: 25.00,
        totalPrice: 50.00,
        category: 'Beverages',
        dietaryInfo: { vegetarian: true, vegan: true, glutenFree: true }
      }
    ],
    subtotal: 1250.00,
    tax: 100.00,
    deliveryFee: 0.00, // Free delivery for corporate orders
    serviceFee: 25.00,
    discount: {
      type: 'corporate_discount',
      code: 'TECHCORP100',
      amount: 100.00
    },
    total: 1275.00,
    payment: {
      method: 'invoice',
      transactionId: 'inv_001',
      status: 'pending',
      amountPaid: 0,
      paymentDate: null,
      dueDate: '2024-02-01T23:59:00Z'
    },
    delivery: {
      address: 'TechCorp Inc., 789 Corporate Blvd, San Francisco, CA 94107',
      type: 'catering',
      driver: { id: 'DRV005', name: 'James Wilson' },
      estimatedDelivery: '2024-01-02T11:30:00Z',
      actualDelivery: '2024-01-02T11:25:00Z',
      deliveryNotes: 'Delivered to reception. Jane signed at 11:25',
      trackingUrl: 'https://track.example.com/106'
    },
    specialInstructions: 'Deliver to reception. Contact Jane at ext. 345. Set up in conference room B.',
    orderSource: 'phone',
    rating: 5,
    review: 'Perfect for our team meeting! Will order again.',
    eventType: 'team_meeting',
    attendees: 50
  },

  // Client 4: Maria Garcia (Inactive)
  {
    orderId: 108,
    clientId: 4,
    clientName: 'Maria Garcia',
    clientEmail: 'm.garcia@email.com',
    orderDate: '2023-10-15T19:45:00Z',
    deliveryDate: '2023-10-15T20:30:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2023-10-15T19:45:00Z' },
      { status: 'confirmed', timestamp: '2023-10-15T19:48:00Z' },
      { status: 'preparing', timestamp: '2023-10-15T19:52:00Z' },
      { status: 'out_for_delivery', timestamp: '2023-10-15T20:15:00Z' },
      { status: 'delivered', timestamp: '2023-10-15T20:28:00Z' }
    ],
    items: [
      {
        itemId: 'tacos_012',
        name: 'Beef Tacos',
        quantity: 2,
        unitPrice: 4.00,
        totalPrice: 8.00,
        category: 'Mexican',
        customizations: ['Extra salsa', 'No cilantro'],
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: false }
      }
    ],
    subtotal: 8.00,
    tax: 0.64,
    deliveryFee: 2.99,
    serviceFee: 0.50,
    discount: null,
    total: 12.13,
    payment: {
      method: 'credit_card',
      transactionId: 'txn_006',
      status: 'completed',
      amountPaid: 12.13,
      paymentDate: '2023-10-15T19:47:00Z'
    },
    delivery: {
      address: '321 Maple Street, Miami, FL 33101',
      type: 'standard',
      driver: { id: 'DRV006', name: 'Miguel Sanchez' },
      estimatedDelivery: '2023-10-15T20:30:00Z',
      actualDelivery: '2023-10-15T20:28:00Z',
      deliveryNotes: 'Left at door',
      trackingUrl: 'https://track.example.com/108'
    },
    orderSource: 'mobile_app',
    rating: 4
  },

  // Client 6: Alexandra Rodriguez (Influencer)
  {
    orderId: 113,
    clientId: 6,
    clientName: 'Alexandra Rodriguez',
    clientEmail: 'alex.rodriguez@email.com',
    orderDate: '2024-01-11T10:15:00Z',
    deliveryDate: '2024-01-11T11:00:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-11T10:15:00Z' },
      { status: 'confirmed', timestamp: '2024-01-11T10:18:00Z' },
      { status: 'preparing', timestamp: '2024-01-11T10:22:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-11T10:45:00Z' },
      { status: 'delivered', timestamp: '2024-01-11T10:55:00Z' }
    ],
    items: [
      {
        itemId: 'bowl_010',
        name: 'Rainbow Smoothie Bowl',
        quantity: 1,
        unitPrice: 14.00,
        totalPrice: 14.00,
        category: 'Healthy',
        customizations: ['Extra berries', 'Add granola', 'Coconut flakes'],
        dietaryInfo: { vegetarian: true, vegan: true, glutenFree: true }
      },
      {
        itemId: 'photo_001',
        name: 'Instagram Photo Service',
        quantity: 1,
        unitPrice: 5.00,
        totalPrice: 5.00,
        category: 'Services',
        description: 'Professional food styling for social media'
      }
    ],
    subtotal: 19.00,
    tax: 1.52,
    deliveryFee: 0.00, // Free for influencers
    serviceFee: 0.00,
    discount: null,
    total: 20.52,
    payment: {
      method: 'credit_card',
      transactionId: 'txn_007',
      status: 'completed',
      amountPaid: 20.52,
      paymentDate: '2024-01-11T10:17:00Z'
    },
    delivery: {
      address: '987 Sunset Boulevard, Los Angeles, CA 90210',
      type: 'express',
      driver: { id: 'DRV007', name: 'Tyler Reed' },
      estimatedDelivery: '2024-01-11T11:00:00Z',
      actualDelivery: '2024-01-11T10:55:00Z',
      deliveryNotes: 'Handed directly to customer',
      trackingUrl: 'https://track.example.com/113'
    },
    specialInstructions: 'EXTRA colorful for photos! Please make Instagram-worthy presentation.',
    orderSource: 'mobile_app',
    rating: 5,
    review: 'Absolutely beautiful presentation! My followers loved it!',
    socialMediaTags: ['#foodporn', '#healthyfood', '#smoothiebowl'],
    instagramHandle: '@HealthyAlex'
  },

  // Client 7: James Wilson (Construction)
  {
    orderId: 114,
    clientId: 7,
    clientName: 'James Wilson',
    clientEmail: 'james.wilson@construction.com',
    orderDate: '2024-01-11T05:30:00Z',
    deliveryDate: '2024-01-11T06:20:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-11T05:30:00Z' },
      { status: 'confirmed', timestamp: '2024-01-11T05:32:00Z' },
      { status: 'preparing', timestamp: '2024-01-11T05:35:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-11T06:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-11T06:15:00Z' }
    ],
    items: [
      {
        itemId: 'coffee_bulk',
        name: 'Coffee (20 cups)',
        quantity: 1,
        unitPrice: 40.00,
        totalPrice: 40.00,
        category: 'Beverages',
        description: 'Assorted: 10 black, 5 with cream, 5 with sugar',
        dietaryInfo: { vegetarian: true, vegan: false, glutenFree: true }
      },
      {
        itemId: 'pastry_bulk',
        name: 'Breakfast Pastries (12 pack)',
        quantity: 1,
        unitPrice: 25.00,
        totalPrice: 25.00,
        category: 'Breakfast',
        dietaryInfo: { vegetarian: true, vegan: false, glutenFree: false }
      }
    ],
    subtotal: 65.00,
    tax: 5.20,
    deliveryFee: 0.00, // Free early morning delivery
    serviceFee: 2.00,
    discount: {
      type: 'regular_customer',
      amount: 5.00
    },
    total: 67.20,
    payment: {
      method: 'invoice',
      transactionId: 'inv_002',
      status: 'pending',
      amountPaid: 0,
      paymentDate: null,
      dueDate: '2024-01-26T23:59:00Z'
    },
    delivery: {
      address: 'Construction Site: 123 Build St, Chicago, IL',
      type: 'early_bird',
      driver: { id: 'DRV008', name: 'Bob Thompson' },
      estimatedDelivery: '2024-01-11T06:30:00Z',
      actualDelivery: '2024-01-11T06:15:00Z',
      deliveryNotes: 'Delivered to trailer. Gate code 4455 used.',
      trackingUrl: 'https://track.example.com/114'
    },
    specialInstructions: 'Deliver to trailer by 6:30 AM sharp. Gate code: 4455. Ask for Jim.',
    orderSource: 'phone',
    rating: 5,
    review: 'Always on time for our crew!',
    deliveryPriority: 'high'
  },

  // Client 10: Priya Patel (Hospital)
  {
    orderId: 117,
    clientId: 10,
    clientName: 'Priya Patel',
    clientEmail: 'priya.patel@healthcare.org',
    orderDate: '2024-01-11T02:30:00Z',
    deliveryDate: '2024-01-11T03:15:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-11T02:30:00Z' },
      { status: 'confirmed', timestamp: '2024-01-11T02:33:00Z' },
      { status: 'preparing', timestamp: '2024-01-11T02:38:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-11T03:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-11T03:10:00Z' }
    ],
    items: [
      {
        itemId: 'hospital_pack',
        name: 'Nursing Station Pack',
        quantity: 1,
        unitPrice: 75.00,
        totalPrice: 75.00,
        category: 'Catering',
        description: 'Includes sandwiches, salads, fruits, and drinks for 15 people',
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: false }
      }
    ],
    subtotal: 75.00,
    tax: 6.00,
    deliveryFee: 0.00, // Free for hospitals
    serviceFee: 0.00,
    discount: {
      type: 'healthcare_discount',
      amount: 10.00
    },
    total: 71.00,
    payment: {
      method: 'corporate_card',
      transactionId: 'txn_008',
      status: 'completed',
      amountPaid: 71.00,
      paymentDate: '2024-01-11T02:32:00Z'
    },
    delivery: {
      address: 'City General - ER Staff Room, 789 Medical Center Dr, Houston, TX 77001',
      type: 'hospital',
      driver: { id: 'DRV009', name: 'Maria Gonzalez' },
      estimatedDelivery: '2024-01-11T03:15:00Z',
      actualDelivery: '2024-01-11T03:10:00Z',
      deliveryNotes: 'Night shift delivery. Rang bell twice. Nurse Sarah received.',
      trackingUrl: 'https://track.example.com/117'
    },
    specialInstructions: 'Night shift delivery. Ring bell twice. ER staff room - follow signs.',
    orderSource: 'mobile_app',
    rating: 5,
    review: 'Lifesaver for our night shift!',
    priorityLevel: 'emergency_services'
  },

  // Client 14: Olivia Williams (Event Planner - Wedding)
  {
    orderId: 121,
    clientId: 14,
    clientName: 'Olivia Williams',
    clientEmail: 'olivia@eventplanner.com',
    orderDate: '2024-01-10T15:30:00Z',
    deliveryDate: '2024-01-12T16:00:00Z', // Future delivery
    status: 'processing',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-10T15:30:00Z' },
      { status: 'confirmed', timestamp: '2024-01-10T15:35:00Z' },
      { status: 'preparing', timestamp: '2024-01-10T16:00:00Z' }
    ],
    items: [
      {
        itemId: 'wedding_package',
        name: 'Wedding Reception Package',
        quantity: 1,
        unitPrice: 1200.00,
        totalPrice: 1200.00,
        category: 'Catering',
        description: 'Vegan wedding package for 100 guests. Includes appetizers, main course, desserts, and drinks.',
        dietaryInfo: { vegetarian: true, vegan: true, glutenFree: true }
      },
      {
        itemId: 'cake_001',
        name: 'Vegan Wedding Cake (3-tier)',
        quantity: 1,
        unitPrice: 350.00,
        totalPrice: 350.00,
        category: 'Desserts',
        dietaryInfo: { vegetarian: true, vegan: true, glutenFree: true }
      }
    ],
    subtotal: 1550.00,
    tax: 124.00,
    deliveryFee: 100.00,
    serviceFee: 75.00,
    discount: {
      type: 'event_discount',
      amount: 100.00
    },
    total: 1749.00,
    payment: {
      method: 'credit_card',
      transactionId: 'txn_009',
      status: 'completed',
      amountPaid: 874.50,
      paymentDate: '2024-01-10T15:33:00Z'
    },
    delivery: {
      address: 'Grand Ballroom, Luxury Hotel, 888 Celebration Ave, Las Vegas, NV 89101',
      type: 'event_catering',
      driver: null,
      estimatedDelivery: '2024-01-12T16:00:00Z',
      actualDelivery: null,
      setupRequired: true,
      setupTime: '2 hours before event'
    },
    specialInstructions: 'VEGAN WEDDING - All items must be 100% plant-based. No animal products. Setup by 4 PM. Contact Olivia on site.',
    orderSource: 'web',
    eventDetails: {
      type: 'wedding',
      date: '2024-01-12',
      time: '18:00',
      guests: 100,
      brideName: 'Emma',
      groomName: 'David',
      theme: 'Rustic Vegan'
    },
    depositPaid: 874.50,
    balanceDue: 874.50,
    balanceDueDate: '2024-01-11T23:59:00Z'
  },

  // Client 16: Fatima Al-Mansoor (Royal Family)
  {
    orderId: 123,
    clientId: 16,
    clientName: 'Fatima Al-Mansoor',
    clientEmail: 'fatima@royalfamily.ae',
    orderDate: '2024-01-10T18:00:00Z',
    deliveryDate: '2024-01-10T19:30:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-10T18:00:00Z' },
      { status: 'confirmed', timestamp: '2024-01-10T18:02:00Z' },
      { status: 'preparing', timestamp: '2024-01-10T18:05:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-10T19:00:00Z' },
      { status: 'delivered', timestamp: '2024-01-10T19:25:00Z' }
    ],
    items: [
      {
        itemId: 'royal_feast',
        name: 'Royal Feast Package',
        quantity: 1,
        unitPrice: 850.00,
        totalPrice: 850.00,
        category: 'Premium',
        description: '7-course meal with gold leaf decoration, truffles, and premium ingredients',
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: false }
      },
      {
        itemId: 'champagne_001',
        name: 'Dom Pérignon Champagne',
        quantity: 2,
        unitPrice: 250.00,
        totalPrice: 500.00,
        category: 'Beverages',
        dietaryInfo: { vegetarian: true, vegan: false, glutenFree: true }
      }
    ],
    subtotal: 1350.00,
    tax: 108.00,
    deliveryFee: 500.00, // Private chef delivery
    serviceFee: 200.00,
    discount: null,
    total: 2158.00,
    payment: {
      method: 'wire_transfer',
      transactionId: 'wire_001',
      status: 'completed',
      amountPaid: 2158.00,
      paymentDate: '2024-01-10T17:55:00Z' // Paid in advance
    },
    delivery: {
      address: 'Royal Palace Complex, Dubai, UAE',
      type: 'private_chef',
      driver: { id: 'DRV010', name: 'Chef Pierre', role: 'Executive Chef' },
      estimatedDelivery: '2024-01-10T19:30:00Z',
      actualDelivery: '2024-01-10T19:25:00Z',
      deliveryNotes: 'Security clearance approved. Delivered to main dining hall.',
      requiresSecurityClearance: true,
      securityLevel: 'Royal Level 3'
    },
    specialInstructions: 'Gold leaf decoration on desserts. Private chef delivery required. Serve at exactly 19:30.',
    orderSource: 'phone',
    rating: 5,
    review: 'Impeccable service as always. The royal family was pleased.',
    serviceType: 'royal_service'
  },

  // Client 20: Lily Chen-Washington (Restaurant Chef)
  {
    orderId: 127,
    clientId: 20,
    clientName: 'Lily Chen-Washington',
    clientEmail: 'lily@fusionrestaurant.com',
    orderDate: '2024-01-11T09:00:00Z',
    deliveryDate: null,
    status: 'processing',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-11T09:00:00Z' },
      { status: 'confirmed', timestamp: '2024-01-11T09:05:00Z' },
      { status: 'preparing', timestamp: '2024-01-11T09:10:00Z' }
    ],
    items: [
      {
        itemId: 'truffle_oil',
        name: 'Truffle Oil (Premium)',
        quantity: 2,
        unitPrice: 85.00,
        totalPrice: 170.00,
        category: 'Ingredients',
        brand: 'TartufLanghe',
        origin: 'Italy',
        qualityGrade: 'A+'
      },
      {
        itemId: 'saffron_001',
        name: 'Saffron Threads (Premium)',
        quantity: 1,
        unitPrice: 120.00,
        totalPrice: 120.00,
        category: 'Ingredients',
        brand: 'Mongra',
        origin: 'Kashmir',
        qualityGrade: 'AAA'
      }
    ],
    subtotal: 290.00,
    tax: 23.20,
    deliveryFee: 15.00,
    serviceFee: 10.00,
    discount: { 
      type: 'restaurant_discount',
      amount: 10.00
    },
    total: 328.20,
    payment: {
      method: 'business_account',
      transactionId: 'inv_003',
      status: 'pending',
      amountPaid: 0,
      paymentDate: null,
      dueDate: '2024-01-18T23:59:00Z'
    },
    delivery: {
      address: 'Fusion Bistro - Back Kitchen, 555 Culinary Avenue, Portland, OR 97201',
      type: 'restaurant_supply',
      driver: null,
      estimatedDelivery: '2024-01-11T14:00:00Z',
      actualDelivery: null,
      deliveryNotes: 'Deliver to back kitchen door between 2-4 PM'
    },
    specialInstructions: 'CHEF QUALITY ONLY. Must be restaurant-grade. Deliver to back kitchen. Call upon arrival.',
    orderSource: 'phone',
    deliveryWindow: '14:00-16:00',
    purchaseType: 'restaurant_supply'
  },

  // Additional orders for variety
  {
    orderId: 128,
    clientId: 5,
    clientName: 'David Chen',
    clientEmail: 'david.chen@startup.io',
    orderDate: '2024-01-12T08:30:00Z',
    deliveryDate: null,
    status: 'pending',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-12T08:30:00Z' }
    ],
    items: [
      {
        itemId: 'breakfast_combo',
        name: 'Startup Breakfast Combo',
        quantity: 1,
        unitPrice: 18.00,
        totalPrice: 18.00,
        category: 'Breakfast',
        dietaryInfo: { vegetarian: true, vegan: false, glutenFree: true }
      }
    ],
    subtotal: 18.00,
    tax: 1.44,
    deliveryFee: 2.99,
    serviceFee: 1.00,
    discount: {
      type: 'promo_code',
      code: 'STARTUP20',
      amount: 3.60
    },
    total: 19.83,
    payment: {
      method: 'crypto',
      transactionId: 'crypto_001',
      status: 'pending',
      amountPaid: 0,
      paymentDate: null
    },
    delivery: {
      address: '654 Startup Alley, Austin, TX 73301',
      type: 'standard',
      driver: null,
      estimatedDelivery: '2024-01-12T09:15:00Z',
      actualDelivery: null
    },
    orderSource: 'mobile_app',
    specialInstructions: 'Leave at co-working space reception'
  },

  {
    orderId: 129,
    clientId: 8,
    clientName: 'Sophie Nguyen',
    clientEmail: 'sophie.n@university.edu',
    orderDate: '2024-01-11T23:45:00Z',
    deliveryDate: '2024-01-12T00:20:00Z',
    status: 'delivered',
    statusHistory: [
      { status: 'pending', timestamp: '2024-01-11T23:45:00Z' },
      { status: 'confirmed', timestamp: '2024-01-11T23:47:00Z' },
      { status: 'preparing', timestamp: '2024-01-11T23:50:00Z' },
      { status: 'out_for_delivery', timestamp: '2024-01-12T00:10:00Z' },
      { status: 'delivered', timestamp: '2024-01-12T00:18:00Z' }
    ],
    items: [
      {
        itemId: 'ramen_001',
        name: 'Midnight Ramen',
        quantity: 1,
        unitPrice: 12.00,
        totalPrice: 12.00,
        category: 'Noodles',
        dietaryInfo: { vegetarian: false, vegan: false, glutenFree: false }
      }
    ],
    subtotal: 12.00,
    tax: 0.96,
    deliveryFee: 3.99,
    serviceFee: 1.00,
    discount: null,
    total: 17.95,
    payment: {
      method: 'paypal',
      transactionId: 'txn_010',
      status: 'completed',
      amountPaid: 17.95,
      paymentDate: '2024-01-11T23:46:00Z'
    },
    delivery: {
      address: 'University Dorm 4B, Room 312, Boston, MA 02115',
      type: 'late_night',
      driver: { id: 'DRV011', name: 'Tom Wilson' },
      estimatedDelivery: '2024-01-12T00:30:00Z',
      actualDelivery: '2024-01-12T00:18:00Z',
      deliveryNotes: 'Left at dorm entrance as requested'
    },
    specialInstructions: 'Leave at dorm entrance, text when arrived',
    orderSource: 'mobile_app',
    rating: 5,
    review: 'Perfect late-night study fuel!'
  }
];

// Order statistics and metadata
export const orderStats = {
  totalOrders: 20,
  totalRevenue: 6285.34,
  averageOrderValue: 314.27,
  byStatus: {
    pending: 3,
    processing: 3,
    delivered: 14,
    cancelled: 0,
    refunded: 0
  },
  bySource: {
    mobile_app: 8,
    web: 4,
    phone: 5,
    other: 3
  },
  byPaymentMethod: {
    credit_card: 8,
    paypal: 3,
    invoice: 3,
    crypto: 1,
    corporate_card: 1,
    wire_transfer: 1,
    business_account: 1,
    other: 2
  },
  recentOrders: 5,
  todaysOrders: 3,
  thisWeeksRevenue: 2450.50
};

// Order status options
export const orderStatuses = [
  'pending',
  'confirmed',
  'preparing',
  'ready_for_pickup',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded'
];

// Delivery types
export const deliveryTypes = [
  'standard',
  'express',
  'catering',
  'early_bird',
  'late_night',
  'hospital',
  'event_catering',
  'private_chef',
  'restaurant_supply'
];

// Order sources
export const orderSources = [
  'mobile_app',
  'web',
  'phone',
  'in_person',
  'third_party'
];