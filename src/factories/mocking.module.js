const generateMockProducts = () => {
    const mockProducts = [];

    for (let i = 1; i <= 100; i++) {
        const mockProduct = {
            _id: i,
            name: `Mock Product ${i}`,
            price: Math.floor(Math.random() * 100) + 1,
            stock: Math.floor(Math.random() * 50) + 1,
        };

        mockProducts.push(mockProduct);
    }

    return mockProducts;
};

export { generateMockProducts };