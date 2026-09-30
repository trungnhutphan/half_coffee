export const STORE = {
  name: 'Every Half · Võ Thị Sáu',
  address: '232/23 Võ Thị Sáu, P. Xuân Hòa, Q.3, TP. Hồ Chí Minh',
  serviceTime: 'Nhận món sau 15–20 phút',
};

export const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'coffee', label: 'Cà phê' },
  { id: 'tea', label: 'Trà & trái cây' },
  { id: 'pastry', label: 'Bánh ngọt' },
];

export const PRODUCTS = [
  {
    id: 'cara-melting',
    name: 'Cara Melting',
    description: 'Cà phê specialty, caramel muối và lớp kem mây.',
    category: 'coffee',
    price: 80000,
    label: 'Được chọn nhiều',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'fine-robusta',
    name: 'Fine Robusta sữa đá',
    description: 'Nốt chocolate đen, hậu vị mạch nha, sữa tươi.',
    category: 'coffee',
    price: 65000,
    label: 'Hạt Việt Nam',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'oat-latte',
    name: 'Oat Latte',
    description: 'Espresso rang vừa với sữa yến mạch êm và ngọt dịu.',
    category: 'coffee',
    price: 75000,
    label: 'Êm dịu',
    image: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'matcha-cloud',
    name: 'Matcha Cloud',
    description: 'Matcha Shizuoka, kem sữa mằn mặn và hương vani.',
    category: 'tea',
    price: 90000,
    label: 'Mới trong mùa',
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'peach-tea',
    name: 'Trà đào hoa nhài',
    description: 'Trà nhài lạnh, đào vàng và một chút vỏ cam.',
    category: 'tea',
    price: 70000,
    label: 'Thanh mát',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'butter-croissant',
    name: 'Croissant bơ Pháp',
    description: 'Vỏ giòn thơm, ruột mềm, nướng mới trong ngày.',
    category: 'pastry',
    price: 48000,
    label: 'Nướng sáng nay',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80',
  },
];

export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Tiền mặt khi nhận món' },
  { id: 'momo', label: 'Ví MoMo (mô phỏng)' },
  { id: 'card', label: 'Thẻ nội địa (mô phỏng)' },
];
