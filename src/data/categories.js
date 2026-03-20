// src/data/categories.js
import { Monitor, Smartphone, Armchair, Watch, Laptop, Tv, Wind,  Headphones, Camera, Speaker } from 'lucide-react';

export const categoryData = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Monitor', // We'll render icons dynamically
    subCategories: [
      { 
        id: 'laptops', 
        name: 'Laptops', 
        products: [
          { id: 101, name: 'MacBook Pro M3', icon: '💻' },
          { id: 102, name: 'Dell XPS 15', icon: '💻' },
          { id: 103, name: 'HP Spectre x360', icon: '💻' }
        ]
      },
      { 
        id: 'tvs', 
        name: 'Televisions', 
        products: [
          { id: 201, name: 'Samsung Neo QLED', icon: '📺' },
          { id: 202, name: 'LG OLED C3', icon: '📺' },
          { id: 203, name: 'Sony Bravia XR', icon: '📺' }
        ]
      },
      { 
        id: 'ac', 
        name: 'Air Conditioners', 
        products: [
          { id: 301, name: 'Daikin 1.5 Ton', icon: '❄️' },
          { id: 302, name: 'Voltas Split AC', icon: '❄️' }
        ]
      }
    ]
  },
  {
    id: 'mobiles',
    name: 'Mobiles',
    icon: 'Smartphone',
    subCategories: [
      { 
        id: 'apple', 
        name: 'Apple', 
        products: [
          { id: 401, name: 'iPhone 15 Pro', icon: '📱' },
          { id: 402, name: 'iPhone 14', icon: '📱' }
        ]
      },
      { 
        id: 'samsung', 
        name: 'Samsung', 
        products: [
          { id: 501, name: 'Galaxy S24 Ultra', icon: '📱' },
          { id: 502, name: 'Galaxy Z Fold 5', icon: '📱' }
        ]
      },
      { 
        id: 'oneplus', 
        name: 'OnePlus', 
        products: [
          { id: 601, name: 'OnePlus 12', icon: '📱' },
          { id: 602, name: 'Nord CE 3', icon: '📱' }
        ]
      }
    ]
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: 'Armchair',
    subCategories: [
      { id: 'sofas', name: 'Sofas & Couches', products: [{id:701, name:'Leather Recliner', icon:'🛋️'}] },
      { id: 'beds', name: 'Beds & Mattresses', products: [{id:702, name:'King Size Bed', icon:'🛏️'}] }
    ]
  },
  {
    id: 'gadgets',
    name: 'Gadgets',
    icon: 'Watch',
    subCategories: [
      { id: 'smartwatch', name: 'Smart Watches', products: [{id:801, name:'Apple Watch Ultra', icon:'⌚'}] },
      { id: 'audio', name: 'Headphones', products: [{id:802, name:'Sony WH-1000XM5', icon:'🎧'}] }
    ]
  }
];