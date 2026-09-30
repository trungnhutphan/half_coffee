function getTotal(cart) {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function canPlaceOrder(cart, paymentMethod) {
  return Boolean(paymentMethod) && getTotal(cart) > 0;
}

export function createDemoOrder(cart, fulfillment, paymentMethod, now) {
  if (!canPlaceOrder(cart, paymentMethod)) {
    return null;
  }

  const timestamp = now.toISOString();
  const [date, time] = timestamp.split('T');
  const code = `EH-${date.replaceAll('-', '')}-${time.slice(0, 5).replace(':', '')}`;

  return {
    code,
    fulfillment,
    paymentMethod,
    total: getTotal(cart),
    createdAt: timestamp,
  };
}
