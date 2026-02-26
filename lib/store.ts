// Simple in-memory store for demonstration without MongoDB
export const globalStore = (global as any).store || {
    orders: [
        {
            _id: "demo_order_001",
            customerName: "Alice Smith",
            phoneNumber: "9876543210",
            email: "alice@example.com",
            fileUrl: "#",
            printType: "Color",
            paperSize: "A4",
            numCopies: 2,
            totalPages: 10,
            deliveryOption: "Home Delivery",
            orderStatus: "Ready",
            paymentStatus: "Paid",
            createdAt: new Date().toISOString()
        },
        {
            _id: "demo_order_002",
            customerName: "Bob Johnson",
            phoneNumber: "9123456780",
            email: "bob@example.com",
            fileUrl: "#",
            printType: "B&W",
            paperSize: "A3",
            numCopies: 1,
            totalPages: 5,
            deliveryOption: "Pickup",
            orderStatus: "Printing",
            paymentStatus: "Paid",
            createdAt: new Date(Date.now() - 86400000).toISOString()
        }
    ],
    deletedOrders: [],
    settings: {
        phone: "+91 98765 43210",
        email: "contact@mydistrictcafe.com",
        address: "123 Tech Park, Cyber City, Digital State, 100001",
        upiId: "mydistrictcafe@upi",
        adminUsername: "ADMIN",
        adminPassword: "admin123",
        services: [
            {
                id: "service_1",
                title: "Premium Printing",
                description: "High-resolution B&W and Color printing on various paper types (A4, A3, Legal, Glossy).",
                icon: "Printer"
            },
            {
                id: "service_2",
                title: "Professional Scanning",
                description: "Crystal clear document and photo scanning with OCR capabilities for editable text.",
                icon: "Scan"
            },
            {
                id: "service_3",
                title: "Stationery & Binding",
                description: "Spiral binding, hardbound thesis, lamination, and a full range of office stationery.",
                icon: "BookOpen"
            },
            {
                id: "service_4",
                title: "Online Form Filling",
                description: "Expert assistance with government, passport, exam, and university application forms.",
                icon: "FileText"
            }
        ]
    }
};

if (!(global as any).store) {
    (global as any).store = globalStore;
}
