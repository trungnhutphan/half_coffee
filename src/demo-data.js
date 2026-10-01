const freezeEntries = (entries) => Object.freeze(entries.map((entry) => Object.freeze(entry)));

export const REWARD_INCREMENT = 120;

export const APP_SCREENS = freezeEntries([
  { id: 'home', label: 'Trang chủ', icon: 'home' },
  { id: 'rewards', label: 'Phần thưởng', icon: 'gift' },
  { id: 'vouchers', label: 'Ưu đãi', icon: 'ticket' },
  { id: 'stores', label: 'Điểm bán', icon: 'pin' },
  { id: 'account', label: 'Tài khoản', icon: 'user' },
]);

export const VOUCHERS = freezeEntries([
  {
    id: 'fresh-50',
    value: '50.000đ',
    title: 'Giảm cho đơn KA Pods',
    detail: 'Áp dụng cho đơn từ 299.000đ',
    expires: '31/12/2026',
    tone: 'aqua',
  },
  {
    id: 'double-points',
    value: 'x2 điểm',
    title: 'Ngày giặt nhẹ tênh',
    detail: 'Nhân đôi điểm cho lần tích điểm tiếp theo',
    expires: '30/11/2026',
    tone: 'green',
  },
  {
    id: 'refill-20',
    value: '20%',
    title: 'Ưu đãi túi nạp lại',
    detail: 'Dành cho thành viên KA Fresh',
    expires: '15/01/2027',
    tone: 'navy',
  },
]);

export const STORES = freezeEntries([
  {
    id: 'hcm-district-1',
    name: 'KA Store Nguyễn Huệ',
    address: '42 Nguyễn Huệ, Quận 1',
    city: 'Hồ Chí Minh',
    hours: '08:00–21:30',
    distance: '1,2 km',
  },
  {
    id: 'hcm-district-7',
    name: 'KA Store Crescent Mall',
    address: '101 Tôn Dật Tiên, Quận 7',
    city: 'Hồ Chí Minh',
    hours: '09:30–22:00',
    distance: '5,8 km',
  },
  {
    id: 'hanoi-hoankiem',
    name: 'KA Store Tràng Tiền',
    address: '24 Hai Bà Trưng, Hoàn Kiếm',
    city: 'Hà Nội',
    hours: '08:30–21:00',
    distance: 'Theo khu vực',
  },
]);
